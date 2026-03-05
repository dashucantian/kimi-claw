# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## 止观AI 资讯简报标准化流程

**触发条件：** cron 任务生成正念冥想、脑机接口、神经技术、VR、脑电、大模型等资讯后

**执行流程：**
1. 搜索相关原文/原视频链接
2. 创建飞书文档（标题格式：`止观AI简报YYYYMMDD`）
3. **使用 append 方式逐段写入内容**（严禁使用 write）
4. 验证文档内容（read 检查 block_count > 1）
5. 发送文档链接给用户

**踩坑记录：**
- write 操作有兼容性问题，长内容或表格会失败
- append 逐段写入稳定可靠
- 避免使用 Markdown 表格，用列表代替

**详细日志见：** `memory/2026-02-25.md`

---

Add whatever helps you do your job. This is your cheat sheet.
