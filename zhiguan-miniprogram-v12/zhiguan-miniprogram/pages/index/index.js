/**pages/index/index.js**/
const app = getApp()

Page({
  data: {
    statusBarHeight: 44,
    greeting: '你好',
    todayCount: 0,
    streak: 0,
    duration: 3,
    breathing: true
  },

  onLoad() {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    })
    
    // 设置问候语
    this.setGreeting()
    
    // 加载设置
    this.loadSettings()
    
    // 加载统计数据
    this.loadStats()
  },

  onShow() {
    this.loadStats()
  },

  // 设置问候语
  setGreeting() {
    const hour = new Date().getHours()
    let greeting = '你好'
    if (hour < 6) greeting = '夜深了'
    else if (hour < 9) greeting = '早安'
    else if (hour < 12) greeting = '上午好'
    else if (hour < 14) greeting = '午安'
    else if (hour < 18) greeting = '下午好'
    else greeting = '晚上好'
    
    this.setData({ greeting })
  },

  // 加载设置
  loadSettings() {
    const settings = app.globalData.settings
    this.setData({
      duration: settings.duration || 3
    })
  },

  // 加载统计数据
  loadStats() {
    const records = wx.getStorageSync('zhiguan_records') || []
    
    // 今日练习次数
    const today = new Date().toDateString()
    const todayCount = records.filter(r => new Date(r.date).toDateString() === today).length
    
    // 连续天数
    const streak = this.calculateStreak(records)
    
    this.setData({ todayCount, streak })
  },

  // 计算连续天数
  calculateStreak(records) {
    if (records.length === 0) return 0
    
    const dates = [...new Set(records.map(r => new Date(r.date).toDateString()))]
      .sort((a, b) => new Date(b) - new Date(a))
    
    let streak = 0
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (dates[0] === today || dates[0] === yesterday) {
      streak = 1
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1])
        const curr = new Date(dates[i])
        if ((prev - curr) / 86400000 === 1) {
          streak++
        } else {
          break
        }
      }
    }
    
    return streak
  },

  // 选择时长
  selectDuration(e) {
    const duration = parseInt(e.currentTarget.dataset.duration)
    this.setData({ duration })
    
    // 保存设置
    app.globalData.settings.duration = duration
    wx.setStorageSync('zhiguan_settings', app.globalData.settings)
    
    // 震动反馈
    wx.vibrateShort({ type: 'light' })
  },

  // 开始练习 - 默认使用风铃音效
  startPractice() {
    wx.vibrateShort({ type: 'medium' })
    
    wx.navigateTo({
      url: `/pages/practice/practice?duration=${this.data.duration}&audio=windchime`
    })
  }
})
