/**pages/practice/practice.js**/
const app = getApp()

// 音效映射
const SOUND_MAP = {
  largeGong: '/assets/large_gong.mp3',
  smallBell: '/assets/small_bell.mp3',
  woodenFish: '/assets/wooden_fish.mp3',
  windChime: '/assets/wind_chime.mp3',
  waterDrop: '/assets/water_drop.mp3'
}

Page({
  data: {
    statusBarHeight: 44,
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

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync()
    const duration = parseInt(options.duration) || 3
    // 默认使用风铃音效
    const audioType = options.audio || 'windchime'
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      duration,
      remainingTime: duration * 60,
      formattedTime: this.formatTime(duration * 60),
      audioEnabled: audioType !== 'none'
    })
  },

  onUnload() {
    this.clearAllTimers()
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  // 播放指定音效，支持截取片段
  playSound(soundName, volume = 0.6, duration = null, startTime = 0) {
    if (!this.data.audioEnabled) return
    const src = SOUND_MAP[soundName]
    if (!src) return
    
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = src
    innerAudioContext.volume = volume
    
    // 设置起始位置（秒）
    if (startTime > 0) {
      innerAudioContext.startTime = startTime
    }
    
    innerAudioContext.play()
    
    // 如果指定了时长，到时停止
    if (duration && duration > 0) {
      setTimeout(() => {
        innerAudioContext.stop()
        innerAudioContext.destroy()
      }, duration)
    } else {
      innerAudioContext.onEnded(() => innerAudioContext.destroy())
    }
    
    innerAudioContext.onError(() => innerAudioContext.destroy())
  },

  startTimer() {
    this.setData({ isPlaying: true, isPaused: false })
    this.startTime = new Date()
    this.playedCues.clear()
    
    const totalSeconds = this.data.duration * 60
    
    // 播放开场大磬（低音量50%）
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
    // 16秒：进入止息，开始水滴声（每7-9秒一次，每次1秒）
    if (elapsed >= 16 && !this.playedCues.has('stop_start')) {
      this.playedCues.add('stop_start')
      this.setData({
        stageLabel: '止息',
        guideText: '保持觉知，安住于止',
        currentPhase: 'stop'
      })
      this.startWaterDrop()
    }
    
    // 1分30秒（90秒）：转入观心，风铃声（每次3秒，间隔8-10秒）
    if (elapsed >= 90 && !this.playedCues.has('observe_start')) {
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
      this.playSound('woodenFish', 0.6)
      wx.vibrateShort({ type: 'medium' })
    }
  },

  // 水滴声：每7-9秒一次
  startWaterDrop() {
    const playLoop = () => {
      if (this.data.currentPhase !== 'stop') return
      
      this.playSound('waterDrop', 0.4)
      
      // 随机间隔7-9秒
      const interval = 7000 + Math.random() * 2000
      this.waterDropTimer = setTimeout(playLoop, interval)
    }
    
    // 立即播放第一次
    this.playSound('waterDrop', 0.4)
    this.waterDropTimer = setTimeout(playLoop, 8000)
  },

  stopWaterDrop() {
    if (this.waterDropTimer) {
      clearTimeout(this.waterDropTimer)
      this.waterDropTimer = null
    }
  },

  // 风铃声：播放完整音频（新的3秒风铃文件），间隔8-10秒
  startWindChime() {
    const playLoop = () => {
      if (this.data.currentPhase !== 'observe') return
      
      // 播放完整风铃（新的3秒文件）
      this.playSound('windChime', 0.5)
      
      // 随机间隔8-10秒
      const interval = 8000 + Math.random() * 2000
      this.windChimeTimer = setTimeout(playLoop, interval)
    }
    
    // 立即播放第一次
    this.playSound('windChime', 0.5)
    this.windChimeTimer = setTimeout(playLoop, 9000)
  },

  stopWindChime() {
    if (this.windChimeTimer) {
      clearTimeout(this.windChimeTimer)
      this.windChimeTimer = null
    }
  },

  pauseTimer() {
    this.clearAllTimers()
    this.setData({ isPlaying: false, isPaused: true })
  },

  resumeTimer() {
    this.startTimer()
  },

  endPractice() {
    this.clearAllTimers()
    
    wx.showModal({
      title: '结束练习',
      content: '确定要结束当前练习吗？',
      confirmText: '结束',
      cancelText: '继续',
      success: (res) => {
        if (res.confirm) {
          this.saveAndExit()
        } else {
          this.resumeTimer()
        }
      }
    })
  },

  completePractice() {
    this.clearAllTimers()
    
    // 播放引磬结束（3-5秒）
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

  goBack() {
    if (this.data.isPlaying) {
      this.pauseTimer()
      wx.showModal({
        title: '退出练习',
        content: '练习正在进行中，确定要退出吗？',
        success: (res) => {
          if (res.confirm) {
            this.clearAllTimers()
            wx.navigateBack()
          } else {
            this.resumeTimer()
          }
        }
      })
    } else {
      wx.navigateBack()
    }
  }
})
