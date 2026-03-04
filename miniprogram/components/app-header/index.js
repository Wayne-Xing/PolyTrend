const { text } = require('../../utils/i18n');

Component({
  properties: {
    lang: {
      type: String,
      value: 'zh',
    },
    title: {
      type: String,
      value: '',
    },
    showBack: {
      type: Boolean,
      value: false,
    },
    backText: {
      type: String,
      value: '',
    },
    backUrl: {
      type: String,
      value: '',
    },
    backOnly: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    brandTitle: 'PolyTrend',
    brandTagTop: 'Pro',
    brandTagBottom: '小程序',
    langSwitchText: '',
    backLabel: '',
    headerTop: 64,
    menuHeight: 32,
  },
  observers: {
    lang() {
      this.syncLanguage();
    },
    backText() {
      this.syncLanguage();
    },
  },
  lifetimes: {
    attached() {
      this.initLayout();
      this.syncLanguage();
    },
  },
  methods: {
    initLayout() {
      try {
        const menu = wx.getMenuButtonBoundingClientRect();
        const sys = wx.getSystemInfoSync();
        const statusBar = sys.statusBarHeight || 20;
        const headerTop = Math.max(menu.top, statusBar + 4);
        const menuHeight = Math.max(menu.height, 28);
        this.setData({ headerTop, menuHeight });
      } catch (err) {
        this.setData({ headerTop: 64, menuHeight: 32 });
      }
    },
    syncLanguage() {
      const lang = this.properties.lang === 'en' ? 'en' : 'zh';
      const miniProgramText = lang === 'en' ? 'Mini Program' : '小程序';
      const backLabel = this.properties.backText || (lang === 'en' ? '<Back' : '<返回');
      this.setData({
        brandTitle: 'PolyTrend',
        brandTagTop: 'Pro',
        brandTagBottom: miniProgramText,
        langSwitchText: text('langSwitch', lang),
        backLabel,
      });
    },
    onToggleLang() {
      this.triggerEvent('togglelang');
    },
    onBackTap() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack({ delta: 1 });
        return;
      }
      if (this.properties.backUrl) {
        wx.redirectTo({ url: this.properties.backUrl });
        return;
      }
      wx.reLaunch({ url: '/pages/profile/index' });
    },
  },
});
