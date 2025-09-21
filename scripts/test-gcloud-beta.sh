#!/bin/bash

# 测试 gcloud beta 命令是否可用

echo "🔍 测试 gcloud beta 命令..."

# 检查 gcloud 是否已安装
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI 未安装"
    exit 1
fi

# 检查是否已登录
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ 请先登录 GCP: gcloud auth login"
    exit 1
fi

# 测试 beta 命令
echo "📋 测试 gcloud beta run domain-mappings 命令..."
if gcloud beta run domain-mappings --help &> /dev/null; then
    echo "✅ gcloud beta run domain-mappings 命令可用"
else
    echo "❌ gcloud beta run domain-mappings 命令不可用"
    echo "请确保您使用的是最新版本的 gcloud CLI"
    exit 1
fi

# 显示当前 gcloud 版本
echo "📊 当前 gcloud 版本："
gcloud version

echo ""
echo "✅ gcloud beta 命令测试通过！"
