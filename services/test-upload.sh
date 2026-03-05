#!/bin/bash
# 文件上传测试脚本

echo "测试文件上传状态检查服务..."

# 模拟文件上传测试
node -e "
const FileUploadChecker = require('./file-upload-checker.js');
const checker = new FileUploadChecker();

// 测试用例1：正常上传
checker.waitForUpload('test.mp3', 'user_001')
  .then(result => console.log('✓ 测试通过:', result))
  .catch(err => console.log('✗ 测试失败:', err));

// 测试用例2：超时情况  
setTimeout(() => {
  checker.waitForUpload('nonexistent.mp3', 'user_002')
    .then(result => console.log('✗ 应该超时:', result))
    .catch(err => console.log('✓ 超时测试通过:', err.message));
}, 100);
"
