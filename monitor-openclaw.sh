#!/bin/bash
# 止观AI项目 - OpenClaw监控脚本

LOG_FILE="/tmp/openclaw/monitor.log"
GATEWAY_STATUS=$(openclaw gateway status 2>&1)
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# 检查Gateway状态
if echo "$GATEWAY_STATUS" | grep -q "running"; then
    echo "[$DATE] ✅ Gateway运行正常" >> $LOG_FILE
else
    echo "[$DATE] ❌ Gateway异常，尝试重启..." >> $LOG_FILE
    openclaw gateway restart >> $LOG_FILE 2>&1
fi

# 检查日志文件大小（超过100MB则清理）
LOG_SIZE=$(du -m /tmp/openclaw/openclaw-*.log 2>/dev/null | awk '{print $1}' | head -1)
if [ -n "$LOG_SIZE" ] && [ "$LOG_SIZE" -gt 100 ]; then
    echo "[$DATE] ⚠️ 日志文件过大(${LOG_SIZE}MB)，执行轮转" >> $LOG_FILE
    mv /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log.old 2>/dev/null
fi

# 检查磁盘空间
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo "[$DATE] ⚠️ 磁盘使用率${DISK_USAGE}%，建议清理" >> $LOG_FILE
fi

echo "[$DATE] 监控检查完成" >> $LOG_FILE
