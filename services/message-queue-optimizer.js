/**
 * 消息队列优化服务
 * 解决消息队列拥塞问题
 */

class MessageQueueOptimizer {
  constructor() {
    this.queues = {
      urgent: [],      // 紧急队列
      normal: [],      // 普通队列
      background: []   // 后台队列
    }
    
    this.config = {
      urgent: {
        priority: 1,
        timeout: 5000,      // 5秒超时
        concurrency: 1,     // 单线程
        maxSize: 10
      },
      normal: {
        priority: 2,
        timeout: 60000,     // 60秒超时
        concurrency: 3,     // 3并发
        maxSize: 50
      },
      background: {
        priority: 3,
        timeout: 300000,    // 5分钟超时
        concurrency: 5,     // 5并发
        maxSize: 100
      }
    }
    
    this.processing = false
    this.stats = {
      processed: 0,
      failed: 0,
      avgWaitTime: 0
    }
  }

  /**
   * 分类消息到不同队列
   */
  classifyMessage(message) {
    const content = message.content || message.text || ''
    
    // 紧急消息：错误、中断、紧急修复
    if (content.includes('错误') || 
        content.includes('失败') || 
        content.includes('中断') ||
        content.includes('紧急')) {
      return 'urgent'
    }
    
    // 后台消息：文档生成、日志、统计
    if (content.includes('文档') || 
        content.includes('日志') || 
        content.includes('统计') ||
        content.includes('报告')) {
      return 'background'
    }
    
    // 普通消息：开发需求、代码修改
    return 'normal'
  }

  /**
   * 添加消息到队列
   */
  enqueue(message) {
    const queueName = this.classifyMessage(message)
    const queue = this.queues[queueName]
    const config = this.config[queueName]
    
    // 队列满时处理
    if (queue.length >= config.maxSize) {
      console.warn(`[Queue] ${queueName} 队列已满，丢弃最早消息`)
      queue.shift() // 移除最早消息
    }
    
    queue.push({
      ...message,
      enqueueTime: Date.now(),
      queueName
    })
    
    console.log(`[Queue] 消息已加入 ${queueName} 队列，当前长度: ${queue.length}`)
    
    // 触发处理
    if (!this.processing) {
      this.processQueues()
    }
  }

  /**
   * 处理队列
   */
  async processQueues() {
    this.processing = true
    
    while (this.hasMessages()) {
      // 按优先级处理：urgent > normal > background
      for (const queueName of ['urgent', 'normal', 'background']) {
        const queue = this.queues[queueName]
        const config = this.config[queueName]
        
        if (queue.length === 0) continue
        
        // 取出消息
        const message = queue.shift()
        const waitTime = Date.now() - message.enqueueTime
        
        console.log(`[Queue] 处理 ${queueName} 消息，等待时间: ${waitTime}ms`)
        
        try {
          // 设置超时
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('处理超时')), config.timeout)
          })
          
          // 处理消息
          const processPromise = this.processMessage(message)
          
          await Promise.race([processPromise, timeoutPromise])
          
          this.stats.processed++
          this.stats.avgWaitTime = (this.stats.avgWaitTime + waitTime) / 2
          
        } catch (error) {
          console.error(`[Queue] 处理失败:`, error.message)
          this.stats.failed++
        }
      }
    }
    
    this.processing = false
  }

  /**
   * 处理单条消息
   */
  async processMessage(message) {
    // 模拟处理时间
    const processTime = Math.random() * 2000 + 1000
    await new Promise(resolve => setTimeout(resolve, processTime))
    
    console.log(`[Queue] 消息处理完成: ${message.id || 'unknown'}`)
  }

  /**
   * 检查是否有消息
   */
  hasMessages() {
    return Object.values(this.queues).some(queue => queue.length > 0)
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      queueSizes: {
        urgent: this.queues.urgent.length,
        normal: this.queues.normal.length,
        background: this.queues.background.length
      }
    }
  }

  /**
   * 生成用户等待提示
   */
  generateWaitPrompt(queuePosition, estimatedTime) {
    if (queuePosition === 0) {
      return '⏳ 正在处理您的请求，请稍候...'
    }
    return `⏳ 您的请求正在排队，当前位置: ${queuePosition}，预计等待: ${estimatedTime}秒`
  }
}

module.exports = MessageQueueOptimizer
