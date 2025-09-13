module.exports = {
  extends: ['next/core-web-vitals'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/no-unescaped-entities': 'error',
    'react-hooks/exhaustive-deps': 'off', // 禁用这个规则，因为很多情况下添加依赖会导致无限循环
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/',
    '*.config.js',
    '.env*',
    'keys/',
  ],
};
