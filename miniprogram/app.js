const { getStoredLang, normalizeLang } = require('./utils/i18n');
const { getStoredUser, applyAuthToApp } = require('./utils/auth');

const CLOUD_ENV_ID = '';

App({
  globalData: {
    lang: 'zh',
    currentEvent: null,
    favoriteItemsCache: null,
    cloudReady: false,
    cloudEnvId: CLOUD_ENV_ID,
    isLoggedIn: false,
    user: null,
    openid: '',
  },

  onLaunch() {
    this.globalData.lang = normalizeLang(getStoredLang());
    this.initCloud();
    const user = getStoredUser();
    if (user) {
      applyAuthToApp(user);
    }
  },

  initCloud() {
    if (!wx.cloud) {
      this.globalData.cloudReady = false;
      return;
    }
    try {
      const initOptions = { traceUser: true };
      if (CLOUD_ENV_ID) {
        initOptions.env = CLOUD_ENV_ID;
      }
      wx.cloud.init(initOptions);
      this.globalData.cloudReady = true;
    } catch (err) {
      this.globalData.cloudReady = false;
    }
  },
});
