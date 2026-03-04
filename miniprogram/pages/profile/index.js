const { getLang, getPack, setStoredLang } = require('../../utils/i18n');

Page({
  data: {
    lang: 'zh',
    i18n: {},
    pageTitle: '',
  },

  onLoad() {
    this.syncLanguage();
  },

  onShow() {
    const lang = getLang();
    if (lang !== this.data.lang) {
      this.syncLanguage();
    }
  },

  syncLanguage() {
    const lang = getLang();
    const i18n = getPack(lang);
    this.setData({
      lang,
      i18n,
      pageTitle: i18n.pages.profile.title,
    });
  },

  onToggleLang() {
    const next = this.data.lang === 'en' ? 'zh' : 'en';
    setStoredLang(next);
    this.syncLanguage();
  },

  onGoFavorites() {
    wx.navigateTo({ url: '/pages/favorites/index' });
  },
});
