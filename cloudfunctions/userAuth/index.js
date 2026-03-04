const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const users = db.collection('users');

function toSafeString(value) {
  return String(value || '').trim();
}

function normalizeNickname(value) {
  const raw = toSafeString(value);
  if (!raw) return '';
  if (raw === '\u5fae\u4fe1\u7528\u6237' || raw === 'WeChat User') {
    return '\u8d8b\u52bf\u7528\u6237';
  }
  return raw;
}

function sanitizeProfile(profile) {
  const source = profile && typeof profile === 'object' ? profile : {};
  return {
    nickName: normalizeNickname(source.nickName),
    avatarUrl: toSafeString(source.avatarUrl),
    gender: Number(source.gender) || 0,
    city: toSafeString(source.city),
    province: toSafeString(source.province),
    country: toSafeString(source.country),
    language: toSafeString(source.language),
  };
}

function buildDefaultNickName(openid) {
  return '\u8d8b\u52bf\u7528\u6237';
}

function serializeUser(doc, openid) {
  if (!doc) return null;
  return {
    _id: doc._id || '',
    openid,
    nickName: normalizeNickname(doc.nickName) || buildDefaultNickName(openid),
    avatarUrl: toSafeString(doc.avatarUrl),
    gender: Number(doc.gender) || 0,
    city: toSafeString(doc.city),
    province: toSafeString(doc.province),
    country: toSafeString(doc.country),
    language: toSafeString(doc.language),
    createdAt: Number(doc.createdAt) || 0,
    lastLoginAt: Number(doc.lastLoginAt) || 0,
  };
}

async function getUserByOpenid(openid) {
  if (!openid) return null;

  const byOpenid = await users.where({ openid }).limit(1).get();
  if (byOpenid.data && byOpenid.data.length) {
    return byOpenid.data[0];
  }

  // Backward compatibility: older records may only have _openid.
  const bySystemOpenid = await users.where({ _openid: openid }).limit(1).get();
  if (bySystemOpenid.data && bySystemOpenid.data.length) {
    const legacy = bySystemOpenid.data[0];
    if (!legacy.openid) {
      try {
        await users.doc(legacy._id).update({ data: { openid } });
      } catch (err) {
        // Ignore migration failure and still return legacy doc.
      }
      return { ...legacy, openid };
    }
    return legacy;
  }

  return null;
}

async function loginOrRegister(openid, profile, lang) {
  const now = Date.now();
  const safeProfile = sanitizeProfile(profile);
  const current = await getUserByOpenid(openid);

  if (current) {
    const updateData = {
      openid,
      lastLoginAt: now,
      language: toSafeString(lang) || current.language || safeProfile.language,
    };

    if (safeProfile.nickName) updateData.nickName = safeProfile.nickName;
    if (safeProfile.avatarUrl) updateData.avatarUrl = safeProfile.avatarUrl;
    if (safeProfile.gender) updateData.gender = safeProfile.gender;
    if (safeProfile.city) updateData.city = safeProfile.city;
    if (safeProfile.province) updateData.province = safeProfile.province;
    if (safeProfile.country) updateData.country = safeProfile.country;
    if (safeProfile.language) updateData.language = safeProfile.language;

    await users.doc(current._id).update({ data: updateData });
    const latest = await users.doc(current._id).get();
    return {
      isNewUser: false,
      user: serializeUser(latest.data, openid),
    };
  }

  const createData = {
    openid,
    nickName: safeProfile.nickName || buildDefaultNickName(openid),
    avatarUrl: safeProfile.avatarUrl || '',
    gender: safeProfile.gender || 0,
    city: safeProfile.city || '',
    province: safeProfile.province || '',
    country: safeProfile.country || '',
    language: safeProfile.language || toSafeString(lang) || '',
    createdAt: now,
    lastLoginAt: now,
  };

  const added = await users.add({ data: createData });
  const latest = await users.doc(added._id).get();
  return {
    isNewUser: true,
    user: serializeUser(latest.data, openid),
  };
}

async function ensureUserByOpenid(openid) {
  let current = await getUserByOpenid(openid);
  if (current) return current;
  await loginOrRegister(openid, {}, '');
  current = await getUserByOpenid(openid);
  return current;
}

async function updateAvatar(openid, avatarUrl) {
  const current = await ensureUserByOpenid(openid);
  if (!current) {
    throw new Error('user_not_found');
  }
  const nextAvatarUrl = toSafeString(avatarUrl);
  if (!nextAvatarUrl) {
    throw new Error('avatar_required');
  }
  await users.doc(current._id).update({
    data: {
      avatarUrl: nextAvatarUrl,
      lastLoginAt: Date.now(),
    },
  });
  const latest = await users.doc(current._id).get();
  return serializeUser(latest.data, openid);
}

async function updateNickname(openid, nickName) {
  const current = await ensureUserByOpenid(openid);
  if (!current) {
    throw new Error('user_not_found');
  }
  const nextNickName = normalizeNickname(nickName);
  if (!nextNickName) {
    throw new Error('nickname_required');
  }
  await users.doc(current._id).update({
    data: {
      nickName: nextNickName,
      lastLoginAt: Date.now(),
    },
  });
  const latest = await users.doc(current._id).get();
  return serializeUser(latest.data, openid);
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const openid = toSafeString(wxContext.OPENID);
  const action = toSafeString(event && event.action) || 'login';

  if (!openid) {
    return { success: false, message: 'openid_not_found' };
  }

  try {
    if (action === 'login') {
      const result = await loginOrRegister(openid, event.profile, event.lang);
      return {
        success: true,
        isNewUser: result.isNewUser,
        user: result.user,
      };
    }

    if (action === 'getProfile') {
      const current = await getUserByOpenid(openid);
      if (!current) {
        return { success: false, message: 'user_not_found' };
      }
      return {
        success: true,
        user: serializeUser(current, openid),
      };
    }

    if (action === 'updateAvatar') {
      const user = await updateAvatar(openid, event.avatarUrl);
      return {
        success: true,
        user,
      };
    }

    if (action === 'updateNickname') {
      const user = await updateNickname(openid, event.nickName);
      return {
        success: true,
        user,
      };
    }

    if (action === 'logout') {
      return { success: true };
    }

    return {
      success: false,
      message: 'unsupported_action',
    };
  } catch (err) {
    return {
      success: false,
      message: err && err.message ? err.message : 'server_error',
    };
  }
};
