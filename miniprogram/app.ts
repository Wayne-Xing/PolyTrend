// app.ts
App<IAppOption>({
  globalData: {
    lang: 'zh-CN',
  },
  onLaunch() {
    const savedLang = wx.getStorageSync('lang') as string | undefined
    if (savedLang === 'en' || savedLang === 'zh-CN') {
      this.globalData.lang = savedLang
    }
  },
})
