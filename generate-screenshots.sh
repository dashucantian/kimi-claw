#!/bin/bash
# 25张配图生成脚本
# 使用ImageMagick生成占位图，标注截图位置

echo "=========================================="
echo "生成25张教程配图占位图"
echo "=========================================="

mkdir -p /root/.openclaw/workspace/tutorial-images

cd /root/.openclaw/workspace/tutorial-images

# 检查ImageMagick是否安装
if ! command -v convert &> /dev/null; then
    echo "正在安装ImageMagick..."
    apt-get update && apt-get install -y imagemagick
fi

# 生成函数
generate_image() {
    local num=$1
    local title=$2
    local desc=$3
    local size=$4
    
    convert -size $size xc:darkblue \
        -pointsize 30 \
        -fill white \
        -gravity center \
        -annotate +0+0 "截图${num}\n${title}\n\n${desc}\n\n[在此位置截取实际截图]" \
        "screenshot-${num}-${title}.png"
    
    echo "✓ 生成配图 ${num}: ${title}"
}

# 第一部分：环境准备（8张）
echo ""
echo "【第一部分：环境准备】"
generate_image "01" "OpenClaw官网" "展示产品定位\n圈出Kimi Code会员版入口" "1920x1080"
generate_image "02" "飞书注册" "手机号注册流程" "750x1334"
generate_image "03" "微信开发者工具下载" "显示Windows/Mac/Linux选项" "1920x1080"
generate_image "04" "飞书创建群组" "点击右上角+\n输入群名称" "750x1334"
generate_image "05" "OpenClaw飞书配置" "Webhook配置页面" "1920x1080"
generate_image "06" "机器人加入群聊" "成功提示消息" "750x1334"
generate_image "07" "微信开发者工具登录" "扫码登录界面" "1920x1080"
generate_image "08" "微信开发者工具主界面" "项目列表、菜单栏、工具栏" "1920x1080"

# 第二部分：开发过程（7张）
echo ""
echo "【第二部分：开发过程】"
generate_image "09" "飞书群初始对话" "用户发送需求\nAI回复确认" "750x1334"
generate_image "10" "AI回复代码" "代码块展示" "750x1334"
generate_image "11" "文件上传过程" "拖拽文件\n显示上传进度" "750x1334"
generate_image "12" "文件上传确认" "AI确认收到文件" "750x1334"
generate_image "13" "版本迭代对话" "v15到v25的迭代记录" "750x1334"
generate_image "14" "错误调试过程" "控制台报错信息" "1920x1080"
generate_image "15" "成功预览截图" "止观小程序运行效果" "750x1334"

# 第三部分：问题解决（5张）
echo ""
echo "【第三部分：问题解决】"
generate_image "16" "文件未找到错误" "AI提示未收到文件" "750x1334"
generate_image "17" "消息队列提示" "正在处理中提示" "750x1334"
generate_image "18" "音量调整记录" "v21-v25参数变化" "750x1334"
generate_image "19" "版本打包完成" "tar.gz文件发送" "750x1334"
generate_image "20" "最终效果展示" "止观小程序完整界面" "750x1334"

# 第四部分：架构与系统（5张）
echo ""
echo "【第四部分：架构与系统】"
generate_image "21" "系统架构图" "四层架构可视化" "1920x1080"
generate_image "22" "飞轮模型图" "事件-过程-成果-系统" "1920x1080"
generate_image "23" "Phase1实施截图" "终端执行输出" "1920x1080"
generate_image "24" "Phase2实施截图" "消息队列优化完成" "1920x1080"
generate_image "25" "教程文档封面" "本文档首页" "1920x1080"

echo ""
echo "=========================================="
echo "25张配图占位图生成完成"
echo "=========================================="
echo ""
echo "文件位置：/root/.openclaw/workspace/tutorial-images/"
echo ""
echo "使用说明："
echo "1. 这些占位图标注了截图位置和尺寸"
echo "2. 在实际环境中截取对应位置的截图"
echo "3. 用实际截图替换这些占位图"
echo "4. 保持文件名一致，方便文档引用"
echo ""
echo "截图工具推荐："
echo "- Mac: Cmd+Shift+4 (区域截图)"
echo "- Windows: Win+Shift+S"
echo "- Chrome: DevTools Capture screenshot"
