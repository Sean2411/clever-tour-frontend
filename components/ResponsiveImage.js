import React, { useState, useEffect, useRef } from 'react';

const ResponsiveImage = ({ 
  src, 
  alt, 
  className = '',
  lazy = true,
  placeholder = true,
  sizes = ['thumbnail', 'medium', 'large'],
  fallback = '/images/placeholder.jpg'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(!lazy);
  const [currentSrc, setCurrentSrc] = useState('');
  const [error, setError] = useState(false);
  const imgRef = useRef();
  const observerRef = useRef();

  // 根据屏幕尺寸选择合适的图片尺寸
  const getOptimalSize = () => {
    if (typeof window === 'undefined') return 'medium';
    
    const width = window.innerWidth;
    if (width < 768) return 'thumbnail';
    if (width < 1200) return 'medium';
    return 'large';
  };

  // 构建图片URL
  const buildImageUrl = (size) => {
    if (!src) return fallback;
    
    // 如果已经是完整URL，直接返回
    if (src.startsWith('http')) return src;
    
    // 构建不同尺寸的URL
    const baseUrl = src.replace(/\/original\//, `/${size}/`);
    return baseUrl;
  };

  // 更新当前显示的图片
  const updateImageSrc = () => {
    const optimalSize = getOptimalSize();
    const newSrc = buildImageUrl(optimalSize);
    setCurrentSrc(newSrc);
  };

  // 懒加载观察器
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observerRef.current?.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy]);

  // 监听窗口大小变化
  useEffect(() => {
    if (!inView) return;

    updateImageSrc();

    const handleResize = () => {
      updateImageSrc();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [inView, src]);

  // 图片加载完成
  const handleLoad = () => {
    setLoaded(true);
    setError(false);
  };

  // 图片加载失败
  const handleError = () => {
    setError(true);
    setLoaded(false);
  };

  // 预加载下一尺寸的图片
  const preloadNextSize = () => {
    const currentSize = getOptimalSize();
    const sizeIndex = sizes.indexOf(currentSize);
    
    if (sizeIndex < sizes.length - 1) {
      const nextSize = sizes[sizeIndex + 1];
      const nextSrc = buildImageUrl(nextSize);
      
      const img = new Image();
      img.src = nextSrc;
    }
  };

  // 当图片加载完成后预加载下一尺寸
  useEffect(() => {
    if (loaded) {
      preloadNextSize();
    }
  }, [loaded]);

  return (
    <div 
      ref={imgRef}
      className={`responsive-image-container ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* 占位符 */}
      {placeholder && !loaded && !error && (
        <div 
          className="image-placeholder"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px'
          }}
        >
          {inView ? '加载中...' : ''}
        </div>
      )}

      {/* 实际图片 */}
      {inView && (
        <img
          src={error ? fallback : currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            display: error ? 'none' : 'block'
          }}
        />
      )}

      {/* 错误状态 */}
      {error && (
        <div 
          className="image-error"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d',
            fontSize: '14px'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
          <div>图片加载失败</div>
        </div>
      )}

      {/* 加载指示器 */}
      {inView && !loaded && !error && (
        <div 
          className="loading-indicator"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#007bff',
            fontSize: '12px'
          }}
        >
          <div className="spinner" style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 5px'
          }} />
          加载中...
        </div>
      )}

      {/* CSS 动画 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// 图片画廊组件
export const ImageGallery = ({ 
  images, 
  className = '',
  columns = 3,
  gap = '10px'
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div 
        className={`image-gallery ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gap
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => openModal(image)}
            style={{
              cursor: 'pointer',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ResponsiveImage
              src={image.original?.url || image.url}
              alt={image.alt || `图片 ${index + 1}`}
              sizes={['thumbnail', 'medium']}
              className="gallery-image"
            />
          </div>
        ))}
      </div>

      {/* 模态框 */}
      {selectedImage && (
        <div 
          className="image-modal"
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              position: 'relative'
            }}
          >
            <ResponsiveImage
              src={selectedImage.original?.url || selectedImage.url}
              alt={selectedImage.alt || '大图预览'}
              sizes={['large', 'original']}
              className="modal-image"
            />
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ResponsiveImage;