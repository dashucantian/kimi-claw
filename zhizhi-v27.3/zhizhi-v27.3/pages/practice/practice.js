/**pages/practice/practice.js**/
const app = getApp()

// 音效映射
const SOUND_MAP = {
  largeGong: '/assets/large_gong.mp3',
  smallBell: '/assets/small_bell.mp3',
  woodenFish: '/assets/wooden_fish.mp3',
  windChime: '/assets/windchime-15s.mp3',
  waterDrop: '/assets/waterdrop-15s.mp3'
}

Page({
  data: {
    duration: 3,
    remainingTime: 180,
    isPlaying: false,
    isPaused: false,
    audioEnabled: true,
    stageLabel: '准备开始',
    guideText: '点击开始，进入止观练习',
    formattedTime: '03:00',
    currentPhase: 'prepare'
  },

  timer: null,
  startTime: null,
  playedCues: new Set(),
  waterDropTimer: null,
  windChimeTimer: null,
  // 保存当前音频上下文
  currentAudio: null,

  onLoad(options) {
    const duration = parseInt(options.duration) || 3
    const audioType = options.audio || 'windchime'
    const autostart = options.autostart === 'true'
    
    this.setData({
      duration,
      remainingTime: duration * 60,
      formattedTime: this.formatTime(duration * 60),
      audioEnabled: audioType !== 'none'
    })
    
    if (autostart) {
      this.setData({
        stageLabel: '准备开始',
        guideText: '即将开始止止练习...'
      })
      setTimeout(() => {
        this.startTimer()
      }, 800)
    }
  },

  onUnload() {
    this.clearAllTimers()
    this.stopCurrentAudio()
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  // 停止当前播放的音频
  stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.stop()
      this.currentAudio.destroy()
      this.currentAudio = null
    }
  },

  // 播放指定音效
  playSound(soundName, volume = 0.6) {
    if (!this.data.audioEnabled) return
    const src = SOUND_MAP[soundName]
    if (!src) return
    
    // 停止之前的音频
    this.stopCurrentAudio()
    
    this.currentAudio = wx.createInnerAudioContext()
    this.currentAudio.src = src
    this.currentAudio.volume = volume
    
    this.currentAudio.play()
    
    this.currentAudio.onEnded(() => {
      if (this.currentAudio) {
        this.currentAudio.destroy()
        this.currentAudio = null
      }
    })
    
    this.currentAudio.onError(() => {
      if (this.currentAudio) {
        this.currentAudio.destroy()
        this.currentAudio = null
      }
    })
  },

  startTimer() {
    this.setData({ isPlaying: true, isPaused: false })
    this.startTime = new Date()
    this.playedCues.clear()
    
    const totalSeconds = this.data.duration * 60
    
    // 播放开场大磬（自然完整播放，不截断）
    if (this.data.audioEnabled) {
      this.playSound('largeGong', 0.5)
      wx.vibrateLong()
    }
    
    this.setData({
      stageLabel: '调身调息',
      guideText: '调整坐姿，自然呼吸',
      currentPhase: 'prepare'
    })
    
    this.timer = setInterval(() => {
      const remaining = this.data.remainingTime - 1
      const elapsed = totalSeconds - remaining
      
      this.setData({
        remainingTime: remaining,
        formattedTime: this.formatTime(remaining)
      })
      
      // 检查各阶段
      this.checkPhases(totalSeconds, remaining, elapsed)
      
      if (remaining <= 0) {
        this.completePractice()
      }
    }, 1000)
  },

  checkPhases(total, remaining, elapsed) {
    // 16秒：进入止息，开始水滴声
    if (elapsed >= 16 && !this.playedCues.has('stop_start')) {
      this.playedCues.add('stop_start')
      this.setData({
        stageLabel: '止息',
        guideText: '保持觉知，安住于止',
        currentPhase: 'stop'
      })
      this.startWaterDrop()
    }
    
    // 根据练习时长确定观阶段开始时间
    const observeStartTime = this.data.duration === 5 ? 210 : (this.data.duration === 15 ? 330 : 90)
    
    if (elapsed >= observeStartTime && !this.playedCues.has('observe_start')) {
      this.playedCues.add('observe_start')
      this.stopWaterDrop()
      this.setData({
        stageLabel: '观心',
        guideText: '觉察心念，不随不拒',
        currentPhase: 'observe'
      })
      this.startWindChime()
    }
    
    // 最后15秒：木鱼一声，准备收功
    if (remaining <= 15 && remaining > 3 && !this.playedCues.has('prepare_end')) {
      this.playedCues.add('prepare_end')
      this.stopWindChime()
      this.setData({
        stageLabel: '准备收功',
        guideText: '慢慢把觉知带回',
        currentPhase: 'finish'
      })
      this.playSound('woodenFish', 1.8)
      wx.vibrateShort({ type: 'medium' })
    }
  },

  // 水滴声：无间隔循环播放
  startWaterDrop() {
    const playLoop = () => {
      if (this.data.currentPhase !== 'stop') return
      
      this.playSound('waterDrop', 84.4)
      this.waterDropTimer = setTimeout(playLoop, 15000)
    }
    
    this.playSound('waterDrop', 84.4)
    this.waterDropTimer = setTimeout(playLoop, 15000)
  },

  stopWaterDrop() {
    if (this.waterDropTimer) {
      clearTimeout(this.waterDropTimer)
      this.waterDropTimer = null
    }
  },

  // 风铃声：无间隔循环播放
  startWindChime() {
    const playLoop = () => {
      if (this.data.currentPhase !== 'observe') return
      
      this.playSound('windChime', 0.5)
      this.windChimeTimer = setTimeout(playLoop, 15000)
    }
    
    this.playSound('windChime', 0.5)
    this.windChimeTimer = setTimeout(playLoop, 15000)
  },

  stopWindChime() {
    if (this.windChimeTimer) {
      clearTimeout(this.windChimeTimer)
      this.windChimeTimer = null
    }
  },

  pauseTimer() {
    this.clearAllTimers()
    this.stopCurrentAudio()
    this.setData({ isPlaying: false, isPaused: true })
  },

  // 继续按钮 - 不重新播放开场磬声，恢复当前阶段音频
  resumeTimer() {
    this.setData({ isPlaying: true, isPaused: false })
    
    const totalSeconds = this.data.duration * 60
    
    // 根据当前阶段恢复相应的音频
    if (this.data.currentPhase === 'stop') {
      this.startWaterDrop()
    } else if (this.data.currentPhase === 'observe') {
      this.startWindChime()
    }
    
    this.timer = setInterval(() => {
      const remaining = this.data.remainingTime - 1
      const elapsed = totalSeconds - remaining
      
      this.setData({
        remainingTime: remaining,
        formattedTime: this.formatTime(remaining)
      })
      
      this.checkPhases(totalSeconds, remaining, elapsed)
      
      if (remaining <= 0) {
        this.completePractice()
      }
    }, 1000)
  },

  // 结束按钮 - 不足1分钟直接返回，否则弹窗确认
  endPractice() {
    const actualDuration = this.startTime 
      ? Math.floor((new Date() - this.startTime) / 1000)
      : 0
    
    // 不足1分钟直接返回首页
    if (actualDuration < 60) {
      this.clearAllTimers()
      this.stopCurrentAudio()
      wx.switchTab({
        url: '/pages/index/index'
      })
      return
    }
    
    this.clearAllTimers()
    this.stopCurrentAudio()
    
    wx.showModal({
      title: '结束练习',
      content: '确定要结束当前练习吗？',
      confirmText: '确定',
      cancelText: '继续',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          this.resumeTimer()
        }
      }
    })
  },

  completePractice() {
    this.clearAllTimers()
    
    if (this.data.audioEnabled) {
      this.playSound('smallBell', 0.6)
      wx.vibrateLong()
    }
    
    this.saveAndExit(true)
  },

  saveAndExit(completed = false) {
    const actualDuration = this.startTime 
      ? Math.floor((new Date() - this.startTime) / 1000 / 60)
      : 0
    
    const record = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: this.data.duration,
      completed,
      actualDuration: actualDuration < 1 ? 1 : actualDuration
    }
    
    const records = wx.getStorageSync('zhiguan_records') || []
    records.unshift(record)
    wx.setStorageSync('zhiguan_records', records)
    
    wx.redirectTo({
      url: `/pages/feedback/feedback?recordId=${record.id}&duration=${this.data.duration}&completed=${completed}`
    })
  },

  clearAllTimers() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.stopWaterDrop()
    this.stopWindChime()
  },

  toggleAudio() {
    const audioEnabled = !this.data.audioEnabled
    this.setData({ audioEnabled })
    app.globalData.settings.audioEnabled = audioEnabled
    wx.setStorageSync('zhiguan_settings', app.globalData.settings)
  },

  // 返回按钮 - 不足1分钟直接返回，否则弹窗确认
  goBack() {
    const actualDuration = this.startTime 
      ? Math.floor((new Date() - this.startTime) / 1000)
      : 0
    
    // 不足1分钟直接返回首页
    if (actualDuration < 60) {
      this.clearAllTimers()
      this.stopCurrentAudio()
      wx.switchTab({
        url: '/pages/index/index'
      })
      return
    }
    
    if (this.data.isPlaying || this.data.isPaused) {
      wx.showModal({
        title: '退出练习',
        content: '练习正在进行中，确定要退出吗？',
        success: (res) => {
          if (res.confirm) {
            this.clearAllTimers()
            this.stopCurrentAudio()
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      })
    } else {
      wx.navigateBack()
    }
  }
})
