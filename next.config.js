/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    // 在 CI/CD 环境中忽略 ESLint 错误
    ignoreDuringBuilds: false,
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://mongo:27017/smart-tourist',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.clever-tour.com'
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:5001'],
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.clever-tour.com/api/:path*',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, './'),
    };
    return config;
  },
  // 确保Docker构建时正确处理静态文件
  trailingSlash: false,
  generateEtags: false,
};

module.exports = nextConfig; 