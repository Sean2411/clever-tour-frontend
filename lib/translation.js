// 翻译工具函数

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// 翻译单个文本
export const translateText = async (text, targetLanguage = 'en') => {
  try {
    const response = await fetch(`${API_URL}/api/translate/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage
      })
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.translatedText;
    } else {
      console.error('Translation failed:', data.message);
      return text; // 翻译失败时返回原文
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // 网络错误时返回原文
  }
};

// 翻译对象
export const translateObject = async (obj, targetLanguage = 'en', textFields) => {
  try {
    const response = await fetch(`${API_URL}/api/translate/translate-object`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        object: obj,
        targetLanguage,
        textFields
      })
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.translatedObject;
    } else {
      console.error('Object translation failed:', data.message);
      return obj; // 翻译失败时返回原对象
    }
  } catch (error) {
    console.error('Object translation error:', error);
    return obj; // 网络错误时返回原对象
  }
};

// 批量翻译
export const translateBatch = async (texts, targetLanguage = 'en') => {
  try {
    const response = await fetch(`${API_URL}/api/translate/translate-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        targetLanguage
      })
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.translations.map(t => t.translatedText);
    } else {
      console.error('Batch translation failed:', data.message);
      return texts; // 翻译失败时返回原文数组
    }
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts; // 网络错误时返回原文数组
  }
};

// 检测语言
export const detectLanguage = async (text) => {
  try {
    const response = await fetch(`${API_URL}/api/translate/detect-language`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text
      })
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.detectedLanguage;
    } else {
      console.error('Language detection failed:', data.message);
      return 'en'; // 检测失败时默认返回英文
    }
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // 网络错误时默认返回英文
  }
};

// Tour数据翻译字段
export const TOUR_TRANSLATION_FIELDS = [
  'name',
  'description',
  'category',
  'duration',
  'departureCity',
  'highlights',
  'includes',
  'excludes',
  'tags',
  'features'
];

// Attraction数据翻译字段
export const ATTRACTION_TRANSLATION_FIELDS = [
  'name',
  'description',
  'category',
  'location',
  'highlights',
  'features',
  'tags'
];

// 翻译Tour数据
export const translateTour = async (tour, targetLanguage = 'en') => {
  return await translateObject(tour, targetLanguage, TOUR_TRANSLATION_FIELDS);
};

// 翻译Attraction数据
export const translateAttraction = async (attraction, targetLanguage = 'en') => {
  return await translateObject(attraction, targetLanguage, ATTRACTION_TRANSLATION_FIELDS);
};

// 翻译Tour数组
export const translateTours = async (tours, targetLanguage = 'en') => {
  return await Promise.all(
    tours.map(tour => translateTour(tour, targetLanguage))
  );
};

// 翻译Attraction数组
export const translateAttractions = async (attractions, targetLanguage = 'en') => {
  return await Promise.all(
    attractions.map(attraction => translateAttraction(attraction, targetLanguage))
  );
};
