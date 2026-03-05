# 禅修APP UI迭代设计方案
## ZenFlow - 沉浸式冥想体验

---

## 一、设计理念

### 1.1 核心概念
**"呼吸即界面"** - 将呼吸节奏融入每一个UI元素，让用户在视觉中感受内在的平静。

### 1.2 设计原则
- **极简主义**：去除干扰，聚焦当下
- **有机流动**：自然界中的曲线与韵律
- **渐进式沉浸**：从浅入深的体验层次
- **多感官融合**：视觉、触觉、听觉的统一

---

## 二、视觉风格定义

### 2.1 色彩系统

#### 主色调
| 色彩名称 | 色值 | 使用场景 |
|---------|------|---------|
| 深空蓝 | #0A1628 | 主背景、夜间模式 |
| 晨曦紫 | #6B5B95 | 品牌色、强调元素 |
| 静谧青 | #88B0A8 | 次级强调、成功状态 |
| 暖月白 | #F5F1E8 | 文字、卡片背景 |

#### 渐变系统
```css
/* 呼吸渐变 - 用于冥想状态 */
.breath-gradient {
  background: linear-gradient(
    135deg,
    #0A1628 0%,
    #1E3A5F 25%,
    #6B5B95 50%,
    #88B0A8 75%,
    #0A1628 100%
  );
  background-size: 400% 400%;
  animation: breathFlow 8s ease-in-out infinite;
}

/* 晨曦渐变 - 用于首页 */
.dawn-gradient {
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(107, 91, 149, 0.4) 0%,
    rgba(10, 22, 40, 0) 50%
  );
}

/* 水波渐变 - 用于课程卡片 */
.water-gradient {
  background: linear-gradient(
    180deg,
    rgba(136, 176, 168, 0.15) 0%,
    rgba(10, 22, 40, 0) 100%
  );
}
```

#### 情绪色彩映射
- 🌙 **深度冥想**：深空蓝 + 靛蓝 (#0A1628 → #1E3A5F)
- 🌅 **晨间唤醒**：暖橙 + 晨曦紫 (#E8A87C → #6B5B95)
- 🍃 **自然疗愈**：森林绿 + 静谧青 (#2D5A4A → #88B0A8)
- ⭐ **睡眠引导**：深紫 + 暖月白 (#2D1B4E → #F5F1E8)

### 2.2 字体系统

#### 字体家族
- **标题字体**：Noto Serif SC（衬线体，传达宁静与优雅）
- **正文字体**：PingFang SC / Noto Sans SC（清晰易读）
- **数字字体**：SF Mono（计时器、数据展示）

#### 字号规范
| 层级 | 字号 | 字重 | 行高 | 用途 |
|-----|------|-----|------|-----|
| Display | 48px | 300 | 1.2 | 首页大标题 |
| H1 | 32px | 400 | 1.3 | 页面标题 |
| H2 | 24px | 500 | 1.4 | 区块标题 |
| H3 | 20px | 500 | 1.5 | 卡片标题 |
| Body | 16px | 400 | 1.6 | 正文内容 |
| Caption | 14px | 400 | 1.5 | 辅助说明 |
| Timer | 72px | 300 | 1 | 计时器显示 |

### 2.3 组件规范

#### 按钮系统
```
主按钮：
- 高度：56px
- 圆角：28px（全圆角）
- 背景：渐变（晨曦紫 → 静谧青）
- 阴影：0 4px 20px rgba(107, 91, 149, 0.3)
- 动效：呼吸缩放（0.98 → 1.02，4s循环）

次按钮：
- 高度：48px
- 圆角：24px
- 背景：透明 + 1px边框（暖月白，30%透明度）
- 悬停：背景填充10%暖月白

图标按钮：
- 尺寸：48px × 48px
- 圆角：50%
- 背景：玻璃态（backdrop-filter: blur(20px)）
```

#### 卡片系统
```
课程卡片：
- 圆角：20px
- 背景：玻璃态 + 渐变叠加
- 边框：1px rgba(245, 241, 232, 0.1)
- 阴影：0 8px 32px rgba(0, 0, 0, 0.2)
- 悬停：上浮8px + 阴影加深

统计卡片：
- 圆角：16px
- 背景：深空蓝 + 5%透明度渐变
- 内边距：24px
```

#### 输入控件
```
搜索框：
- 高度：48px
- 圆角：24px
- 背景：rgba(245, 241, 232, 0.08)
- 聚焦：边框显示晨曦紫

滑块：
- 轨道高度：4px
- 激活色：晨曦紫渐变
- 滑块：16px圆形，带发光效果
```

---

## 三、核心界面设计

### 3.1 首页（Home）

#### 布局结构
```
┌─────────────────────────────────────┐
│  状态栏（时间、电量、信号）            │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │     "早安，行者"             │   │
│  │     今日宜静心               │   │
│  │                             │   │
│  │   [呼吸圆环 - 动态展示]       │   │
│  │                             │   │
│  │   已连续冥想 7 天            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─────── 推荐练习 ───────          │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌────────┐│
│  │ 晨间唤醒 │ │ 午休小憩 │ │ 睡前放松││
│  │ [图标]  │ │ [图标]  │ │ [图标] ││
│  │ 10分钟  │ │ 15分钟  │ │ 20分钟 ││
│  └─────────┘ └─────────┘ └────────┘│
│                                     │
│  ─────── 今日课程 ───────          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [课程封面] 正念入门·第3课    │   │
│  │ 进度：60%  ·  剩余 8 分钟   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [课程封面] 呼吸觉察练习      │   │
│  │ 新课推荐  ·  12 分钟        │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  🧘 冥想  │  📚 课程  │  👤 我的   │
└─────────────────────────────────────┘
```

#### 视觉细节

**呼吸圆环（核心视觉元素）**
- 位置：首页中央偏上
- 尺寸：200px × 200px
- 设计：
  - 外环：渐变描边（晨曦紫 → 静谧青），随呼吸节奏缩放
  - 内圆：玻璃态背景，显示当前状态
  - 粒子效果：环绕的微小光点，跟随呼吸节奏聚散
- 交互：点击快速开始上次练习

**背景效果**
- 底层：深空蓝渐变背景
- 中层：缓慢流动的光晕（使用CSS动画）
- 上层：微妙的噪点纹理，增加质感

#### 动效设计
```css
/* 呼吸圆环动画 */
@keyframes breathCycle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

/* 粒子浮动 */
@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-10px) translateX(5px);
  }
  50% {
    transform: translateY(-5px) translateX(-5px);
  }
  75% {
    transform: translateY(-15px) translateX(3px);
  }
}

/* 卡片入场 */
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 3.2 冥想播放页（Player）

#### 布局结构
```
┌─────────────────────────────────────┐
│  ← 返回                              │
├─────────────────────────────────────┤
│                                     │
│                                     │
│         ┌─────────────┐            │
│         │             │            │
│         │   呼吸圆环   │            │
│         │   (大)      │            │
│         │             │            │
│         │  吸 — 呼    │            │
│         │             │            │
│         └─────────────┘            │
│                                     │
│           15:32                     │
│        ─────────────                │
│           20:00                     │
│                                     │
│                                     │
│     🌊  雨声    🎵  音乐    ⭐  引导   │
│                                     │
│                                     │
│  ◀◀    ━━━━━━━━━━━━━━━━    ▶▶     │
│  -30s      [ 暂停 ]       +30s     │
│                                     │
├─────────────────────────────────────┤
│  📝 记录心情  │  📊 查看数据         │
└─────────────────────────────────────┘
```

#### 视觉细节

**呼吸引导系统**
- 中央圆环：300px × 300px
- 呼吸指示：
  - 吸气（4秒）：圆环从中心向外扩散，颜色从深空蓝渐变为晨曦紫
  - 保持（2秒）：圆环稳定，光晕增强
  - 呼气（6秒）：圆环向内收缩，颜色回归深空蓝
  - 循环指示：底部文字"吸 — 保持 — 呼"同步变化

**粒子系统（增强沉浸感）**
```javascript
// 粒子配置
const particleConfig = {
  count: 50,              // 粒子数量
  color: ['#6B5B95', '#88B0A8', '#F5F1E8'],  // 粒子颜色
  size: { min: 2, max: 6 },  // 粒子大小范围
  speed: { min: 0.5, max: 2 }, // 移动速度
  opacity: { min: 0.3, max: 0.8 },
  // 呼吸同步
  breathSync: true,       // 与呼吸节奏同步
  inhaleBehavior: 'gather',   // 吸气时聚集
  exhaleBehavior: 'disperse'  // 呼气时散开
};
```

**背景氛围**
- 动态渐变：根据冥想类型切换
  - 正念冥想：蓝紫渐变
  - 睡眠冥想：深紫渐变
  - 自然冥想：青绿渐变
- 模糊效果：背景图片（自然风景）+ 高斯模糊（40px）

#### 交互设计

**手势操作**
- 左右滑动：切换背景音效
- 上下滑动：调节音量
- 双击：快速暂停/继续
- 长按：呼出更多选项

**触觉反馈**
- 呼吸节点：轻微震动提示（iOS Core Haptics / Android Vibrator）
- 完成里程碑：成功震动模式
- 错误操作：柔和警告震动

---

### 3.3 课程页（Courses）

#### 布局结构
```
┌─────────────────────────────────────┐
│  探索课程              🔍           │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔥 入门必修                 │   │
│  │ 零基础开启正念之旅           │   │
│  │ [开始按钮]                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─────── 学习路径 ───────          │
│                                     │
│  入门 ──●── 深化 ──○── 活用 ──○── 融入 ──○── 日用 │
│   ✓      进行中    锁定    锁定    锁定   │
│                                     │
│  ─────── 课程分类 ───────          │
│                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ 正念基础 │ │ 情绪管理 │ │ 睡眠改善 │  │
│  │  12课  │ │  8课   │ │  6课   │  │
│  └────────┘ └────────┘ └────────┘  │
│                                     │
│  ─────── 热门课程 ───────          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [封面] 7天正念入门           │   │
│  │ ⭐ 4.9  │  1.2万人学习  │ 免费  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [封面] 焦虑缓解指南          │   │
│  │ ⭐ 4.8  │  8千人学习   │ 会员  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [封面] 深度睡眠引导          │   │
│  │ ⭐ 4.9  │  2万人学习   │ 会员  │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### 视觉细节

**学习路径可视化**
- 设计：水平时间线 + 节点标记
- 已完成节点：实心圆 + 对勾图标
- 进行中节点：脉动动画 + 当前标记
- 锁定节点：空心圆 + 锁图标
- 连接线：渐变色条，已完成部分高亮

**课程卡片**
- 封面图：圆角20px，带渐变遮罩
- 信息层：
  - 课程名称：H3字号，白色
  - 元信息：评分、学习人数、价格标签
  - 进度条（已购课程）：底部显示

**分类标签**
- 横向滚动列表
- 选中状态：背景填充 + 文字变白
- 未选中：透明背景 + 边框

---

### 3.4 个人中心（Profile）

#### 布局结构
```
┌─────────────────────────────────────┐
│  我的                               │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [头像]  静心行者            │   │
│  │          冥想学徒  Lv.3      │   │
│  │          加入第 128 天       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────┐ ┌──────────┐         │
│  │  总时长   │ │  连续天数  │         │
│  │  32小时  │ │   7天    │         │
│  └──────────┘ └──────────┘         │
│                                     │
│  ─────── 本周统计 ───────          │
│                                     │
│  一  二  三  四  五  六  日          │
│  ✓   ✓   ✓   ✓   ✓   ○   ○         │
│  15  20  10  25  30  -   -  (分钟)  │
│                                     │
│  ─────── 功能入口 ───────          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📊 冥想统计    >            │   │
│  ├─────────────────────────────┤   │
│  │ 🏆 成就徽章    >            │   │
│  ├─────────────────────────────┤   │
│  │ ⚙️  设置       >            │   │
│  ├─────────────────────────────┤   │
│  │ ❤️  收藏       >            │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 四、交互动效设计

### 4.1 呼吸动画系统

#### 核心呼吸循环
```css
.breath-container {
  --inhale-duration: 4s;
  --hold-duration: 2s;
  --exhale-duration: 6s;
  --cycle-duration: 12s;
}

.breath-ring {
  animation: breathPulse var(--cycle-duration) ease-in-out infinite;
}

@keyframes breathPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(107, 91, 149, 0.3);
  }
  33% { /* 吸气结束 */
    transform: scale(1.3);
    box-shadow: 0 0 60px rgba(107, 91, 149, 0.6);
  }
  50% { /* 保持 */
    transform: scale(1.3);
    box-shadow: 0 0 60px rgba(136, 176, 168, 0.6);
  }
  100% { /* 呼气结束 */
    transform: scale(1);
    box-shadow: 0 0 20px rgba(107, 91, 149, 0.3);
  }
}

/* 文字提示同步 */
.breath-text {
  animation: breathText var(--cycle-duration) ease-in-out infinite;
}

@keyframes breathText {
  0%, 5% { content: "吸气"; }
  33%, 50% { content: "保持"; }
  51%, 95% { content: "呼气"; }
}
```

#### 粒子呼吸同步
```javascript
// 粒子系统与呼吸节奏同步
class BreathParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.breathPhase = 'inhale'; // inhale | hold | exhale
    this.cycleProgress = 0;
  }

  updateBreathPhase(phase, progress) {
    this.breathPhase = phase;
    this.cycleProgress = progress;
    
    // 根据呼吸阶段调整粒子行为
    this.particles.forEach(p => {
      switch(phase) {
        case 'inhale':
          p.targetX = this.centerX + (p.x - this.centerX) * 0.7;
          p.targetY = this.centerY + (p.y - this.centerY) * 0.7;
          p.speed *= 0.98; // 减速聚集
          break;
        case 'hold':
          p.speed *= 0.95; // 几乎静止
          break;
        case 'exhale':
          p.targetX = p.originalX;
          p.targetY = p.originalY;
          p.speed *= 1.02; // 加速散开
          break;
      }
    });
  }

  render() {
    // 清除画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制粒子
    this.particles.forEach(p => {
      const gradient = this.ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size
      );
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });
  }
}
```

### 4.2 转场动效

#### 页面切换
```css
/* 进入动画 */
.page-enter {
  animation: pageEnter 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 退出动画 */
.page-exit {
  animation: pageExit 300ms cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes pageExit {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-30px);
  }
}
```

#### 共享元素过渡
```css
/* 呼吸圆环从首页到播放页的过渡 */
.breath-ring-transition {
  transition: all 600ms cubic-bezier(0.4, 0, 0.2, 1);
  view-transition-name: breath-ring;
}

::view-transition-old(breath-ring) {
  animation: ringExpand 600ms forwards;
}

::view-transition-new(breath-ring) {
  animation: ringExpand 600ms reverse;
}

@keyframes ringExpand {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.5);
  }
}
```

### 4.3 微交互

#### 按钮反馈
```css
.btn-primary {
  transition: transform 150ms ease, box-shadow 200ms ease;
}

.btn-primary:active {
  transform: scale(0.96);
}

.btn-primary:hover {
  box-shadow: 0 6px 24px rgba(107, 91, 149, 0.4);
}

/* 涟漪效果 */
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  transform: scale(0);
  opacity: 0;
}

.btn-ripple:active::after {
  animation: ripple 400ms ease-out;
}

@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}
```

#### 卡片悬停
```css
.course-card {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 300ms ease;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
}

.course-card:hover .card-image {
  transform: scale(1.05);
}
```

---

## 五、响应式适配

### 5.1 断点定义
| 设备类型 | 宽度范围 | 适配策略 |
|---------|---------|---------|
| 手机 | < 480px | 单列布局，全宽组件 |
| 大屏手机 | 480px - 768px | 单列布局，增大间距 |
| 平板 | 768px - 1024px | 双列布局，侧边导航 |
| 桌面 | > 1024px | 居中容器，最大宽度480px |

### 5.2 安全区域适配
```css
/* iOS 安全区域 */
.app-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## 六、无障碍设计

### 6.1 视觉无障碍
- 颜色对比度：所有文字 ≥ WCAG AA 标准（4.5:1）
- 支持系统字体大小设置
- 深色模式自动切换

### 6.2 交互无障碍
- 所有交互元素支持键盘操作
- 屏幕阅读器友好标签
- 减少动画选项（尊重 prefers-reduced-motion）

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 七、设计资源清单

### 7.1 图标库
- 主要：Phosphor Icons（线条风格，支持动画）
- 备用：Heroicons

### 7.2 图片资源
- 课程封面：Unsplash 自然/冥想相关
- 背景纹理：自制噪点纹理
- 插图风格：简约线条插画

### 7.3 音效资源（预留）
- 自然音效：雨声、海浪、森林
- 背景音乐：氛围音乐、颂钵
- UI音效：轻柔的点击、完成提示

---

## 八、迭代计划

### Phase 1：基础UI实现
- [ ] 首页布局与样式
- [ ] 色彩系统实现
- [ ] 基础组件库

### Phase 2：动效实现
- [ ] 呼吸动画系统
- [ ] 粒子效果
- [ ] 页面转场

### Phase 3：功能完善
- [ ] 冥想播放器
- [ ] 课程系统
- [ ] 个人中心

### Phase 4：音效集成
- [ ] 背景音乐播放
- [ ] 音效混合
- [ ] 音频可视化

---

*设计文档版本：v1.0*
*创建日期：2026-02-24*
*设计师：AI Assistant*
