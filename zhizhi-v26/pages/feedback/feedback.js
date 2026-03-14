/**pages/feedback/feedback.js**/
Page({
  data: {
    statusBarHeight: 44,
    recordId: null,
    duration: 3,
    completed: true,
    rating: 0,
    ratingText: '',
    notes: '',
    feedbackTags: [
      { name: '身心放松', selected: false },
      { name: '专注平静', selected: false },
      { name: '杂念较多', selected: false },
      { name: '时间太短', selected: false },
      { name: '效果很好', selected: false },
      { name: '需要坚持', selected: false }
    ]
  },

  ratingTexts: ['', '需要调整', '一般', '还不错', '很好', '非常好'],

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync()
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      recordId: options.recordId,
      duration: parseInt(options.duration) || 3,
      completed: options.completed === 'true'
    })
  },

  // 设置评分
  setRating(e) {
    const rating = parseInt(e.currentTarget.dataset.rating)
    this.setData({
      rating,
      ratingText: this.ratingTexts[rating]
    })
    
    wx.vibrateShort({ type: 'light' })
  },

  // 切换标签
  toggleTag(e) {
    const index = e.currentTarget.dataset.index
    const tags = this.data.feedbackTags
    tags[index].selected = !tags[index].selected
    
    this.setData({ feedbackTags: tags })
    wx.vibrateShort({ type: 'light' })
  },

  // 输入备注
  onNotesInput(e) {
    this.setData({
      notes: e.detail.value
    })
  },

  // 自动保存笔记
  autoSaveNotes() {
    this.saveFeedback(true)
  },

  // 保存反馈
  saveFeedback(auto = false) {
    const selectedTags = this.data.feedbackTags
      .filter(t => t.selected)
      .map(t => t.name)
    
    // 更新记录
    const records = wx.getStorageSync('zhiguan_records') || []
    const recordIndex = records.findIndex(r => r.id == this.data.recordId)
    
    if (recordIndex >= 0) {
      records[recordIndex].rating = this.data.rating
      records[recordIndex].tags = selectedTags
      records[recordIndex].notes = this.data.notes
      wx.setStorageSync('zhiguan_records', records)
    }
    
    if (!auto) {
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/record/record'
        })
      }, 1000)
    }
  },

  // 页面隐藏时自动保存
  onHide() {
    this.saveFeedback(true)
  },

  // 页面卸载时自动保存
  onUnload() {
    this.saveFeedback(true)
  },
})