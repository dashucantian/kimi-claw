/**pages/practice/practice.js**/
const app = getApp()

// 音效映射 - 使用15秒截取版本
const SOUND_MAP = {
  largeGong: '/assets/large_gong.mp3',
  smallBell: '/assets/small_bell.mp3',
  woodenFish: '/assets/wooden_fish.mp3',
  windChime: '/assets/windchime-15s.mp3',
  waterDrop: '/assets/waterdrop-15s.mp3'
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
    // 是否自动开始
    const autostart = options.autostart === 'true'
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      duration,
      remainingTime: duration * 60,
      formattedTime: this.formatTime(duration * 60),
      audioEnabled: audioType !== 'none'
    })
    
    // 如果设置了自动开始，延迟一点后开始练习
    if (autostart) {
      this.setData({
        stageLabel: '准备开始',
        guideText: '即将开始止观练习...'
      })
      setTimeout(() => {
        this.startTimer()
      }, 800)
    }
  },

  onUnload() {
    this.clearAllTimers()
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  // 保存当前音频上下文以便暂停时停止
  innerAudioContext: null,

  // 播放指定音效，支持截取片段
  playSound(soundName, volume = 0.6, duration = null, startTime = 0) {
    if (!this.data.audioEnabled) return
    const src = SOUND_MAP[soundName]
    if (!src) return
    
    // 如果有正在播放的音频，先停止
    if (this.innerAudioContext) {
      this.innerAudioContext.stop()
      this.innerAudioContext.destroy()
      this.innerAudioContext = null
    }
    
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.src = src
    this.innerAudioContext.volume = volume
    
    // 设置起始位置（秒）
    if (startTime > 0) {
      this.innerAudioContext.startTime = startTime
    }
    
    this.innerAudioContext.play()
    
    // 如果指定了时长，到时停止
    if (duration && duration > 0) {
      setTimeout(() => {
        if (this.innerAudioContext) {
          this.innerAudioContext.stop()
          this.innerAudioContext.destroy()
          this.innerAudioContext = null
        }
      }, duration)
    } else {
      this.innerAudioContext.onEnded(() => {
        if (this.innerAudioContext) {
          this.innerAudioContext.destroy()
          this.innerAudioContext = null
        }
      })
    }
    
    this.innerAudioContext.onError(() => {
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy()
        this.innerAudioContext = null
      }
    })
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
    
    // 根据练习时长确定观阶段开始时间
    // 5分钟：3分30秒=210秒，15分钟：5分30秒=330秒，其他：90秒
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

  // 水滴声：无间隔循环播放（15秒音频）
  startWaterDrop() {
    const playLoop = () => {
      if (this.data.currentPhase !== 'stop') return
      
      this.playSound('waterDrop', 84.4)
      
      // 15秒音频，无间隔循环
      this.waterDropTimer = setTimeout(playLoop, 15000)
    }
    
    // 立即播放第一次
    this.playSound('waterDrop', 84.4)
    this.waterDropTimer = setTimeout(playLoop, 15000)
  },

  stopWaterDrop() {
    if (this.waterDropTimer) {
      clearTimeout(this.waterDropTimer)
      this.waterDropTimer = null
    }
  },

  // 风铃声：15秒音频无间隔循环播放
  startWindChime() {
    const playLoop = () => {
      if (this.data.currentPhase !== 'observe') return
      
      this.playSound('windChime', 0.5)
      
      // 15秒音频，无间隔循环
      this.windChimeTimer = setTimeout(playLoop, 15000)
    }
    
    // 立即播放第一次
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
    // 停止当前播放的音频
    if (this.innerAudioContext) {
      this.innerAudioContext.stop()
      this.innerAudioContext.destroy()
      this.innerAudioContext = null
    }
    this.setData({ isPlaying: false, isPaused: true })
  },

  resumeTimer() {
    // 不重新播放开场音效，继续计时
    this.setData({ isPlaying: true, isPaused: false })
    
    const totalSeconds = this.data.duration * 60
    const elapsed = totalSeconds - this.data.remainingTime
    
    // 根据当前阶段恢复相应的音频
    if (this.data.currentPhase === 'stop') {
      this.startWaterDrop()
    } else if (this.data.currentPhase === 'observe') {
      this.startWindChime()
    }
    
    this.timer = setInterval(() => {
      const remaining = this.data.remainingTime - 1
      const currentElapsed = totalSeconds - remaining
      
      this.setData({
        remainingTime: remaining,
        formattedTime: this.formatTime(remaining)
      })
      
      // 检查各阶段
      this.checkPhases(totalSeconds, remaining, currentElapsed)
      
      if (remaining <= 0) {
        this.completePractice()
      }
    }, 1000)
  },

  endPractice() {
    // 计算实际练习时间
    const actualDuration = this.startTime 
      ? Math.floor((new Date() - this.startTime) / 1000)
      : 0
    
    // 不足1分钟直接返回首页
    if (actualDuration < 60) {
      this.clearAllTimers()
      if (this.innerAudioContext) {
        this.innerAudioContext.stop()
        this.innerAudioContext.destroy()
        this.innerAudioContext = null
      }
      wx.switchTab({
        url: '/pages/index/index'
      })
      return
    }
    
    this.clearAllTimers()
    // 停止当前播放的音频
    if (this.innerAudioContext) {
      this.innerAudioContext.stop()
      this.innerAudioContext.destroy()
      this.innerAudioContext = null
    }
    
    wx.showModal({
      title: '结束练习',
      content: '确定要结束当前练习吗？',
      confirmText: '确定',
      cancelText: '继续',
      success: (res) => {
        if (res.confirm) {
          // 未完成，返回首页
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
    // 注意：这里不停止innerAudioContext，让当前播放的音频继续
  },

  toggleAudio() {
    const audioEnabled = !this.data.audioEnabled
    this.setData({ audioEnabled })
    app.globalData.settings.audioEnabled = audioEnabled
    wx.setStorageSync('zhiguan_settings', app.globalData.settings)
  },

  // 返回按钮处理
  goBack() {
    if (this.data.isPlaying || this.data.isPaused) {
      // 计算实际练习时间
      const actualDuration = this.startTime 
        ? Math.floor((new Date() - this.startTime) / 1000)
        : 0
      
      // 不足1分钟直接返回首页
      if (actualDuration < 60) {
        this.clearAllTimers()
        if (this.innerAudioContext) {
          this.innerAudioContext.stop()
          this.innerAudioContext.destroy()
          this.innerAudioContext = null
        }
        wx.switchTab({
          url: '/pages/index/index'
        })
        return
      }
      
      wx.showModal({
        title: '退出练习',
        content: '练习正在进行中，确定要退出吗？',
        success: (res) => {
          if (res.confirm) {
            this.clearAllTimers()
            if (this.innerAudioContext) {
              this.innerAudioContext.stop()
              this.innerAudioContext.destroy()
              this.innerAudioContext = null
            }
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      })
    } else {
      wx.navigateBack()
    }
  },
})
