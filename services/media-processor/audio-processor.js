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
