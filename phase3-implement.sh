#!/bin/bash
# Phase 3: 媒体处理能力部署
# 目标：部署FFmpeg容器，实现音频处理能力

echo "=========================================="
echo "Phase 3: 媒体处理能力部署"
echo "=========================================="

# 1. 创建FFmpeg容器Dockerfile
echo "[1/5] 创建FFmpeg容器Dockerfile..."

mkdir -p /root/.openclaw/workspace/services/media-processor

cat > /root/.openclaw/workspace/services/media-processor/Dockerfile << 'EOF'
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
EOF

echo "✓ Dockerfile已创建"

# 2. 创建音频处理服务
echo "[2/5] 创建音频处理服务..."

cat > /root/.openclaw/workspace/services/media-processor/audio-processor.js << 'EOF'
/**
 * 音频处理服务
 * 基于FFmpeg的音频操作
 */

const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')

class AudioProcessor {
  constructor() {
    this.tempDir = '/tmp/audio-processing'
    this.ensureTempDir()
  }

  ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true })
    }
  }

  /**
   * 调整音量
   * @param {string} inputPath - 输入文件路径
   * @param {number} volume - 音量倍数（0.1-100）
   * @returns {Promise<string>} - 输出文件路径
   */
  async adjustVolume(inputPath, volume) {
    const outputPath = path.join(this.tempDir, `volume-${Date.now()}.mp3`)
    
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioFilters(`volume=${volume}`)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run()
    })
  }

  /**
   * 裁剪音频
   * @param {string} inputPath - 输入文件路径
   * @param {number} start - 开始时间（秒）
   * @param {number} end - 结束时间（秒）
   * @returns {Promise<string>} - 输出文件路径
   */
  async trim(inputPath, start, end) {
    const outputPath = path.join(this.tempDir, `trim-${Date.now()}.mp3`)
    const duration = end - start
    
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(start)
        .setDuration(duration)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run()
    })
  }

  /**
   * 创建循环音频
   * @param {string} inputPath - 输入文件路径
   * @param {number} targetDuration - 目标时长（秒）
   * @returns {Promise<string>} - 输出文件路径
   */
  async createLoop(inputPath, targetDuration) {
    const outputPath = path.join(this.tempDir, `loop-${Date.now()}.mp3`)
    
    // 获取输入文件时长
    const inputDuration = await this.getDuration(inputPath)
    const loopCount = Math.ceil(targetDuration / inputDuration)
    
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .inputOptions(['-stream_loop', loopCount.toString()])
        .setDuration(targetDuration)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run()
    })
  }

  /**
   * 合并多个音频
   * @param {string[]} inputPaths - 输入文件路径数组
   * @returns {Promise<string>} - 输出文件路径
   */
  async merge(inputPaths) {
    const outputPath = path.join(this.tempDir, `merge-${Date.now()}.mp3`)
    
    return new Promise((resolve, reject) => {
      const command = ffmpeg()
      
      inputPaths.forEach(path => command.input(path))
      
      command
        .mergeToFile(outputPath, this.tempDir)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
    })
  }

  /**
   * 获取音频时长
   * @param {string} inputPath - 输入文件路径
   * @returns {Promise<number>} - 时长（秒）
   */
  async getDuration(inputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) reject(err)
        else resolve(metadata.format.duration)
      })
    })
  }

  /**
   * 格式转换
   * @param {string} inputPath - 输入文件路径
   * @param {string} format - 目标格式（mp3/wav/ogg）
   * @returns {Promise<string>} - 输出文件路径
   */
  async convert(inputPath, format) {
    const outputPath = path.join(this.tempDir, `convert-${Date.now()}.${format}`)
    
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat(format)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run()
    })
  }
}

module.exports = AudioProcessor
EOF

echo "✓ 音频处理服务已创建"

# 3. 创建API服务器
echo "[3/5] 创建API服务器..."

cat > /root/.openclaw/workspace/services/media-processor/media-server.js << 'EOF'
/**
 * 媒体处理API服务器
 */

const express = require('express')
const multer = require('multer')
const AudioProcessor = require('./audio-processor')
const path = require('path')

const app = express()
const processor = new AudioProcessor()

// 文件上传配置
const upload = multer({ dest: '/tmp/uploads/' })

// 中间件
app.use(express.json())

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'media-processor', version: '1.0.0' })
})

// 调整音量
app.post('/audio/volume', upload.single('file'), async (req, res) => {
  try {
    const { volume } = req.body
    const inputPath = req.file.path
    
    const outputPath = await processor.adjustVolume(inputPath, parseFloat(volume))
    
    res.json({
      success: true,
      outputPath,
      message: `音量已调整为 ${volume} 倍`
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 裁剪音频
app.post('/audio/trim', upload.single('file'), async (req, res) => {
  try {
    const { start, end } = req.body
    const inputPath = req.file.path
    
    const outputPath = await processor.trim(inputPath, parseFloat(start), parseFloat(end))
    
    res.json({
      success: true,
      outputPath,
      message: `音频已裁剪：${start}s - ${end}s`
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 创建循环
app.post('/audio/loop', upload.single('file'), async (req, res) => {
  try {
    const { duration } = req.body
    const inputPath = req.file.path
    
    const outputPath = await processor.createLoop(inputPath, parseFloat(duration))
    
    res.json({
      success: true,
      outputPath,
      message: `已创建 ${duration} 秒循环音频`
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 获取音频信息
app.post('/audio/info', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const duration = await processor.getDuration(inputPath)
    
    res.json({
      success: true,
      duration,
      format: path.extname(req.file.originalname)
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 启动服务
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`媒体处理服务已启动，端口：${PORT}`)
})
EOF

echo "✓ API服务器已创建"

# 4. 创建部署脚本
echo "[4/5] 创建部署脚本..."

cat > /root/.openclaw/workspace/services/media-processor/deploy.sh << 'EOF'
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
EOF

chmod +x /root/.openclaw/workspace/services/media-processor/deploy.sh
echo "✓ 部署脚本已创建"

# 5. 更新Skill配置
echo "[5/5] 更新Skill配置..."

cat > /root/.openclaw/workspace/skills/zhiguan-briefing/updates/phase3-media-processing.yaml << 'EOF'
# Phase 3: 媒体处理能力
version: 3.3.0
updates:
  - type: feature
    id: ffmpeg-container
    title: FFmpeg媒体处理容器
    description: 支持音频裁剪、音量调整、循环生成
    status: implemented
    
  - type: feature
    id: audio-api
    title: 音频处理API
    description: RESTful API，支持各种音频操作
    status: implemented
    
  - type: integration
    id: openclaw-integration
    title: OpenClaw集成
    description: AI可直接调用音频处理能力
    status: planned

api_endpoints:
  - path: /audio/volume
    method: POST
    description: 调整音量
    
  - path: /audio/trim
    method: POST
    description: 裁剪音频
    
  - path: /audio/loop
    method: POST
    description: 创建循环
    
  - path: /audio/info
    method: POST
    description: 获取音频信息

capabilities:
  - 音量调整（0.1-100倍）
  - 音频裁剪（精确到毫秒）
  - 循环生成（指定时长）
  - 格式转换（mp3/wav/ogg）
  - 音频合并（多文件拼接）
EOF

echo "✓ Skill配置已更新"

echo ""
echo "=========================================="
echo "Phase 3 部署包已生成"
echo "=========================================="
echo ""
echo "文件位置："
echo "- Dockerfile: services/media-processor/Dockerfile"
echo "- 音频处理器: services/media-processor/audio-processor.js"
echo "- API服务器: services/media-processor/media-server.js"
echo "- 部署脚本: services/media-processor/deploy.sh"
echo ""
echo "部署步骤："
echo "1. cd services/media-processor"
echo "2. ./deploy.sh"
echo "3. 测试：curl http://localhost:8080/health"
echo ""
echo "预期效果："
echo "- AI可直接处理音频文件"
echo "- 无需用户本地安装FFmpeg"
echo "- 支持实时音频操作"
