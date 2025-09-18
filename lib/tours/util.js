// 旅游相关的工具函数

// 获取API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.clever-tour.com';
console.log('🔧 API_BASE_URL:', API_BASE_URL);

/**
 * 获取旅游详情
 * @param {string} tourId - 旅游ID
 * @returns {Promise<Object>} 旅游详情数据
 */
export const fetchTourDetails = async (tourId) => {
  try {
    const url = `${API_BASE_URL}/api/tours/${tourId}`;
    console.log('🔗 Fetching tour details from:', url);
    
    const response = await fetch(url);

    // 处理 304 Not Modified 状态码
    if (response.status === 304) {
      console.log('📋 Tour data not modified, using cached version');
      // 对于 304 响应，我们可以返回一个指示，让前端使用缓存的数据
      return { success: true, data: null, notModified: true };
    }

    // 检查响应是否成功
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return { success: false, error: errorData.message || 'Failed to fetch tour details' };
    }

    // 解析响应数据
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error fetching tour details:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * 计算总价格
 * @param {Object} tour - 旅游信息
 * @param {Object} formData - 表单数据
 * @returns {string} 计算后的总价格
 */
export const calculateTotalPrice = (tour, formData) => {
  if (!tour) return '0.00';
  
  const totalPersons = formData.adults + formData.children;
  const costMethod = tour.costMethod || 'ByNumberOfPersons';
  
  if (costMethod === 'ByNumberOfPersons') {
    // 按人数计算：总价 = (大人数 + 小孩数) x 单价
    return (totalPersons * tour.price).toFixed(2);
  } else if (costMethod === 'Mayi') {
    return calculateMayiPrice(totalPersons, formData.rooms, tour.price, tour.singlePrice);
  }
  
  // 默认按人数计算
  return (totalPersons * tour.price).toFixed(2);
};

/**
 * Mayi 特殊定价逻辑
 * @param {number} totalPersons - 总人数
 * @param {number} rooms - 房间数
 * @param {number} basePrice - 基础价格
 * @param {number} singlePrice - 单人价格
 * @returns {string} 计算后的价格
 */
export const calculateMayiPrice = (totalPersons, rooms, basePrice, singlePrice) => {
  // Mayi 特殊定价逻辑
  if (totalPersons === rooms) {
    // 1人：总价 = 单人价
    return (singlePrice * totalPersons).toFixed(2);
  } else if (totalPersons === 2) {
    if (rooms === 1) {
      // 2人1房：总价 = 单价 x 2
      return (basePrice * 2).toFixed(2);
    } else if (rooms === 2) {
      // 2人2房：总价 = 单人价 x 2
      return (singlePrice * 2).toFixed(2);
    }
  } else if (totalPersons >= 3 && totalPersons <= 4) {
    // 3-4人：总价 = 单价 x 2（2人付费，其余免费）
    return (basePrice * 2).toFixed(2);
  } else if (totalPersons === 5) {
    if (rooms === 2) {
      // 5人2房：取较小值
      const option1 = basePrice * 2 + singlePrice; // 单价 x 2 + 单人价 x 1
      const option2 = basePrice * 2 * 2; // 单价 x 2 x 2
      return Math.min(option1, option2).toFixed(2);
    }
  } else if (totalPersons >= 6) {
    // 6人及以上：按房间数计算
    return calculateMayiPriceForLargeGroups(totalPersons, rooms, basePrice, singlePrice);
  }
  
  // 默认情况
  return (basePrice * totalPersons).toFixed(2);
};

/**
 * 处理6人及以上的Mayi定价
 * @param {number} totalPersons - 总人数
 * @param {number} rooms - 房间数
 * @param {number} basePrice - 基础价格
 * @param {number} singlePrice - 单人价格
 * @returns {string} 计算后的价格
 */
export const calculateMayiPriceForLargeGroups = (totalPersons, rooms, basePrice, singlePrice) => {
  // 处理6人及以上的情况
  const personsPerRoom = Math.ceil(totalPersons / rooms);
  
  if (personsPerRoom <= 4) {
    // 如果每个房间不超过4人，按房间数计算
    if (rooms === 1) {
      // 1个房间：总价 = 单价 x 2
      return (basePrice * 2).toFixed(2);
    } else {
      // 多个房间：每个房间最多2人付费
      return (basePrice * 2 * rooms).toFixed(2);
    }
  } else {
    // 如果某个房间超过4人，需要额外计算
    const extraPersons = totalPersons - (rooms * 4);
    const baseCost = basePrice * 2 * rooms; // 基础费用：每个房间2人付费
    const extraCost = extraPersons * singlePrice; // 额外人员按单人价计算
    return (baseCost + extraCost).toFixed(2);
  }
};

/**
 * 创建预订
 * @param {string} tourId - 旅游ID
 * @param {Object} formData - 表单数据
 * @param {string} totalPrice - 总价格
 * @returns {Promise<Object>} 预订结果
 */
export const createBooking = async (tourId, formData, totalPrice) => {
  try {
    const url = `${API_BASE_URL}/api/bookings`;
    
    // 获取当前用户信息
    const userData = localStorage.getItem('user');
    let userId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.id;
        console.log('👤 Current user ID:', userId);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
      }
    }
    
    const bookingData = {
      tourId,
      ...formData,
      totalPrice
    };
    
    // 添加用户ID字段（尝试不同的字段名称）
    if (userId) {
      bookingData.user_id = userId;
      bookingData.userId = userId;
      bookingData.customerId = userId;
    }
    
    console.log('📝 Creating booking at:', url);
    console.log('📊 Booking data:', bookingData);
    
    // 获取认证 token
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // 添加 Authorization header 如果 token 存在
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 Using JWT token for authentication');
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData),
    });

    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    console.log('📋 Response data:', data);

    if (response.ok) {
      return { success: true, data };
    } else {
      // 提供更友好的错误信息
      let errorMessage = data.message || 'Failed to create booking.';
      if (data.message && data.message.includes('Missing required fields')) {
        errorMessage = 'Please check that all required fields are filled correctly. If the problem persists, please contact support.';
      }
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    return { success: false, error: 'Network Error. Please check your connection and try again.' };
  }
};

/**
 * 处理表单输入变化
 * @param {Event} e - 事件对象
 * @param {Function} setFormData - 设置表单数据的函数
 */
export const handleInputChange = (e, setFormData) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

/**
 * 处理数字输入变化
 * @param {string} name - 字段名
 * @param {number} value - 新值
 * @param {Function} setFormData - 设置表单数据的函数
 */
export const handleNumberChange = (name, value, setFormData) => {
  setFormData(prev => ({
    ...prev,
    [name]: parseInt(value) || 0
  }));
};

/**
 * 重置表单数据到默认值
 * @returns {Object} 默认表单数据
 */
export const getDefaultFormData = () => ({
  name: '',
  email: '',
  phone: '',
  date: '',
  adults: 1,
  children: 0,
  rooms: 1,
  specialRequests: ''
});

/**
 * 格式化价格显示
 * @param {number} price - 价格
 * @returns {string} 格式化后的价格
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

/**
 * 获取价格计算方法描述
 * @param {string} costMethod - 价格计算方法
 * @returns {string} 方法描述
 */
export const getCostMethodDescription = (costMethod) => {
  switch (costMethod) {
    case 'ByNumberOfPersons':
      return '按人数计算：每人支付相同价格';
    case 'Mayi':
      return 'Mayi特殊定价：根据人数和房间数计算';
    default:
      return '按人数计算';
  }
}; 