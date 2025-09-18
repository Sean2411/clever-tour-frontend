#!/bin/bash

# 本地开发启动脚本
# 这个脚本会加载本地开发配置文件并启动前端

echo "🚀 启动本地开发环境..."

# 检查是否存在本地开发配置文件
if [ ! -f "env.local.dev" ]; then
    echo "❌ 未找到 env.local.dev 文件"
    echo "请先创建 env.local.dev 文件并配置你的Stripe密钥"
    echo ""
    echo "示例配置："
    echo "NEXT_PUBLIC_API_URL=http://localhost:5001"
    # echo "NEXT_PUBLIC_API_URL=https://api-dev.clever-tour.com"
    echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_你的Stripe测试公钥"
    exit 1
fi

# 复制本地开发配置到 .env.local
cp env.local.dev .env.local

echo "✅ 已加载本地开发配置"
echo "🔧 启动前端开发服务器..."

# 询问用户是否使用HTTPS
echo ""
echo "选择启动方式："
echo "1) HTTP (http://localhost:3000) - 快速启动"
echo "2) HTTPS (https://localhost:3000) - 支持Stripe自动填充"
echo ""
read -p "请选择 (1 或 2): " choice

case $choice in
    1)
        echo "🚀 使用HTTP启动..."
        npm run dev
        ;;
    2)
        echo "🔒 使用HTTPS启动..."
        npm run dev:https
        ;;
    *)
        echo "❌ 无效选择，使用默认HTTP启动..."
        npm run dev
        ;;
esac
