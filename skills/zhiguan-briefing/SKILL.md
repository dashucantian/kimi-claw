---
name: zhiguan-briefing
description: |
  止观AI资讯简报生成 Skill。用于自动化创建正念、冥想、禅修、脑机接口、神经技术、VR/AR、大模型、Web3、元宇宙等领域的研究资讯简报。
  
  触发条件：
  1. 用户要求生成简报
  2. cron 任务生成相关领域资讯后需要整理成飞书文档
  3. 需要将搜索结果整理成结构化简报
  
  本 Skill 提供标准化流程：搜索原文 → 创建飞书文档 → append 逐段写入 → 验证 → 返回链接
---

# 止观AI简报生成 Skill

## 快速开始

当用户需要生成简报时，执行以下流程：

### 步骤 1：搜索相关原文/原视频链接

**主要渠道（按优先级）：**

1. **YouTube** - 使用 `kimi_search` 搜索：
   - "YouTube 正念 冥想 禅修 最新"
   - "YouTube 脑机接口 BCI"
   - "YouTube 神经技术"
   - "YouTube VR AR 最新"
   - "YouTube 大模型 AI"
   - "YouTube Web3 元宇宙"

2. **X (Twitter)** - 使用 `kimi_search` 搜索：
   - "Twitter X 正念 冥想 禅修 最新动态"
   - "Twitter X 脑机接口 Neuralink"
   - "Twitter X 神经科学"
   - "Twitter X VR AR"
   - "Twitter X 大模型 AI"
   - "Twitter X Web3 元宇宙"

3. **ArXiv** - 使用 `kimi_search` 搜索：
   - "ArXiv mindfulness meditation"
   - "ArXiv brain computer interface"
   - "ArXiv neurotechnology"
   - "ArXiv VR AR virtual reality"
   - "ArXiv large language model"
   - "ArXiv Web3 metaverse"

4. **B站** - 使用 `kimi_search` 搜索：
   - "B站 正念 冥想 禅修 最新视频"
   - "B站 脑机接口 科普"
   - "B站 神经科学"
   - "B站 VR AR 虚拟现实"
   - "B站 大模型 AI"
   - "B站 Web3 元宇宙"

5. **小红书** - 使用 `kimi_search` 搜索：
   - "小红书 正念 冥想 禅修 体验"
   - "小红书 脑机接口"
   - "小红书 疗愈"
   - "小红书 VR AR 体验"
   - "小红书 大模型"
   - "小红书 Web3 元宇宙"

6. **秘塔搜索** - 使用 `kimi_search` 搜索：
   - "秘塔 正念 冥想 禅修 研究"
   - "秘塔 脑机接口 进展"
   - "秘塔 神经技术"
   - "秘塔 VR AR 产业"
   - "秘塔 大模型"
   - "秘塔 Web3 元宇宙"

7. **Insight Timer** - 使用 `kimi_search` 搜索：
   - "Insight Timer 正念 冥想 禅修"
   - "Insight Timer 最新课程"
   - "Insight Timer 导师"

**记录要求：**
- 每条资讯必须记录原始链接
- 记录发布日期、作者/频道、核心摘要
- 优先获取原始来源，避免二手转载

### 步骤 2：创建飞书文档

```json
{
  "action": "create",
  "title": "止观AI简报YYYYMMDD"
}
```

记录返回的 `doc_token` 和 `url`。

### 步骤 3：使用 append 逐段写入内容

**重要：严禁使用 `write` 操作，必须使用 `append`**

分段策略：
1. 主标题
2. 报告日期和编制信息
3. 第一部分标题（正念 冥想 禅修）
4. 第一部分各小节（每节一个 append）
5. 第二部分标题（VR/AR、脑机接口与大模型）
6. 第二部分各小节
7. 第三部分标题（Web3/元宇宙）
8. 第三部分各小节
9. 结语
10. 数据来源

示例：
```json
{
  "action": "append",
  "doc_token": "XXX",
  "content": "止观AI - 正念 冥想 禅修 与科技研究简报"
}
```

### 步骤 4：验证文档内容

```json
{
  "action": "read",
  "doc_token": "XXX"
}
```

验证标准：`block_count` > 1

### 步骤 5：发送文档链接给用户

消息模板：
```
今日止观AI简报已生成：

一、正念 冥想 禅修
- YouTube：XXX（附链接）
- X：XXX（附链接）
- B站：XXX（附链接）
- Insight Timer：XXX（附链接）

二、VR/AR、脑机接口与大模型
- YouTube：XXX（附链接）
- ArXiv：XXX（附链接）
- B站：XXX（附链接）

三、Web3/元宇宙
- ArXiv：XXX（附链接）
- 小红书：XXX（附链接）
- 秘塔：XXX（附链接）

飞书文档（完整内容）：https://feishu.cn/docx/XXX
```

## 格式规范

### 内容格式
- 使用简单列表（`- ` 开头）
- 避免使用 Markdown 表格
- 避免使用 `#` 标题符号
- 每段内容不超过 500 字

### 标题格式
统一格式：`止观AI简报YYYYMMDD`

示例：`止观AI简报20260225`

## 参考资料

- API 注意事项：参见 [references/feishu_api_notes.md](references/feishu_api_notes.md)
- 简报模板：参见 [assets/briefing_template.md](assets/briefing_template.md)

## 踩坑速查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| write 操作返回 400 | 内容格式不兼容 | 改用 append |
| 文档只有标题 | write 失败未报错 | 使用 append + 验证 |
| 格式混乱 | Markdown 不支持 | 使用简单列表 |

## 检查清单

执行时检查：
- [ ] 搜索原文/视频链接
- [ ] 创建飞书文档（记录 doc_token）
- [ ] 使用 append 逐段写入（不用 write）
- [ ] 验证文档内容（read 检查 block_count > 1）
- [ ] 发送文档链接给用户
