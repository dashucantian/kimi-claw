# 飞书文档 API 使用注意事项

## 已验证的操作方式

### 创建文档
```json
{
  "action": "create",
  "title": "止观AI简报YYYYMMDD"
}
```

### 追加内容（推荐）
```json
{
  "action": "append",
  "doc_token": "XXX",
  "content": "分段内容"
}
```

### 验证内容
```json
{
  "action": "read",
  "doc_token": "XXX"
}
```
验证标准：`block_count` > 1

## 踩坑记录

### ❌ 不推荐使用 write 操作
- 长内容容易失败
- 不支持 Markdown 表格
- 返回 HTTP 400 错误

### ✅ 推荐使用 append 操作
- 稳定可靠
- 逐段写入，错误可控
- 支持简单列表格式

## 格式建议

- 使用 `- ` 开头的简单列表
- 避免使用 `#` 标题符号
- 避免使用 Markdown 表格
- 每段内容控制在 500 字以内
