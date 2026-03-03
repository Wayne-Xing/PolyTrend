import { EventCardData, formatNow, getLangButton, goTab, TabKey, toggleLang, trendingEvents } from '../../utils/poly'

let clockTimer: number | null = null

Page({
  data: {
    tabValue: 'trending' as TabKey,
    clockText: '',
    langBtnText: '简体中文 | EN',
    events: trendingEvents as EventCardData[],
  },

  onLoad() {
    const app = getApp<IAppOption>()
    this.setData({
      clockText: formatNow(),
      langBtnText: getLangButton(app.globalData.lang),
    })

    clockTimer = setInterval(() => {
      this.setData({ clockText: formatNow() })
    }, 1000) as unknown as number
  },

  onUnload() {
    if (clockTimer !== null) {
      clearInterval(clockTimer)
      clockTimer = null
    }
  },

  onToggleLang() {
    const app = getApp<IAppOption>()
    const nextLang = toggleLang(app.globalData.lang)
    app.globalData.lang = nextLang
    wx.setStorageSync('lang', nextLang)
    this.setData({ langBtnText: getLangButton(nextLang) })
  },

  onTabChange(e: WechatMiniprogram.CustomEvent<{ value: string }>) {
    goTab('trending', String(e.detail.value))
  },

  onOpenDetail(e: WechatMiniprogram.BaseEvent) {
    const title = String(e.currentTarget.dataset.title || '')
    wx.navigateTo({
      url: `/pages/event-detail/event-detail?title=${encodeURIComponent(title)}`,
    })
  },

  onFavoriteTap() {
    wx.showToast({ title: '已加入收藏', icon: 'success' })
  },

  onPullDownRefresh() {
    wx.showToast({ title: '热点已刷新', icon: 'success' })
    wx.stopPullDownRefresh()
  },
})
