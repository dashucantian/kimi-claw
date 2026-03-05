#!/bin/bash
# 媒体处理服务部署脚本

echo "部署媒体处理服务..."

# 构建镜像
docker build -t media-processor:latest .

# 停止旧容器（如果存在）
docker stop media-processor 2>/dev/null || true
docker rm media-processor 2>/dev/null || true

# 启动新容器
docker run -d \
  --name media-processor \
  -p 8080:8080 \
  -v /tmp/audio-processing:/tmp/audio-processing \
  -v /tmp/uploads:/tmp/uploads \
  --restart always \
  media-processor:latest

echo "部署完成！"
echo "API地址：http://localhost:8080"
echo "健康检查：http://localhost:8080/health"
