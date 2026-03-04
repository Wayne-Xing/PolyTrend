const { getLang, getPack, setStoredLang } = require('../../utils/i18n');
const {
  callUserAuth,
  setStoredUser,
  applyAuthToApp,
  getStoredUser,
} = require('../../utils/auth');

function showToast(title, icon = 'none') {
  wx.showToast({ title, icon, duration: 1800 });
}

Page({
  data: {
    lang: 'zh',
    i18n: {},
    loginLoading: false,
  },

  onLoad() {
    this.syncLanguage();
    this.syncLoginState();
  },

  onShow() {
    this.syncLanguage();
    this.syncLoginState();
  },

  syncLanguage() {
    const lang = getLang();
    this.setData({
      lang,
      i18n: getPack(lang),
    });
  },

  onToggleLang() {
    const next = this.data.lang === 'en' ? 'zh' : 'en';
    setStoredLang(next);
    this.syncLanguage();
  },

  syncLoginState() {
    const app = getApp();
    const stored = getStoredUser();
    const user = (app.globalData && app.globalData.user) || stored;
    if (user && user.openid) {
      applyAuthToApp(user);
      wx.reLaunch({ url: '/pages/trending/index' });
    }
  },

  getUserProfileSafe() {
    return new Promise((resolve, reject) => {
      if (typeof wx.getUserProfile !== 'function') {
        resolve({});
        return;
      }
      const desc = this.data.lang === 'en'
        ? 'Used to complete your profile after sign in'
        : '用于完善登录后的用户信息';
      wx.getUserProfile({
        desc,
        success: (res) => resolve((res && res.userInfo) || {}),
        fail: (err) => {
          const msg = String((err && err.errMsg) || '');
          if (msg.includes('cancel') || msg.includes('deny') || msg.includes('fail auth deny')) {
            resolve({});
            return;
          }
          reject(err);
        },
      });
    });
  },

  async onLogin() {
    if (this.data.loginLoading) return;
    const lang = this.data.lang;
    this.setData({ loginLoading: true });
    wx.showLoading({ title: lang === 'en' ? 'Signing in...' : '登录中...' });

    try {
      const profile = await this.getUserProfileSafe();
      const result = await callUserAuth('login', { profile, lang });
      if (!result || !result.success || !result.user || !result.user.openid) {
        throw new Error((result && result.message) || 'login_failed');
      }

      const user = setStoredUser(result.user) || result.user;
      applyAuthToApp(user);

      wx.hideLoading();
      showToast(
        result.isNewUser
          ? (lang === 'en' ? 'Registration success' : '注册成功')
          : (lang === 'en' ? 'Login success' : '登录成功'),
        'success',
      );
      setTimeout(() => {
        wx.reLaunch({ url: '/pages/trending/index' });
      }, 220);
    } catch (err) {
      wx.hideLoading();
      const msg = String((err && err.errMsg) || (err && err.message) || '');
      if (msg.includes('cloud_unavailable')) {
        showToast(lang === 'en' ? 'Cloud is unavailable' : '当前基础库不支持云开发');
        return;
      }
      if (msg.includes('function not found') || msg.includes('FunctionName')) {
        showToast(lang === 'en' ? 'Deploy cloud function userAuth first' : '请先部署云函数 userAuth');
        return;
      }
      showToast(lang === 'en' ? 'Login failed, please retry' : '登录失败，请重试');
    } finally {
      this.setData({ loginLoading: false });
    }
  },

  onBrowse() {
    wx.reLaunch({ url: '/pages/trending/index' });
  },
});
