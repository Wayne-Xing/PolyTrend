const { getLang, getPack, setStoredLang, pickText } = require('../../utils/i18n');
const { getDetailFallback } = require('../../utils/mock-data');

Page({
  data: {
    lang: 'zh',
    i18n: {},
    pageTitle: '',
    eventTitle: '',
    eventSource: '',
  },

  currentEvent: null,

  onLoad() {
    this.currentEvent = this.resolveEvent();
    this.syncLanguage();
  },

  onShow() {
    this.currentEvent = this.resolveEvent();
    this.syncLanguage();
  },

  resolveEvent() {
    const app = getApp();
    const event = app && app.globalData ? app.globalData.currentEvent : null;
    return event || getDetailFallback();
  },

  syncLanguage() {
    const lang = getLang();
    const i18n = getPack(lang);
    const event = this.currentEvent || getDetailFallback();
    this.setData({
      lang,
      i18n,
      pageTitle: i18n.pages.detail.title,
      eventTitle: pickText(event.title, lang),
      eventSource: `${i18n.pages.detail.sourcePrefix}${event.source || 'polymarket.com / event/123456'}`,
    });
  },

  onToggleLang() {
    const next = this.data.lang === 'en' ? 'zh' : 'en';
    setStoredLang(next);
    this.syncLanguage();
  },
});

