const {
  getLang,
  getPack,
  setStoredLang,
  pickText,
  buildCoverStyle,
} = require('../../utils/i18n');
const { getWhaleTrades } = require('../../utils/mock-data');

const coverPalettes = [
  'linear-gradient(135deg,#0f766e,#22c55e)',
  'linear-gradient(135deg,#7c3aed,#ec4899)',
  'linear-gradient(135deg,#1d4ed8,#38bdf8)',
];

Page({
  data: {
    lang: 'zh',
    i18n: {},
    pageTitle: '',
    sectionTitle: '',
    trades: [],
    loading: true,
  },

  rawTrades: [],

  onLoad() {
    this.syncLanguage();
    this.loadTrades();
  },

  onShow() {
    const lang = getLang();
    if (lang !== this.data.lang) {
      this.syncLanguage();
      this.renderTrades();
    }
  },

  onPullDownRefresh() {
    this.loadTrades().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  syncLanguage() {
    const lang = getLang();
    const i18n = getPack(lang);
    this.setData({
      lang,
      i18n,
      pageTitle: i18n.pages.whales.title,
      sectionTitle: i18n.pages.whales.sectionTitle,
    });
  },

  onToggleLang() {
    const next = this.data.lang === 'en' ? 'zh' : 'en';
    setStoredLang(next);
    this.syncLanguage();
    this.renderTrades();
  },

  async loadTrades() {
    this.setData({ loading: true });
    this.rawTrades = getWhaleTrades();
    this.renderTrades();
    this.setData({ loading: false });
  },

  renderTrades() {
    const lang = this.data.lang;
    const i18n = this.data.i18n;
    const trades = this.rawTrades.map((item, index) => {
      const isBuy = String(item.side || '').toLowerCase() !== 'sell';
      return {
        id: item.id || `whale-${index}`,
        coverStyle: buildCoverStyle(item.image || item.coverImage || item.banner, coverPalettes, index),
        coverTitle: pickText(item.coverTitle || item.title || item.market, lang) || this.data.pageTitle,
        amount: pickText(item.amount, lang) || '$0',
        tradeTime: pickText(item.time || item.tradeTime, lang),
        sideClass: isBuy ? 'buy' : 'sell',
        sideText: isBuy ? i18n.common.buy : i18n.common.sell,
        marketText: pickText(item.market || item.question || item.title, lang),
        positionText: pickText(item.position, lang),
        hashText: `${lang === 'en' ? 'Tx Hash: ' : '交易哈希：'}${pickText(item.txHash || item.hash, lang)}`,
        addressText: `${lang === 'en' ? 'On-chain Address: ' : '链上地址：'}${pickText(item.address || item.wallet, lang)}`,
        linkText: i18n.common.viewBlock,
        favorite: !!(item.favorite || item.isFavorite),
      };
    });
    this.setData({ trades });
  },

  onFavoriteTap(event) {
    const itemId = event.detail && event.detail.id;
    if (!itemId) return;
    this.rawTrades = this.rawTrades.map((item) => {
      if (item.id !== itemId) return item;
      const next = !item.favorite;
      return { ...item, favorite: next, isFavorite: next };
    });
    this.renderTrades();
  },

  onCardTap(event) {
    const itemId = event.detail && event.detail.id;
    const current = this.rawTrades.find((item) => item.id === itemId);
    if (!current) return;
    const app = getApp();
    app.globalData.currentEvent = {
      title: current.market || current.question || current.title,
      source: current.url || 'polymarket.com',
      url: current.url || 'https://polymarket.com/',
    };
    wx.navigateTo({ url: '/pages/event-detail/index' });
  },
});

