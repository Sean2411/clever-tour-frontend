# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 设置生产环境变量
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS runner

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 从构建阶段复制必要文件
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 设置权限
RUN chown -R nextjs:nodejs /app

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_API_URL=http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com

# 创建启动脚本
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "Starting Next.js application..."' >> /app/start.sh && \
    echo 'echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"' >> /app/start.sh && \
    echo 'exec node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# 启动应用
CMD ["/app/start.sh"] 