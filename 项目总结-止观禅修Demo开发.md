# 止观禅修 Demo 开发总结

## 项目概述
开发一款专注于止观禅修的微信小程序 Demo，集成5种传统禅修音效（大磬、引磬、木鱼、风铃、水滴），支持3/5/15分钟三种练习时长，完整呈现止观禅修「调身→止息→观心→收功」四个阶段。

---

## 一、需求分析阶段

### 核心功能需求
1. **练习时长**：3分钟、5分钟、15分钟三档
2. **音效系统**：大磬、引磬、木鱼、风铃、水滴
3. **练习流程**：调身→止息→观心→收功
4. **数据记录**：练习历史、连续天数统计
5. **反馈机制**：5星评分+标签+文字反馈

### 音效时间线设计
```
0:00    大磬开场（音量50%，15秒调身调息）
0:16    水滴声进入止息（每7-9秒一次）
1:30    风铃声转入观心（3秒一段，间隔8-10秒）
最后15秒 木鱼一声准备收功
0:00    引磬3-5秒结束
```

---

## 二、技术架构

### 技术栈
- **框架**：微信小程序原生框架
- **存储**：wx.getStorageSync（本地存储）
- **音频**：wx.createInnerAudioContext
- **反馈**：wx.vibrateShort/Long

### 目录结构
```
zhiguan-miniprogram/
├── app.js              # 全局逻辑
├── app.json            # 全局配置
├── app.wxss            # 全局样式
├── pages/
│   ├── index/          # 首页（时长选择）
│   ├── practice/       # 练习页（计时+音效）
│   ├── feedback/       # 评分反馈页
│   ├── record/         # 记录统计页
│   └── profile/        # 个人设置页
└── assets/             # 音效资源
    ├── large_gong.mp3
    ├── small_bell.mp3
    ├── wooden_fish.mp3
    ├── wind_chime.mp3
    └── water_drop.mp3
```

---

## 三、关键技术点

### 1. 精确计时系统
```javascript
// 主计时器 + 阶段检查
this.timer = setInterval(() => {
  const remaining = this.data.remainingTime - 1
  const elapsed = totalSeconds - remaining
  this.checkPhases(total, remaining, elapsed)
}, 1000)
```

### 2. 音频播放管理
```javascript
// 创建音频上下文
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.src = src
innerAudioContext.volume = volume
innerAudioContext.play()

// 自动销毁
innerAudioContext.onEnded(() => innerAudioContext.destroy())
```

### 3. 循环音效控制
```javascript
// 水滴声：递归setTimeout实现随机间隔
startWaterDrop() {
  const playLoop = () => {
    if (this.data.currentPhase !== 'stop') return
    this.playSound('waterDrop', 0.4)
    const interval = 7000 + Math.random() * 2000  // 7-9秒
    this.waterDropTimer = setTimeout(playLoop, interval)
  }
  playLoop()
}
```

### 4. 阶段切换逻辑
```javascript
checkPhases(total, remaining, elapsed) {
  // 16秒：进入止息
  if (elapsed >= 16 && !this.playedCues.has('stop_start')) {
    this.playedCues.add('stop_start')
    this.startWaterDrop()
  }
  // 90秒：转入观心
  if (elapsed >= 90 && !this.playedCues.has('observe_start')) {
    this.stopWaterDrop()
    this.startWindChime()
  }
  // 最后15秒：准备收功
  if (remaining <= 15 && remaining > 3) {
    this.stopWindChime()
    this.playSound('woodenFish')
  }
}
```

---

## 四、遇到的问题与解决方案

### 问题1：音效被切断不自然
**原因**：用setTimeout强制停止音频
**解决**：提供截取好的3秒音频文件，播放完整片段

### 问题2：评分显示异常
**原因**：wx:for循环渲染问题
**解决**：改为5个独立的star组件

### 问题3：音频后台播放
**解决**：在app.json添加 `"requiredBackgroundModes": ["audio"]`

### 问题4：定时器清理
**解决**：页面卸载时统一清理所有timer
```javascript
clearAllTimers() {
  clearInterval(this.timer)
  clearTimeout(this.waterDropTimer)
  clearTimeout(this.windChimeTimer)
}
```

---

## 五、可复用的工作流

### 音频类小程序开发流程
1. **资源准备**：收集/制作音效文件，控制单文件大小
2. **时间线设计**：用纸笔画出精确的时间轴
3. **阶段划分**：用elapsed时间判断阶段切换
4. **循环控制**：递归setTimeout优于setInterval（便于清理）
5. **音量平衡**：根据音效特点调整volume（0.4-0.8）

### 冥想类应用通用模式
```
开场音效 → 引导阶段 → 循环背景音 → 过渡音效 → 结束音效
   ↓           ↓            ↓            ↓           ↓
 大磬        调身调息      水滴/风铃     木鱼        引磬
```

---

## 六、教学要点

### 微信小程序音频开发
- `createInnerAudioContext` 每次播放需新建实例
- 播放完成后必须 `destroy()` 避免内存泄漏
- 不支持直接截取音频，需预处理好片段

### 精确计时实现
- 用 `remainingTime--` 倒计时比正计时更直观
- 阶段判断用 `elapsed >= 时间点` 确保只触发一次
- `playedCues` Set 记录已触发的时间点

### 用户体验优化
- 震动反馈配合音效（`vibrateShort`）
- 阶段标签实时更新（调身→止息→观心→收功）
- 引导文字根据阶段变化

---

## 七、后续优化方向

1. **音频预加载**：练习前预加载所有音效
2. **网络同步**：支持多设备数据同步
3. **社交功能**：分享练习成就
4. **数据统计**：周/月/年统计图表
5. **引导语音**：真人语音引导选项

---

## 八、版本迭代记录

| 版本 | 更新内容 |
|------|----------|
| v1 | 基础框架搭建 |
| v2 | 移除tabBar图标依赖 |
| v3 | 集成水滴音效 |
| v4 | 五音效完整版 |
| v5 | 优化音效分配 |
| v6 | 精确时间线设计 |
| v7 | 修复时间线逻辑 |
| v8 | 风铃3秒截取 |
| v9 | 评分显示修复 |
| v10 | 新风铃音频文件 |

---

## 九、核心代码片段

### 音频播放工具函数
```javascript
playSound(soundName, volume = 0.6) {
  const src = SOUND_MAP[soundName]
  const ctx = wx.createInnerAudioContext()
  ctx.src = src
  ctx.volume = volume
  ctx.play()
  ctx.onEnded(() => ctx.destroy())
}
```

### 阶段时间管理
```javascript
// 配置阶段时间点
const PHASES = {
  prepare: { end: 15, sound: 'largeGong' },
  stop: { start: 16, end: 90, sound: 'waterDrop' },
  observe: { start: 90, end: 'total-15', sound: 'windChime' },
  finish: { start: 'total-15', sound: 'woodenFish' }
}
```

---

## 十、交付清单

- [x] 完整小程序源代码
- [x] 5个音效文件
- [x] 设计规范文档
- [x] 效果图预览
- [x] 工作总结（本文档）

---

**项目完成时间**：2026年2月23日  
**开发周期**：约8小时  
**代码行数**：约2000行
