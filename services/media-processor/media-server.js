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
