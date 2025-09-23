import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ImageGallery } from '../../components/ResponsiveImage';

const AttractionDetail = () => {
  const router = useRouter();
  const { attractionId } = router.query;
  const [attraction, setAttraction] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attractionId) {
      fetchAttractionData();
    }
  }, [attractionId]);

  const fetchAttractionData = async () => {
    try {
      setLoading(true);
      
      // 获取景点基本信息
      const attractionResponse = await fetch(`/api/attractions/${attractionId}`);
      const attractionData = await attractionResponse.json();
      
      if (attractionData.success) {
        setAttraction(attractionData.data);
        
        // 获取关联图片
        const imagesResponse = await fetch(`/api/upload/entity/attraction/${attractionId}`);
        const imagesData = await imagesResponse.json();
        
        if (imagesData.success) {
          setImages(imagesData.data.images);
        }
      } else {
        console.error('获取景点失败:', attractionData.message);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div>加载中...</div>
        </div>
      </Layout>
    );
  }

  if (!attraction) {
    return (
      <Layout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div>景点不存在</div>
        </div>
      </Layout>
    );
  }

  // 获取主图
  const primaryImage = images.find(img => img.isPrimary);

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* 主图展示 */}
        {primaryImage && (
          <div style={{ marginBottom: '30px' }}>
            <img
              src={primaryImage.original.url}
              alt={attraction.name}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>
        )}

        {/* 基本信息 */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ marginBottom: '10px' }}>{attraction.name}</h1>
          <div style={{ color: '#666', marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>⭐ {attraction.rating} ({attraction.reviewCount} 评价)</span>
            <span style={{ marginRight: '20px' }}>⏱️ {attraction.duration}</span>
            <span style={{ marginRight: '20px' }}>💰 ¥{attraction.price}</span>
            <span>📍 {attraction.location}</span>
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{attraction.description}</p>
        </div>

        {/* 图片画廊 */}
        {images.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2>图片展示</h2>
            <ImageGallery
              images={images.map((image, index) => ({
                ...image,
                alt: `${attraction.name} 图片 ${index + 1}`
              }))}
              columns={3}
              gap="15px"
            />
          </div>
        )}

        {/* 特色亮点 */}
        {attraction.features && attraction.features.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2>特色亮点</h2>
            <ul style={{ paddingLeft: '20px' }}>
              {attraction.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>✨ {feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 标签 */}
        {attraction.tags && attraction.tags.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2>标签</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {attraction.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '5px 12px',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 预订按钮 */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => router.push(`/attractions/${attractionId}/book`)}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            立即预订
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AttractionDetail;
