# FFmpeg媒体处理容器
FROM node:18-alpine

# 安装FFmpeg和音频处理依赖
RUN apk add --no-cache \
    ffmpeg \
    sox \
    sox-dev \
    libvorbis \
    flac

# 安装Node.js音频处理库
WORKDIR /app
RUN npm install \
    fluent-ffmpeg \
    node-wav \
    lame

# 复制服务代码
COPY media-server.js .
COPY audio-processor.js .

# 暴露API端口
EXPOSE 8080

# 启动服务
CMD ["node", "media-server.js"]
