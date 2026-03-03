Page({
  data: {
    current: 1,
  },

  onLogin() {
    wx.showToast({ title: '登录成功', icon: 'success' })
    wx.redirectTo({ url: '/pages/trending/trending' })
  },

  onSkip() {
    wx.redirectTo({ url: '/pages/trending/trending' })
  },
})
