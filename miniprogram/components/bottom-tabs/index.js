const { text } = require('../../utils/i18n');

const routeMap = {
  trending: '/pages/trending/index',
  breaking: '/pages/breaking/index',
  latest: '/pages/latest/index',
  whales: '/pages/whales/index',
  profile: '/pages/profile/index',
};

Component({
  properties: {
    lang: {
      type: String,
      value: 'zh',
    },
    value: {
      type: String,
      value: 'trending',
    },
  },
  data: {
    labels: {
      trending: '热点',
      breaking: '突发',
      latest: '最新',
      whales: '巨鲸',
      profile: '我的',
    },
  },
  observers: {
    lang() {
      this.syncLabels();
    },
  },
  lifetimes: {
    attached() {
      this.syncLabels();
    },
  },
  methods: {
    syncLabels() {
      const lang = this.properties.lang === 'en' ? 'en' : 'zh';
      this.setData({
        labels: {
          trending: text('tabs.trending', lang),
          breaking: text('tabs.breaking', lang),
          latest: text('tabs.latest', lang),
          whales: text('tabs.whales', lang),
          profile: text('tabs.profile', lang),
        },
      });
    },
    onTabChange(event) {
      const target = event.detail && event.detail.value;
      if (!target || target === this.properties.value || !routeMap[target]) {
        return;
      }
      wx.reLaunch({ url: routeMap[target] });
    },
  },
});

