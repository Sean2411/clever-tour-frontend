#!/bin/bash

# 设置开发环境自定义域名脚本
# 用于将 dev.clever-tour.com 映射到 Cloud Run 服务

set -e

# 配置变量
PROJECT_ID=${GCP_PROJECT_ID:-"clever-tour-frontend"}
REGION="us-central1"
SERVICE_NAME="clever-tour-frontend-dev"
DOMAIN="dev.clever-tour.com"

# 检查项目ID是否已设置
if [ "$PROJECT_ID" = "your-project-id" ]; then
    echo "❌ 请设置正确的 GCP 项目ID："
    echo "   export GCP_PROJECT_ID=\"your-actual-project-id\""
    echo "   或者运行: GCP_PROJECT_ID=\"your-actual-project-id\" ./scripts/setup-dev-domain.sh"
    exit 1
fi

echo "🚀 设置开发环境自定义域名..."
echo "项目ID: $PROJECT_ID"
echo "区域: $REGION"
echo "服务名: $SERVICE_NAME"
echo "域名: $DOMAIN"
echo ""

# 检查是否已登录 GCP
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ 请先登录 GCP: gcloud auth login"
    exit 1
fi

# 设置项目
echo "📋 设置 GCP 项目..."
gcloud config set project $PROJECT_ID

# 检查服务是否存在
echo "🔍 检查 Cloud Run 服务..."
if ! gcloud run services describe $SERVICE_NAME --region=$REGION --quiet 2>/dev/null; then
    echo "❌ 服务 $SERVICE_NAME 不存在，请先部署服务"
    exit 1
fi

# 检查域名映射是否已存在
echo "🔍 检查域名映射..."
if gcloud beta run domain-mappings describe $DOMAIN --region=$REGION --quiet 2>/dev/null; then
    echo "📝 域名映射已存在，正在更新..."
    gcloud beta run domain-mappings update $DOMAIN \
        --service $SERVICE_NAME \
        --region $REGION
else
    echo "🆕 创建新的域名映射..."
    gcloud beta run domain-mappings create \
        --service $SERVICE_NAME \
        --domain $DOMAIN \
        --region $REGION
fi

echo ""
echo "✅ 域名映射设置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 在您的域名注册商处添加以下 DNS 记录："
echo "   - 类型: CNAME"
echo "   - 名称: dev"
echo "   - 值: ghs.googlehosted.com"
echo ""
echo "2. 等待 DNS 传播（通常需要几分钟到几小时）"
echo ""
echo "3. 验证域名映射状态："
echo "   gcloud run domain-mappings describe $DOMAIN --region=$REGION"
echo ""
echo "4. 访问您的应用："
echo "   https://$DOMAIN"
echo ""

# 显示当前域名映射状态
echo "📊 当前域名映射状态："
gcloud beta run domain-mappings describe $DOMAIN --region=$REGION
