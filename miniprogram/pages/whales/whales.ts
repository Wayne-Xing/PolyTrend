import { formatNow, getLangButton, goTab, TabKey, toggleLang, WhaleCardData, whaleTrades } from '../../utils/poly'

let clockTimer: number | null = null

Page({
  data: {
    tabValue: 'whales' as TabKey,
    clockText: '',
    langBtnText: '简体中文 | EN',
    trades: whaleTrades as WhaleCardData[],
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
    goTab('whales', String(e.detail.value))
  },

  onFavoriteTap() {
    wx.showToast({ title: '已切换收藏', icon: 'success' })
  },

  onPullDownRefresh() {
    wx.showToast({ title: '巨鲸数据已刷新', icon: 'success' })
    wx.stopPullDownRefresh()
  },
})
