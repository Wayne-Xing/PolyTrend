const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();

  const openid = wxContext.OPENID;
  const nickname = String((event && event.nickname) || '').trim();
  const avatarUrl = String((event && event.avatarUrl) || '').trim();
  const language = (event && event.language) || 'zh-CN';

  if (!openid) {
    return {
      code: 500,
      message: 'openid not found',
    };
  }

  if (!nickname) {
    return {
      code: 400,
      message: 'nickname is required',
      openid,
    };
  }

  if (!avatarUrl) {
    return {
      code: 400,
      message: 'avatarUrl is required',
      openid,
    };
  }

  const users = db.collection('users');
  const now = db.serverDate();

  const existed = await users.where({ openid }).limit(1).get();

  if (existed.data.length > 0) {
    const doc = existed.data[0];
    await users.doc(doc._id).update({
      data: {
        nickname,
        avatarUrl,
        language,
        lastLoginAt: now,
      },
    });

    return {
      code: 0,
      message: 'login success',
      isNewUser: false,
      openid,
      user: {
        _id: doc._id,
        openid,
        nickname,
        avatarUrl,
        language,
      },
    };
  }

  const addRes = await users.add({
    data: {
      openid,
      nickname,
      avatarUrl,
      language,
      createdAt: now,
      lastLoginAt: now,
    },
  });

  return {
    code: 0,
    message: 'register success',
    isNewUser: true,
    openid,
    user: {
      _id: addRes._id,
      openid,
      nickname,
      avatarUrl,
      language,
    },
  };
};
