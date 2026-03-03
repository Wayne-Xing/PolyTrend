import { FavoriteCardData, favoriteEvents, formatNow, getLangButton, goTab, TabKey, toggleLang } from '../../utils/poly'

let clockTimer: number | null = null

Page({
  data: {
    tabValue: 'profile' as TabKey,
    clockText: '',
    langBtnText: '简体中文 | EN',
    langChecked: false,
    favorites: favoriteEvents as FavoriteCardData[],
  },

  onLoad() {
    const app = getApp<IAppOption>()
    const isEn = app.globalData.lang === 'en'
    this.setData({
      clockText: formatNow(),
      langBtnText: getLangButton(app.globalData.lang),
      langChecked: isEn,
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
    this.setData({
      langBtnText: getLangButton(nextLang),
      langChecked: nextLang === 'en',
    })
  },

  onLangSwitch(e: WechatMiniprogram.CustomEvent<{ value: boolean }>) {
    const checked = Boolean(e.detail.value)
    const app = getApp<IAppOption>()
    const nextLang = checked ? 'en' : 'zh-CN'
    app.globalData.lang = nextLang
    wx.setStorageSync('lang', nextLang)
    this.setData({
      langBtnText: getLangButton(nextLang),
      langChecked: checked,
    })
  },

  onTabChange(e: WechatMiniprogram.CustomEvent<{ value: string }>) {
    goTab('profile', String(e.detail.value))
  },

  onOpenDetail(e: WechatMiniprogram.BaseEvent) {
    const title = String(e.currentTarget.dataset.title || '')
    wx.navigateTo({
      url: `/pages/event-detail/event-detail?title=${encodeURIComponent(title)}`,
    })
  },

  onLogout() {
    wx.showToast({ title: '已退出登录', icon: 'success' })
    wx.redirectTo({ url: '/pages/login/login' })
  },

  onPullDownRefresh() {
    wx.showToast({ title: '个人信息已刷新', icon: 'success' })
    wx.stopPullDownRefresh()
  },
})
