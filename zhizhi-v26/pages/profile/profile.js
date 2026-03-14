/**pages/profile/profile.js**/
const app = getApp()

Page({
  data: {
    statusBarHeight: 44,
    joinDate: '2026.02',
    reminderTime: '21:00',
    defaultSound: '大磬',
    darkMode: true,
    version: '1.0.0'
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    })
    
    this.loadSettings()
  },

  // 加载设置
  loadSettings() {
    const settings = app.globalData.settings
    const firstRecord = wx.getStorageSync('zhiguan_records')
    
    if (firstRecord && firstRecord.length > 0) {
      const firstDate = new Date(firstRecord[firstRecord.length - 1].date)
      this.setData({
        joinDate: `${firstDate.getFullYear()}.${(firstDate.getMonth() + 1).toString().padStart(2, '0')}`
      })
    }
    
    this.setData({
      reminderTime: settings.reminderTime || '21:00'
    })
  },

  // 设置提醒
  setReminder() {
    wx.showActionSheet({
      itemList: ['07:00', '08:00', '21:00', '22:00', '关闭提醒'],
      success: (res) => {
        const times = ['07:00', '08:00', '21:00', '22:00', '']
        const time = times[res.tapIndex]
        if (time) {
          this.setData({ reminderTime: time })
          app.globalData.settings.reminderTime = time
          wx.setStorageSync('zhiguan_settings', app.globalData.settings)
          
          wx.showToast({
            title: '设置成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 选择音效
  selectSound() {
    wx.showActionSheet({
      itemList: ['大磬', '引磬', '木鱼', '风铃', '水滴'],
      success: (res) => {
        const sounds = ['大磬', '引磬', '木鱼', '风铃', '水滴']
        this.setData({ defaultSound: sounds[res.tapIndex] })
        
        // 播放测试音效
        wx.vibrateShort({ type: 'light' })
      }
    })
  },

  // 切换深色模式
  toggleDarkMode(e) {
    this.setData({ darkMode: e.detail.value })
  },

  // 使用指南
  showGuide() {
    wx.showModal({
      title: '使用指南',
      content: '止观是一种古老的禅修方法。\n\n1. 调身：调整坐姿，放松身体\n2. 调息：关注呼吸，自然呼吸\n3. 观心：觉察心念，不随不拒\n4. 收功：慢慢回归，保持觉知',
      showCancel: false
    })
  },

  // 反馈
  feedback() {
    wx.showModal({
      title: '反馈建议',
      content: '',
      editable: true,
      placeholderText: '请输入您的建议...',
      success: (res) => {
        if (res.confirm && res.content) {
          wx.showToast({
            title: '感谢反馈',
            icon: 'success'
          })
        }
      }
    })
  },

  // 关于
  about() {
    wx.showModal({
      title: '关于止观AI',
      content: `版本：${this.data.version}\n\n止观AI是一款专注于正念冥想的微信小程序，帮助你在繁忙的生活中找到内心的宁静。`,
      showCancel: false
    })
  }
})