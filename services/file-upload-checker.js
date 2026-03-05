/**
 * 文件上传状态检查服务
 * 解决飞书文件上传时序问题
 */

class FileUploadChecker {
  constructor() {
    this.pendingUploads = new Map()
    this.checkInterval = 1000 // 每秒检查
    this.maxWaitTime = 30000 // 最大等待30秒
  }

  /**
   * 等待文件上传完成
   * @param {string} fileName - 文件名
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} - 上传结果
   */
  async waitForUpload(fileName, userId) {
    const startTime = Date.now()
    const key = `${userId}:${fileName}`
    
    console.log(`[FileUpload] 开始等待文件: ${fileName}`)
    
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(async () => {
        const elapsed = Date.now() - startTime
        
        // 检查文件是否存在
        const exists = await this.checkFileExists(fileName, userId)
        
        if (exists) {
          clearInterval(checkInterval)
          console.log(`[FileUpload] 文件上传完成: ${fileName} (${elapsed}ms)`)
          resolve({
            success: true,
            fileName,
            elapsed,
            path: exists.path
          })
          return
        }
        
        // 超时检查
        if (elapsed > this.maxWaitTime) {
          clearInterval(checkInterval)
          console.error(`[FileUpload] 文件上传超时: ${fileName}`)
          reject({
            success: false,
            error: '上传超时',
            fileName,
            elapsed
          })
        }
      }, this.checkInterval)
    })
  }

  /**
   * 检查文件是否存在
   */
  async checkFileExists(fileName, userId) {
    // 实际实现：检查文件系统或数据库
    const uploadPath = `/root/.openclaw/media/inbound/`
    const files = require('fs').readdirSync(uploadPath)
    
    for (const file of files) {
      if (file.includes(fileName) || fileName.includes(file.replace(/---.*$/, ''))) {
        return {
          exists: true,
          path: `${uploadPath}${file}`,
          name: file
        }
      }
    }
    return null
  }

  /**
   * 生成用户提示
   */
  generateUploadPrompt(fileName, fileSize) {
    return `
📤 文件上传确认

检测到文件上传请求：${fileName}

状态检查：
□ 文件名：${fileName}
□ 预计大小：${fileSize || '未知'} MB
□ 状态：上传中...

⏳ 请等待「✅ 上传完成」提示后再继续...

💡 提示：大文件可能需要3-10秒上传时间
`
  }

  /**
   * 生成完成提示
   */
  generateCompletePrompt(fileName, elapsed) {
    return `
✅ 文件上传完成

文件名：${fileName}
上传耗时：${elapsed}ms

可以继续发送处理指令了。
`
  }
}

module.exports = FileUploadChecker
