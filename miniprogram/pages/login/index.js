const { getLang, getPack, setStoredLang } = require('../../utils/i18n');

Page({
  data: {
    lang: 'zh',
    i18n: {},
  },

  onLoad() {
    this.syncLanguage();
  },

  onShow() {
    this.syncLanguage();
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

  onLogin() {
    wx.reLaunch({ url: '/pages/trending/index' });
  },

  onBrowse() {
    wx.reLaunch({ url: '/pages/trending/index' });
  },
});

