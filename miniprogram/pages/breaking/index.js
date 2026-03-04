const {
  getLang,
  getPack,
  setStoredLang,
  pickText,
  buildCoverStyle,
} = require('../../utils/i18n');
const { getBreakingMarkets } = require('../../utils/mock-data');

const coverPalettes = [
  'linear-gradient(135deg,#0f766e,#14b8a6)',
  'linear-gradient(135deg,#1d4ed8,#7c3aed)',
  'linear-gradient(135deg,#b45309,#f97316)',
];

function toSparkline(points, tone) {
  const values = Array.isArray(points) && points.length ? points : [30, 28, 21, 25, 16, 10, 6];
  const width = 180;
  const height = 50;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / Math.max(values.length - 1, 1);
  const plot = values.map((value, idx) => {
    const x = Math.round(idx * step * 10) / 10;
    const y = Math.round((height - ((value - min) / span) * height) * 10) / 10;
    return { x, y };
  });

  const segments = [];
  for (let i = 0; i < plot.length - 1; i += 1) {
    const p1 = plot[i];
    const p2 = plot[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    segments.push({
      tone,
      style: `left:${p1.x}rpx;top:${p1.y}rpx;width:${length}rpx;transform:rotate(${angle}deg);`,
    });
  }

  const dots = plot.map((point) => ({
    tone,
    style: `left:${point.x - 3}rpx;top:${point.y - 3}rpx;`,
  }));

  return { segments, dots };
}

Page({
  data: {
    lang: 'zh',
    i18n: {},
    pageTitle: '',
    sectionTitle: '',
    markets: [],
    loading: true,
  },

  rawMarkets: [],

  onLoad() {
    this.syncLanguage();
    this.loadMarkets();
  },

  onShow() {
    const lang = getLang();
    if (lang !== this.data.lang) {
      this.syncLanguage();
      this.renderMarkets();
    }
  },

  onPullDownRefresh() {
    this.loadMarkets().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  syncLanguage() {
    const lang = getLang();
    const i18n = getPack(lang);
    this.setData({
      lang,
      i18n,
      pageTitle: i18n.pages.breaking.title,
      sectionTitle: i18n.pages.breaking.sectionTitle,
    });
  },

  onToggleLang() {
    const next = this.data.lang === 'en' ? 'zh' : 'en';
    setStoredLang(next);
    this.syncLanguage();
    this.renderMarkets();
  },

  async loadMarkets() {
    this.setData({ loading: true });
    this.rawMarkets = getBreakingMarkets();
    this.renderMarkets();
    this.setData({ loading: false });
  },

  renderMarkets() {
    const lang = this.data.lang;
    const i18n = this.data.i18n;
    const markets = this.rawMarkets.map((item, index) => {
      const deltaText = pickText(item.deltaText || item.delta, lang) || '--';
      const deltaClass = (item.deltaDirection === 'down' || /^▼|-/.test(deltaText)) ? 'down' : 'up';
      return {
        id: item.id || `breaking-${index}`,
        coverStyle: buildCoverStyle(item.image || item.coverImage || item.banner, coverPalettes, index),
        coverTitle: pickText(item.coverTitle || item.topic || item.title, lang) || this.data.pageTitle,
        question: pickText(item.question || item.title, lang),
        category: pickText(item.category, lang) || i18n.common.market,
        deadline: pickText(item.deadline || item.endTimeText || item.endTime, lang) || i18n.common.liveUpdates,
        deltaText,
        deltaClass,
        sparkline: toSparkline(item.sparkline, deltaClass),
        volume: pickText(item.volume || item.volumeText || item.turnover, lang) || i18n.common.volumeFallback,
        favorite: !!(item.favorite || item.isFavorite),
      };
    });
    this.setData({ markets });
  },

  onFavoriteTap(event) {
    const itemId = event.detail && event.detail.id;
    if (!itemId) return;
    this.rawMarkets = this.rawMarkets.map((item) => {
      if (item.id !== itemId) return item;
      const next = !item.favorite;
      return { ...item, favorite: next, isFavorite: next };
    });
    this.renderMarkets();
  },

  onCardTap(event) {
    const itemId = event.detail && event.detail.id;
    const current = this.rawMarkets.find((item) => item.id === itemId);
    if (!current) return;
    const app = getApp();
    app.globalData.currentEvent = {
      title: current.question || current.title,
      source: current.url || 'polymarket.com',
      url: current.url || 'https://polymarket.com/',
    };
    wx.navigateTo({ url: '/pages/event-detail/index' });
  },
});
