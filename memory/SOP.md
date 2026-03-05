# 文件-based记忆管理SOP

> Standard Operating Procedure for File-Based Memory Management

---

## 一、文件结构

```
workspace/
├── MEMORY.md              # 长期记忆档案（跨会话）
├── USER.md                # 用户档案（项目+修行）
├── SOUL.md                # AI性格设定
├── memory/
│   ├── index.md           # 日志索引（快速导航）
│   ├── YYYY-MM-DD.md      # 每日日志（短期记忆）
│   └── archive/           # 归档日志（超过3个月）
└── ...
```

---

## 二、每日日志规范

### 创建时间
- **自动**：每天 00:01 由cron任务创建
- **手动**：对话开始时检查，如不存在则创建

### 文件命名
```
memory/2026-03-03.md
memory/2026-03-04.md
...
```

### 内容模板
```markdown
# YYYY-MM-DD 记忆日志

## 今日事件

### HH:MM - 事件标题
- 关键对话内容摘要
- 决策/行动项

## 待办事项
- [ ] 任务1（来源：XX对话）
- [ ] 任务2

## 重要更新
- 文档变更：XXX.md 更新
- 档案版本：vX.X

## 备注
- 临时想法、灵感、待确认事项
```

---

## 三、长期记忆维护

### MEMORY.md 更新时机
1. **每周日**：回顾本周日志，提取关键事件
2. **重要决策后**：立即更新
3. **项目里程碑**：记录达成情况

### 内容结构
```markdown
# MEMORY.md

## 关于宗国法师（核心档案）
- 身份、见地、法界观关键词

## 关于我们的关系
- 契约时间、相处模式

## 止观AI项目（核心记忆）
- 三层结构、里程碑、现有资产

## 重要教训
- 问题、原因、解决、预防

## 待长期关注
- 项目方向、技术跟进、个人关怀

## 记忆维护
- 维护规则
```

---

## 四、索引维护

### memory/index.md 更新时机
- **每周日**：同步本周日志链接
- **每月初**：整理上月归档

### 分类方式
1. **按日期浏览**：时间线倒序
2. **按主题分类**：重要事件、档案更新
3. **待办汇总**：进行中 + 待长期关注

---

## 五、检索流程

### 快速定位
1. 查今日 → `memory/YYYY-MM-DD.md`
2. 查历史 → `memory/index.md` 按日期/主题浏览
3. 查核心 → `MEMORY.md`

### 深度检索
```bash
# 关键词搜索所有日志
grep -r "关键词" memory/

# 搜索特定日期范围
ls memory/2026-03-*.md
```

---

## 六、自动化任务

### Cron任务清单

```bash
# 每天 00:01 创建当日日志
1 0 * * * /root/.openclaw/workspace/scripts/create-daily-log.sh

# 每周日 23:00 生成周回顾
0 23 * * 0 /root/.openclaw/workspace/scripts/weekly-review.sh

# 每月1日 00:00 归档旧日志
0 0 1 * * /root/.openclaw/workspace/scripts/archive-old-logs.sh
```

---

## 七、备份策略

### 本地备份
- 每日自动备份到 `/backup/memory/`
- 保留最近30天

### 远程备份（可选）
- 同步到飞书云文档
- 或Git私有仓库

---

*文档版本：v1.0*
*创建时间：2026-03-03*
*维护者：Zen*
