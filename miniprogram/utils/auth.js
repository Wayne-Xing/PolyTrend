const STORAGE_USER_KEY = 'polytrend_user';
const AUTH_FUNCTION_NAME = 'userAuth';
const DEFAULT_NICKNAME = '\u8d8b\u52bf\u7528\u6237';
const GENERIC_NICKNAME_ZH = '\u5fae\u4fe1\u7528\u6237';
const GENERIC_NICKNAME_EN = 'WeChat User';

function safeGetStorage(key) {
  try {
    return wx.getStorageSync(key);
  } catch (err) {
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    wx.setStorageSync(key, value);
    return true;
  } catch (err) {
    return false;
  }
}

function safeRemoveStorage(key) {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (err) {
    return false;
  }
}

function normalizeNickname(name) {
  const raw = String(name || '').trim();
  if (!raw) return DEFAULT_NICKNAME;
  if (raw === GENERIC_NICKNAME_ZH || raw === GENERIC_NICKNAME_EN) {
    return DEFAULT_NICKNAME;
  }
  return raw;
}

function normalizeUser(rawUser) {
  if (!rawUser || typeof rawUser !== 'object') return null;
  const openid = String(rawUser.openid || rawUser._openid || '').trim();
  if (!openid) return null;
  const nickName = normalizeNickname(rawUser.nickName);
  const avatarUrl = String(rawUser.avatarUrl || '').trim();
  return {
    _id: rawUser._id || '',
    openid,
    nickName,
    avatarUrl,
    gender: Number(rawUser.gender) || 0,
    city: String(rawUser.city || ''),
    province: String(rawUser.province || ''),
    country: String(rawUser.country || ''),
    language: String(rawUser.language || ''),
    createdAt: Number(rawUser.createdAt) || 0,
    lastLoginAt: Number(rawUser.lastLoginAt) || 0,
  };
}

function getStoredUser() {
  return normalizeUser(safeGetStorage(STORAGE_USER_KEY));
}

function setStoredUser(user) {
  const normalized = normalizeUser(user);
  if (!normalized) return null;
  safeSetStorage(STORAGE_USER_KEY, normalized);
  return normalized;
}

function clearStoredUser() {
  safeRemoveStorage(STORAGE_USER_KEY);
}

function maskOpenid(openid) {
  const raw = String(openid || '').trim();
  if (!raw) return '';
  if (raw.length <= 8) return `${raw.slice(0, 2)}***${raw.slice(-2)}`;
  return `${raw.slice(0, 4)}***${raw.slice(-4)}`;
}

function applyAuthToApp(user) {
  const app = getApp && getApp();
  if (!app || !app.globalData) return;

  if (!user || !user.openid) {
    app.globalData.isLoggedIn = false;
    app.globalData.user = null;
    app.globalData.openid = '';
    return;
  }

  app.globalData.isLoggedIn = true;
  app.globalData.user = user;
  app.globalData.openid = user.openid;
}

function callUserAuth(action, data) {
  return new Promise((resolve, reject) => {
    if (!wx.cloud || !wx.cloud.callFunction) {
      reject(new Error('cloud_unavailable'));
      return;
    }
    wx.cloud.callFunction({
      name: AUTH_FUNCTION_NAME,
      data: {
        action,
        ...(data || {}),
      },
      success: (res) => {
        resolve((res && res.result) || {});
      },
      fail: reject,
    });
  });
}

module.exports = {
  AUTH_FUNCTION_NAME,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  maskOpenid,
  normalizeNickname,
  normalizeUser,
  applyAuthToApp,
  callUserAuth,
};
