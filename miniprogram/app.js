const { getStoredLang, normalizeLang } = require('./utils/i18n');

App({
  globalData: {
    lang: 'zh',
    currentEvent: null,
    favoriteItemsCache: null,
  },

  onLaunch() {
    this.globalData.lang = normalizeLang(getStoredLang());
  },
});
