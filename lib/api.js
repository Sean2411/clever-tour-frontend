// API配置文件
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.clever-tour.com';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
};

// 创建API请求函数
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${apiConfig.baseURL}${endpoint}`;
  const config = {
    ...apiConfig,
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    }
  };

  // 添加认证token
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 导出常用的API方法
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE'
  })
}; 