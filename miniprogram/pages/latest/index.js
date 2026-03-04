const {
  getLang,
  getPack,
  setStoredLang,
  pickText,
  formatPercent,
  toneClass,
  trendClass,
  buildCoverStyle,
} = require('../../utils/i18n');
const { getLatestMarkets } = require('../../utils/mock-data');

const coverPalettes = [
  'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
  'linear-gradient(135deg, #9333ea 0%, #f472b6 100%)',
  'linear-gradient(135deg, #115e59 0%, #0d9488 100%)',
  'linear-gradient(135deg, #0f766e 0%, #22c55e 100%)',
];

function getGridClass(count) {
  if (count >= 4) return 'four';
  if (count === 3) return 'three';
  return 'two';
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
      pageTitle: i18n.pages.latest.title,
      sectionTitle: i18n.pages.latest.sectionTitle,
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
    this.rawMarkets = getLatestMarkets();
    this.renderMarkets();
    this.setData({ loading: false });
  },

  renderMarkets() {
    const lang = this.data.lang;
    const i18n = this.data.i18n;
    const markets = this.rawMarkets.map((market, index) => {
      let outcomes = Array.isArray(market.outcomes) ? market.outcomes : (Array.isArray(market.options) ? market.options : []);
      if (!outcomes.length) {
        outcomes = [{ label: i18n.common.awaitingData, percent: '--', tone: 'neutral' }];
      }
      let chips = Array.isArray(market.chips) && market.chips.length
        ? market.chips
        : outcomes.slice(0, 4).map((item) => ({ label: item.label, tone: item.tone || 'neutral' }));
      if (!chips.length) {
        chips = [{ label: i18n.common.noOptions, tone: 'neutral' }];
      }

      let topPercentSource = market.topPercent !== undefined ? market.topPercent : market.probability;
      if ((topPercentSource === undefined || topPercentSource === null) && outcomes.length) {
        topPercentSource = outcomes[0].percent;
      }

      return {
        id: market.id || `latest-${index}`,
        coverStyle: buildCoverStyle(market.image || market.coverImage || market.banner, coverPalettes, index),
        coverTitle: pickText(market.coverTitle || market.cover || market.title || market.topic || market.category, lang),
        badge: pickText(market.badge || market.emoji, lang) || '🆕',
        topic: pickText(market.topic || market.category, lang) || i18n.common.market,
        deadline: pickText(market.deadline || market.endTimeText || market.endTime || market.time, lang) || i18n.common.liveUpdates,
        question: pickText(market.question || market.title || market.topic, lang),
        topPercent: formatPercent(topPercentSource),
        trendClass: trendClass(market.topTrend || market.trend),
        outcomes: outcomes.map((item) => ({
          label: pickText(item.label, lang),
          percent: formatPercent(item.percent),
        })),
        chips: chips.map((item) => ({
          label: pickText(item.label, lang),
          toneClass: toneClass(item.tone),
        })),
        gridClass: getGridClass(chips.length),
        volume: pickText(market.volume || market.volumeText || market.turnover, lang) || i18n.common.volumeFallback,
        favorite: !!(market.favorite || market.isFavorite),
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

