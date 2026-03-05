App({
  globalData: {
    userInfo: null,
    settings: {
      duration: 3,
      mode: 'guided',
      audioEnabled: true,
      reminderTime: '21:00'
    }
  },

  onLaunch() {
    // 加载本地设置
    const settings = wx.getStorageSync('zhiguan_settings')
    if (settings) {
      this.globalData.settings = { ...this.globalData.settings, ...settings }
    }
    
    // 加载练习记录
    const records = wx.getStorageSync('zhiguan_records')
    if (!records) {
      wx.setStorageSync('zhiguan_records', [])
    }
  }
})