#!/bin/bash
# 止观AI - 音频生成脚本
# 使用 Edge TTS 生成引导音频

set -e

CONTENT_DIR="/root/.openclaw/workspace/zhiguan-plugin/content/audio"
VOICE="zh-CN-XiaoxiaoNeural"  # 柔和女声
OUTPUT_FORMAT="mp3"

echo "🎙️ 止观AI音频生成工具"
echo "===================="

# 检查依赖
if ! command -v edge-tts &> /dev/null; then
    echo "正在安装 edge-tts..."
    pip3 install edge-tts -q
fi

if ! command -v ffmpeg &> /dev/null; then
    echo "❌ 请先安装 ffmpeg: apt-get install ffmpeg"
    exit 1
fi

# 生成函数
generate_audio() {
    local input_file=$1
    local output_file=$2
    local rate=$3  # 语速
    
    echo "生成: $output_file"
    
    # 提取纯文本（移除markdown标记）
    sed 's/#.*//g; s/^- //g; s/^> //g; s/`//g; s/\*\*//g; s/^$//g' "$input_file" | \
    grep -v '^$' | \
    edge-tts --voice "$VOICE" --rate="$rate" --file - --write-media "$output_file"
    
    echo "✅ 完成: $output_file"
}

# 生成3分钟版本
echo ""
echo "📀 生成3分钟版本..."
generate_audio "$CONTENT_DIR/3min/script.md" "$CONTENT_DIR/3min/guided.mp3" "-10%"

# 生成5分钟版本
echo ""
echo "📀 生成5分钟版本..."
generate_audio "$CONTENT_DIR/5min/script.md" "$CONTENT_DIR/5min/guided.mp3" "-15%"

# 生成10分钟版本
echo ""
echo "📀 生成10分钟版本..."
generate_audio "$CONTENT_DIR/10min/script.md" "$CONTENT_DIR/10min/guided.mp3" "-20%"

echo ""
echo "🎉 所有音频生成完成！"
echo ""
echo "文件列表:"
ls -lh $CONTENT_DIR/*/guided.mp3 2>/dev/null || echo "生成失败"
