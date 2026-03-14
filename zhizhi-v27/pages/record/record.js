/**pages/record/record.js**/
Page({
  data: {
    statusBarHeight: 44,
    totalSessions: 0,
    totalHours: 0,
    streak: 0,
    currentYear: 2026,
    currentMonth: 2,
    monthCount: 0,
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: [],
    records: []
  },

  allRecords: [],

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const now = new Date()
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1
    })
    
    this.loadRecords()
  },

  onShow() {
    this.loadRecords()
  },

  // 加载记录
  loadRecords() {
    this.allRecords = wx.getStorageSync('zhiguan_records') || []
    
    // 计算统计数据
    this.calculateStats()
    
    // 生成日历
    this.generateCalendar()
    
    // 生成最近记录列表
    this.generateRecordList()
  },

  // 计算统计数据
  calculateStats() {
    const totalSessions = this.allRecords.length
    const totalMinutes = this.allRecords.reduce((sum, r) => sum + r.duration, 0)
    const totalHours = Math.floor(totalMinutes / 60 * 10) / 10
    const streak = this.calculateStreak()
    
    this.setData({ totalSessions, totalHours, streak })
  },

  // 计算连续天数
  calculateStreak() {
    if (this.allRecords.length === 0) return 0
    
    const dates = [...new Set(this.allRecords.map(r => new Date(r.date).toDateString()))]
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

  // 生成日历
  generateCalendar() {
    const { currentYear, currentMonth } = this.data
    
    // 获取当月第一天是星期几
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay()
    
    // 获取当月天数
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
    
    // 生成日历数据
    const calendarDays = []
    
    // 空白天数
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ day: '', date: '', hasRecord: false })
    }
    
    // 当月天数
    const today = new Date()
    let monthCount = 0
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(currentYear, currentMonth - 1, day).toDateString()
      const hasRecord = this.allRecords.some(r => 
        new Date(r.date).toDateString() === dateStr
      )
      
      if (hasRecord) monthCount++
      
      const isToday = today.getDate() === day && 
        today.getMonth() + 1 === currentMonth &&
        today.getFullYear() === currentYear
      
      calendarDays.push({
        day,
        date: dateStr,
        hasRecord,
        isToday
      })
    }
    
    this.setData({ calendarDays, monthCount })
  },

  // 生成记录列表
  generateRecordList() {
    const records = this.allRecords.slice(0, 20).map(r => {
      const date = new Date(r.date)
      return {
        ...r,
        day: date.getDate(),
        month: date.getMonth() + 1,
        stars: r.rating ? Array(r.rating).fill('★') : []
      }
    })
    
    this.setData({ records })
  },

  // 点击日期
  onDayTap(e) {
    const date = e.currentTarget.dataset.date
    const hasRecord = e.currentTarget.dataset.hasrecord
    
    if (!date) return
    
    if (hasRecord) {
      // 查找该日期的所有记录
      const dayRecords = this.allRecords.filter(r => 
        new Date(r.date).toDateString() === date
      )
      
      if (dayRecords.length > 0) {
        // 显示该日期的练习详情
        const record = dayRecords[0]
        const dateObj = new Date(record.date)
        const dateStr = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
        
        let content = `练习时长：${record.duration}分钟\n`
        if (record.completed) {
          content += '完成状态：已完成\n'
        } else {
          content += '完成状态：提前结束\n'
        }
        if (record.rating) {
          content += `评分：${'★'.repeat(record.rating)}\n`
        }
        if (record.tags && record.tags.length > 0) {
          content += `感受：${record.tags.join('、')}\n`
        }
        if (record.notes) {
          content += `\n心得：${record.notes}`
        }
        
        wx.showModal({
          title: `${dateStr} 练习记录`,
          content: content,
          showCancel: false,
          confirmText: '知道了'
        })
      }
    } else {
      wx.showToast({
        title: '该日期无练习记录',
        icon: 'none'
      })
    }
  },

  // 上一个月
  prevMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth--
    if (currentMonth < 1) {
      currentMonth = 12
      currentYear--
    }
    this.setData({ currentYear, currentMonth }, () => {
      this.generateCalendar()
    })
  },

  // 下一个月
  nextMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth++
    if (currentMonth > 12) {
      currentMonth = 1
      currentYear++
    }
    this.setData({ currentYear, currentMonth }, () => {
      this.generateCalendar()
    })
  }
})