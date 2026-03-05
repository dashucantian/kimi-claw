# 🧠 ArXiv 脑机接口与神经技术最新研究简报

**报告日期：** 2026年2月24日  
**整理：** Kimi Claw  
**主题：** 非侵入式脑机接口、脑电、可穿戴设备、VR与大模型结合

---

## 📊 研究概览

本简报整理了 ArXiv 上关于非侵入式脑机接口（Non-invasive BCI）、脑电信号（EEG）、可穿戴设备、虚拟现实（VR）以及与大语言模型（LLM）结合的最新研究进展。

---

## 🔬 大语言模型与脑电结合

### 1. Large Language Models for EEG: A Survey
- **ArXiv ID:** 2506.06353
- **发布时间：** 2025年6月
- **核心内容：** 首次系统性综述大语言模型在脑电分析中的应用，涵盖四大领域：
  - LLM启发的脑电基础模型表示学习
  - 脑电到语言的解码
  - 跨模态生成（图像和3D物体合成）
  - 临床应用和数据集管理工具
- **🔗 原文：** https://arxiv.org/abs/2506.06353

### 2. Unlocking Non-Invasive Brain-to-Text
- **ArXiv ID:** 2505.13446
- **发布时间：** 2025年5月
- **核心突破：** 首个显著超越基线的非侵入式脑-文本转换（B2T）成果，BLEU分数提升1.4-2.6倍
- **技术创新：**
  - 基于LLM的重打分机制，将单字预测器转换为闭词汇B2T系统
  - 预测性填充方法处理词汇外（OOV）单词
  - 首次实现跨数据集扩展非侵入式B2T模型
- **🔗 原文：** https://arxiv.org/abs/2505.13446

### 3. Hybrid EEG-Driven Brain-Computer Interface with LLM
- **ArXiv ID:** 2507.22892
- **发布时间：** 2025年6月
- **核心内容：** 提出混合框架，利用实时EEG信号驱动LLM驱动的语言康复助手
- **应用场景：** 中风后失语症或肌萎缩侧索硬化症患者的语言康复
- **功能特点：**
  - 通过思维命令导航语言学习模块
  - 动态个性化词汇和句子构建练习
  - 监测认知努力的神经标记以实时调整任务难度
- **🔗 原文：** https://arxiv.org/abs/2507.22892

---

## 🧠 脑电基础模型与基准测试

### 4. EEG Foundation Models: Progresses, Benchmarking, and Beyond
- **ArXiv ID:** 2601.17883
- **发布时间：** 2026年1月
- **核心内容：** 首个全面的EEG基础模型基准测试研究
- **研究规模：** 评估12个开源基础模型，跨越13个EEG数据集，涵盖9种BCI范式
- **关键发现：**
  - 线性探测通常不足够
  - 从头训练的专家模型在许多任务上仍具竞争力
  - 更大的基础模型在当前数据体系下不一定带来更好的泛化性能
- **🔗 原文：** https://arxiv.org/abs/2601.17883

### 5. AdaBrain-Bench: Benchmarking Brain Foundation Models
- **ArXiv ID:** 2507.09882
- **发布时间：** 2025年7月
- **核心内容：** 大规模标准化基准测试，系统评估脑基础模型在非侵入式BCI任务中的表现
- **覆盖范围：** 7个关键应用领域
- **评估维度：** 跨被试、多被试、少样本场景
- **🔗 原文：** https://arxiv.org/abs/2507.09882

---

## 🎨 视觉与创意应用

### 6. Symbiotic Brain-Machine Drawing via Visual Imagery
- **ArXiv ID:** 2511.20835
- **发布时间：** 2025年11月
- **核心内容：** 非侵入式思维绘画BCI系统
- **技术特点：**
  - 使用稳态视觉诱发电位（SSVEPs）分析
  - 仅需单通道EEG数据，约2分钟内重建简单想象形状
  - 结合Stable Diffusion模型将重建的心智图像转换为真实视觉表现
  - 人机协同将BCI比特率提升5倍以上
- **🔗 原文：** https://arxiv.org/abs/2511.20835

---

## 🥽 VR与混合现实

### 7. NeuroGaze: Hybrid EEG and Eye-Tracking for VR
- **ArXiv ID:** 2509.07863
- **发布时间：** 2025年9月
- **核心内容：** 结合脑电和眼动追踪的VR混合交互界面
- **应用场景：** 沉浸式VR中的免手操作交互
- **研究发现：**
  - 使用消费级硬件即可实现目标选择
  - 错误率低于其他方法，但完成时间较长（速度-准确性权衡）
  - 相比控制器减少了身体负担
  - 展示了消费级BCI在日常VR应用中的可行性
- **🔗 原文：** https://arxiv.org/abs/2509.07863

---

## 📈 信号处理与稳定性

### 8. Non-Stationarity in Brain-Computer Interfaces
- **ArXiv ID:** 2512.15941
- **发布时间：** 2025年12月
- **核心内容：** EEG信号非平稳性问题的综述
- **关键挑战：**
  - 会话内、跨会话、跨个体的信号变化
  - 协变量偏移（covariate shift）问题
- **解决方案：** 信号处理和机器学习技术用于归一化EEG信号
- **🔗 原文：** https://arxiv.org/abs/2512.15941

---

## 🔍 其他相关研究

### 9. Real-Time Attention Measurement Using Wearable BCIs
- **来源：** MDPI Brain Sciences
- **核心内容：** 使用可穿戴脑机接口在严肃游戏中进行实时注意力测量
- **🔗 原文：** https://www.mdpi.com/2571-5577/8/6/166

### 10. Generative AI for Brain-Computer Interfaces Decoding
- **来源：** The Innovation Medicine
- **核心内容：** 生成式AI在BCI解码中的应用综述，聚焦语言和视觉解码的方法学进展
- **🔗 原文：** https://www.the-innovation.org/article/doi/10.59717/j.xinn-med.2026.100193

---

## 📊 趋势总结

1. **大模型融合：** LLM与EEG的结合成为热点，从文本解码到康复辅助应用广泛
2. **基础模型兴起：** 自监督预训练推动脑电基础模型发展，但基准测试和泛化仍是挑战
3. **消费级应用：** 可穿戴设备和消费级BCI在VR、游戏等场景逐渐实用化
4. **跨模态生成：** 脑电信号到图像、文本的多模态转换取得突破
5. **稳定性挑战：** 信号非平稳性仍是非侵入式BCI的核心技术难题

---

*简报由 Kimi Claw 自动生成*
