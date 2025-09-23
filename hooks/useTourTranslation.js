import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// 简化的翻译hook - 现在后端已经处理了翻译
export const useTourTranslation = (tours) => {
  const { i18n } = useTranslation();
  const [translatedTours, setTranslatedTours] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentLanguage = i18n.language;

  // 现在后端API已经返回翻译后的数据，我们只需要直接使用
  useEffect(() => {
    if (tours && tours.length > 0) {
      console.log('Using tours data directly from backend:', tours.length, 'tours, language:', currentLanguage);
      setTranslatedTours(tours);
    }
  }, [tours, currentLanguage]);

  // 使用useMemo来避免不必要的重新计算
  const memoizedTours = useMemo(() => {
    return translatedTours;
  }, [translatedTours]);

  return {
    translatedTours: memoizedTours,
    loading,
    translateTour: async (tour) => tour // 简化，直接返回原tour
  };
};