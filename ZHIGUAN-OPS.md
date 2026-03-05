# 止观AI项目 - 会话管理指南

## 防止KimiClaw崩溃的最佳实践

### 1. 定期清理会话
- 每2-3小时发送 `/new` 开启新会话
- 复杂任务拆分为多个子任务
- 避免单一会话超过500轮对话

### 2. 配置备份策略
- 修改配置前自动创建 `.bak` 备份
- 每周手动备份 `~/.openclaw/openclaw.json`
- 重要变更记录到 `memory/` 目录

### 3. 监控检查清单
- [ ] Gateway状态正常
- [ ] 日志文件不超过100MB
- [ ] 磁盘空间使用率 < 80%
- [ ] 飞书消息收发正常

### 4. 应急响应
如果KimiClaw无响应：
1. 检查 `openclaw gateway status`
2. 查看日志 `tail -f /tmp/openclaw/openclaw-*.log`
3. 必要时重启 `openclaw gateway restart`
4. 重新连接飞书机器人

### 5. 任务管理原则
- 单一会话聚焦一个主题
- 长任务使用 `sessions_spawn` 创建子代理
- 重要中间结果保存到文件
