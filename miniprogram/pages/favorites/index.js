const {
  getLang,
  getPack,
  setStoredLang,
  pickText,
} = require('../../utils/i18n');
const { getFavoriteItems } = require('../../utils/mock-data');

const SWAP_THRESHOLD = 56;

Page({
  data: {
    lang: 'zh',
    i18n: {},
    sectionTitle: '',
    query: '',
    searchPlaceholder: '',
    backText: '',
    deleteActionText: '删\n除',
    items: [],
    draggingId: '',
  },

  allItems: [],
  dragContext: null,

  onLoad() {
    const app = getApp();
    const seed = Array.isArray(app.globalData.favoriteItemsCache)
      ? app.globalData.favoriteItemsCache
      : getFavoriteItems();

    this.allItems = seed.map((item) => ({
      ...item,
      favorite: item.favorite !== false,
      isFavorite: item.isFavorite !== false,
    }));
    this.syncLanguage();
    this.render();
  },

  onHide() {
    this.persistFavorites();
  },

  onUnload() {
    this.persistFavorites();
  },

  onShow() {
    const lang = getLang();
    if (lang !== this.data.lang) {
      this.syncLanguage();
      this.render();
    }
  },

  syncLanguage() {
    const lang = getLang();
    const i18n = getPack(lang);
    this.setData({
      lang,
      i18n,
      sectionTitle: i18n.pages.favorites.sectionTitle,
      searchPlaceholder: i18n.pages.favorites.searchPlaceholder,
      backText: lang === 'en' ? '<Back' : '<返回',
      deleteActionText: lang === 'en' ? 'D\nE\nL' : '删\n除',
    });
  },

  onToggleLang() {
    const next = this.data.lang === 'en' ? 'zh' : 'en';
    setStoredLang(next);
    this.syncLanguage();
    this.render();
  },

  getVisibleItems() {
    const lang = this.data.lang;
    const query = String(this.data.query || '').trim().toLowerCase();
    if (!query) return this.allItems.slice();

    return this.allItems.filter((item) => {
      const textLang = pickText(item.title, lang).toLowerCase();
      const textZh = pickText(item.title, 'zh').toLowerCase();
      const textEn = pickText(item.title, 'en').toLowerCase();
      return textLang.includes(query) || textZh.includes(query) || textEn.includes(query);
    });
  },

  renderList(items) {
    const lang = this.data.lang;
    const i18n = this.data.i18n;
    const categoryMap = {
      election: i18n.pages.favorites.election,
      policy: i18n.pages.favorites.policy,
      cloud: i18n.pages.favorites.cloud,
      sports: i18n.pages.favorites.sports,
      all: i18n.pages.favorites.all,
    };

    const viewItems = items.map((item) => {
      const image = item.image || 'https://picsum.photos/id/1043/420/260';
      return {
        id: item.id,
        title: pickText(item.title, lang),
        subtitle: pickText(item.subtitle, lang),
        meta: pickText(item.meta, lang),
        categoryText: `${i18n.common.categoryPrefix}${categoryMap[item.category] || ''}`,
        favorite: item.favorite !== false,
        dragging: item.id === this.data.draggingId,
        thumbStyle: `background-image:linear-gradient(135deg, rgba(9,21,43,0.12), rgba(9,21,43,0.56)), url('${image}');`,
        swipeRight: [
          {
            text: this.data.deleteActionText,
            className: 'fav-swipe-delete',
          },
        ],
      };
    });
    this.setData({ items: viewItems });
  },

  render() {
    this.renderList(this.getVisibleItems());
  },

  persistFavorites() {
    const app = getApp();
    app.globalData.favoriteItemsCache = this.allItems
      .filter((item) => item.favorite !== false)
      .map((item) => ({ ...item }));
  },

  onSearchChange(event) {
    const value = (event.detail && event.detail.value) || '';
    this.setData({ query: value });
    this.render();
  },

  removeItem(id) {
    if (!id) return;
    this.allItems = this.allItems.filter((item) => item.id !== id);
    if (this.data.draggingId === id) {
      this.setData({ draggingId: '' });
    }
    this.render();
  },

  onFavoriteTap(event) {
    const id = event.currentTarget.dataset.id;
    if (!id) return;
    this.allItems = this.allItems.map((item) => {
      if (item.id !== id) return item;
      const next = !(item.favorite !== false);
      return { ...item, favorite: next, isFavorite: next };
    });
    this.render();
  },

  onSwipeDelete(event) {
    const id = event.currentTarget.dataset.id;
    if (!id) return;
    wx.showModal({
      title: this.data.i18n.pages.favorites.deleteOne,
      content: this.data.i18n.pages.favorites.deleteConfirm,
      success: (res) => {
        if (!res.confirm) return;
        this.removeItem(id);
      },
    });
  },

  onItemTap(event) {
    const id = event.currentTarget.dataset.id;
    if (!id) return;
    const current = this.allItems.find((item) => item.id === id);
    if (!current) return;
    const app = getApp();
    app.globalData.currentEvent = {
      title: current.title,
      source: current.url || 'polymarket.com',
      url: current.url || 'https://polymarket.com/',
    };
    wx.navigateTo({ url: '/pages/event-detail/index' });
  },

  reorderById(sourceId, targetId) {
    if (!sourceId || !targetId || sourceId === targetId) return;
    const sourceIndex = this.allItems.findIndex((item) => item.id === sourceId);
    const targetIndex = this.allItems.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [moved] = this.allItems.splice(sourceIndex, 1);
    this.allItems.splice(targetIndex, 0, moved);
  },

  onDragStart(event) {
    const id = event.currentTarget.dataset.id;
    const touch = event.touches && event.touches[0];
    if (!id || !touch) return;
    this.dragContext = { id, startY: touch.clientY };
    this.setData({ draggingId: id });
  },

  onDragMove(event) {
    const touch = event.touches && event.touches[0];
    if (!this.dragContext || !touch) return;

    const deltaY = touch.clientY - this.dragContext.startY;
    if (Math.abs(deltaY) < SWAP_THRESHOLD) return;
    const direction = deltaY > 0 ? 1 : -1;
    const visibleItems = this.getVisibleItems();
    const currentIndex = visibleItems.findIndex((item) => item.id === this.dragContext.id);
    const targetIndex = currentIndex + direction;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= visibleItems.length) {
      return;
    }

    this.reorderById(this.dragContext.id, visibleItems[targetIndex].id);
    this.dragContext.startY = touch.clientY;
    this.render();
  },

  onDragEnd() {
    this.dragContext = null;
    this.setData({ draggingId: '' });
    this.render();
  },
});
