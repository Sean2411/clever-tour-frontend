import { useState, useEffect, useCallback } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { 
  translateText, 
  translateObject, 
  translateBatch,
  detectLanguage,
  translateTour,
  translateAttraction,
  translateTours,
  translateAttractions
} from '../lib/translation';

// 自定义翻译Hook，结合i18next和自动翻译
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  const [isTranslating, setIsTranslating] = useState(false);

  // 获取当前语言
  const currentLanguage = i18n.language;

  // 翻译文本（自动检测源语言）
  const translate = useCallback(async (text, targetLanguage = currentLanguage) => {
    if (!text || typeof text !== 'string') return text;
    
    setIsTranslating(true);
    try {
      const result = await translateText(text, targetLanguage);
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  // 翻译对象
  const translateObj = useCallback(async (obj, targetLanguage = currentLanguage, textFields) => {
    if (!obj) return obj;
    
    setIsTranslating(true);
    try {
      const result = await translateObject(obj, targetLanguage, textFields);
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  // 批量翻译
  const translateBatchTexts = useCallback(async (texts, targetLanguage = currentLanguage) => {
    if (!texts || !Array.isArray(texts)) return texts;
    
    setIsTranslating(true);
    try {
      const result = await translateBatch(texts, targetLanguage);
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  // 检测语言
  const detectLang = useCallback(async (text) => {
    if (!text) return 'en';
    
    try {
      const result = await detectLanguage(text);
      return result;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }, []);

  // 翻译Tour
  const translateTourData = useCallback(async (tour, targetLanguage = currentLanguage) => {
    if (!tour) return tour;
    
    setIsTranslating(true);
    try {
      const result = await translateTour(tour, targetLanguage);
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  // 翻译Attraction
  const translateAttractionData = useCallback(async (attraction, targetLanguage = currentLanguage) => {
    if (!attraction) return attraction;
    
    setIsTranslating(true);
    try {
      const result = await translateAttraction(attraction, targetLanguage);
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  // 翻译Tour数组
  const translateToursData = useCallback(async (tours, targetLanguage = currentLanguage) => {
    if (!tours || !Array.isArray(tours)) return tours;
    
    setIsTranslating(true);
    try {
      const result = await translateTours(tours, targetLanguage);
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  // 翻译Attraction数组
  const translateAttractionsData = useCallback(async (attractions, targetLanguage = currentLanguage) => {
    if (!attractions || !Array.isArray(attractions)) return attractions;
    
    setIsTranslating(true);
    try {
      const result = await translateAttractions(attractions, targetLanguage);
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  return {
    // i18next功能
    t,
    i18n,
    currentLanguage,
    
    // 自动翻译功能
    translate,
    translateObj,
    translateBatchTexts,
    detectLang,
    translateTourData,
    translateAttractionData,
    translateToursData,
    translateAttractionsData,
    
    // 状态
    isTranslating
  };
};
