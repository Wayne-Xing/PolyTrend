import { formatNow, getLangButton, toggleLang } from '../../utils/poly'

let clockTimer: number | null = null

Page({
  data: {
    title: 'Event Detail',
    clockText: '',
    langBtnText: '简体中文 | EN',
  },

  onLoad(options: Record<string, string>) {
    const app = getApp<IAppOption>()
    const title = options.title ? decodeURIComponent(options.title) : 'Event Detail'
    this.setData({
      title,
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

  onOpenWebView() {
    wx.showToast({ title: '原型阶段：WebView 占位', icon: 'none' })
  },
})
