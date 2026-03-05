#!/bin/bash
# 飞书机器人配置脚本 - 替换 YOUR_APP_ID 和 YOUR_APP_SECRET 后运行

APP_ID="YOUR_APP_ID"
APP_SECRET="YOUR_APP_SECRET"

if [ "$APP_ID" = "YOUR_APP_ID" ]; then
    echo "错误：请先编辑脚本，设置你的 App ID 和 App Secret"
    exit 1
fi

echo "配置飞书通道..."

openclaw config set channels.feishu.appId "$APP_ID"
openclaw config set channels.feishu.appSecret "$APP_SECRET"
openclaw config set channels.feishu.requireMention true
openclaw config set channels.feishu.dmPolicy "open"
openclaw config set channels.feishu.groupPolicy "open"
openclaw config set channels.feishu.enabled true

echo ""
echo "配置完成，验证中..."
openclaw config get channels.feishu

echo ""
echo "重启 Gateway..."
openclaw gateway restart

echo ""
echo "完成！飞书机器人已连接。"
