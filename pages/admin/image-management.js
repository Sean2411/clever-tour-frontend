import React, { useState, useEffect } from 'react';
import EntityImageUploader from '../../components/EntityImageUploader';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const ImageManagement = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('tour');
  const [uploadHistory, setUploadHistory] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityImages, setEntityImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('upload'); // 'upload' or 'manage'

  const handleUpload = (uploadedImages) => {
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      entityType: selectedTab,
      images: Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages],
      count: Array.isArray(uploadedImages) ? uploadedImages.length : 1
    };
    
    setUploadHistory(prev => [historyItem, ...prev]);
    
    // 显示成功消息
    alert(t('admin.imageManagement.uploadSuccess', { 
      count: historyItem.count, 
      type: selectedTab === 'tour' ? t('admin.imageManagement.tour') : t('admin.imageManagement.attraction')
    }));
  };

  const handleError = (error) => {
    console.error('上传错误:', error);
    alert(t('admin.imageManagement.uploadFailed', { error }));
  };

  const getEntityTypeLabel = (type) => {
    return type === 'tour' ? t('admin.imageManagement.tour') : t('admin.imageManagement.attraction');
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US');
  };

  // 获取实体的图片
  const fetchEntityImages = async (entityType, entityId) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/upload/entity/${entityType}/${entityId}`);
      const data = await response.json();
      
      if (data.success) {
        // 过滤出上传的图片对象（排除字符串URL）
        const uploadedImages = data.data.images.filter(img => typeof img === 'object' && img.fileName);
        setEntityImages(uploadedImages);
      } else {
        setEntityImages([]);
      }
    } catch (error) {
      console.error('获取图片失败:', error);
      setEntityImages([]);
    } finally {
      setLoading(false);
    }
  };

  // 删除图片
  const deleteImage = async (entityType, entityId, fileName) => {
    if (!confirm(t('admin.imageManagement.confirmDelete'))) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/upload/delete/${entityType}/${entityId}/${fileName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(t('admin.imageManagement.deleteSuccess'));
        // 刷新图片列表
        fetchEntityImages(entityType, entityId);
      } else {
        alert(t('admin.imageManagement.deleteFailed', { message: data.message }));
      }
    } catch (error) {
      console.error('删除图片失败:', error);
      alert(t('admin.imageManagement.deleteFailed', { message: error.message }));
    }
  };

  // 设置主图
  const setPrimaryImage = async (entityType, entityId, fileName) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/upload/set-primary/${entityType}/${entityId}/${fileName}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(t('admin.imageManagement.setPrimarySuccess'));
        // 刷新图片列表
        fetchEntityImages(entityType, entityId);
      } else {
        alert(t('admin.imageManagement.setPrimaryFailed', { message: data.message }));
      }
    } catch (error) {
      console.error('设置主图失败:', error);
      alert(t('admin.imageManagement.setPrimaryFailed', { message: error.message }));
    }
  };

  // 当选择实体时获取图片
  useEffect(() => {
    if (selectedEntity) {
      fetchEntityImages(selectedTab, selectedEntity.id);
    }
  }, [selectedEntity, selectedTab]);

  return (
    <Layout>
      <Head>
        <title>{t('admin.imageManagement.title')} - 智旅</title>
        <meta name="description" content={t('admin.imageManagement.description')} />
      </Head>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>{t('admin.imageManagement.title')}</h1>
        
        {/* 功能切换标签 */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveSection('upload')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: activeSection === 'upload' ? '#007bff' : 'transparent',
                color: activeSection === 'upload' ? 'white' : '#333',
                cursor: 'pointer',
                borderBottom: activeSection === 'upload' ? '2px solid #007bff' : '2px solid transparent',
                marginRight: '10px'
              }}
            >
              {t('admin.imageManagement.uploadImages')}
            </button>
            <button
              onClick={() => setActiveSection('manage')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: activeSection === 'manage' ? '#007bff' : 'transparent',
                color: activeSection === 'manage' ? 'white' : '#333',
                cursor: 'pointer',
                borderBottom: activeSection === 'manage' ? '2px solid #007bff' : '2px solid transparent'
              }}
            >
              {t('admin.imageManagement.manageImages')}
            </button>
          </div>
        </div>

        {/* 类型选择标签 */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
            <button
              onClick={() => setSelectedTab('tour')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: selectedTab === 'tour' ? '#28a745' : 'transparent',
                color: selectedTab === 'tour' ? 'white' : '#333',
                cursor: 'pointer',
                borderBottom: selectedTab === 'tour' ? '2px solid #28a745' : '2px solid transparent'
              }}
            >
              {t('admin.imageManagement.tourImages')}
            </button>
            <button
              onClick={() => setSelectedTab('attraction')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: selectedTab === 'attraction' ? '#28a745' : 'transparent',
                color: selectedTab === 'attraction' ? 'white' : '#333',
                cursor: 'pointer',
                borderBottom: selectedTab === 'attraction' ? '2px solid #28a745' : '2px solid transparent'
              }}
            >
              {t('admin.imageManagement.attractionImages')}
            </button>
          </div>
        </div>

        {/* 根据activeSection显示不同内容 */}
        {activeSection === 'upload' ? (
          /* 图片上传组件 */
          <div style={{ marginBottom: '40px' }}>
            <h2>{t('admin.imageManagement.uploadTitle', { type: getEntityTypeLabel(selectedTab) })}</h2>
            <EntityImageUploader
              entityType={selectedTab}
              onUpload={handleUpload}
              onError={handleError}
              showEntitySelector={true}
            />
          </div>
        ) : (
          /* 图片管理组件 */
          <div style={{ marginBottom: '40px' }}>
            <h2>{t('admin.imageManagement.manageTitle', { type: getEntityTypeLabel(selectedTab) })}</h2>
            
            {/* 实体选择器 */}
            <div style={{ marginBottom: '20px' }}>
              <EntityImageUploader
                entityType={selectedTab}
                onEntitySelect={setSelectedEntity}
                showEntitySelector={true}
                showUploadArea={false}
              />
            </div>

            {/* 图片管理区域 */}
            {selectedEntity && (
              <div>
                <div style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  marginBottom: '20px'
                }}>
                  <h3>{t('admin.imageManagement.selected')}: {selectedEntity.name}</h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    {t('admin.imageManagement.id')}: {selectedEntity.id} | {t('admin.imageManagement.type')}: {getEntityTypeLabel(selectedTab)}
                  </p>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div>{t('admin.imageManagement.loadingImages')}</div>
                  </div>
                ) : entityImages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <div>{t('admin.imageManagement.noImagesFound', { type: selectedTab === 'tour' ? t('admin.imageManagement.tour') : t('admin.imageManagement.attraction') })}</div>
                  </div>
                ) : (
                  <div>
                    <h4>{t('admin.imageManagement.images')} ({entityImages.length})</h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '20px',
                      marginTop: '20px'
                    }}>
                      {entityImages.map((image, index) => (
                        <div key={index} style={{
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {/* 图片 */}
                          <div style={{ position: 'relative' }}>
                            <img
                              src={image.thumbnails.find(t => t.size === 'medium')?.url || image.original.url}
                              alt={`Image ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover'
                              }}
                            />
                            {image.isPrimary && (
                              <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>
                                Primary
                              </div>
                            )}
                          </div>

                          {/* 图片信息 */}
                          <div style={{ padding: '15px' }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                              {image.fileName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                              {t('admin.imageManagement.uploaded')}: {new Date(image.metadata.uploadedAt).toLocaleDateString()}
                            </div>

                            {/* 操作按钮 */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {!image.isPrimary && (
                                <button
                                  onClick={() => setPrimaryImage(selectedTab, selectedEntity.id, image.fileName)}
                                  style={{
                                    flex: 1,
                                    padding: '6px 12px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  {t('admin.imageManagement.setPrimary')}
                                </button>
                              )}
                              <button
                                onClick={() => deleteImage(selectedTab, selectedEntity.id, image.fileName)}
                                style={{
                                  flex: 1,
                                  padding: '6px 12px',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                {t('admin.imageManagement.delete')}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <div>
            <h2>{t('admin.imageManagement.uploadHistory')}</h2>
            <div style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              {uploadHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '15px',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{getEntityTypeLabel(item.entityType)} {t('admin.imageManagement.imageUpload')}</strong>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        {formatTimestamp(item.timestamp)} | {t('admin.imageManagement.uploadedCount', { count: item.count })}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {t('admin.imageManagement.id')}: {item.id}
                    </div>
                  </div>
                  
                  {/* Display uploaded images */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                    gap: '10px',
                    marginTop: '10px'
                  }}>
                    {item.images.map((image, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={image.thumbnails.find(t => t.size === 'thumbnail')?.url || image.original.url}
                          alt={`Uploaded image ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: image.isPrimary ? '2px solid #007bff' : '1px solid #ddd'
                          }}
                        />
                        {image.isPrimary && (
                          <div style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '1px 4px',
                            borderRadius: '2px',
                            fontSize: '8px'
                          }}>
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>{t('admin.imageManagement.usageInstructions')}</h3>
          <ol style={{ paddingLeft: '20px' }}>
            <li>{t('admin.imageManagement.instruction1')}</li>
            <li>{t('admin.imageManagement.instruction2')}</li>
            <li>{t('admin.imageManagement.instruction3', { type: getEntityTypeLabel(selectedTab).toLowerCase() })}</li>
            <li>{t('admin.imageManagement.instruction4')}</li>
            <li>{t('admin.imageManagement.instruction5')}</li>
            <li>{t('admin.imageManagement.instruction6')}</li>
          </ol>
          
          <h4>{t('admin.imageManagement.supportedFormats')}:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            <li>JPEG (.jpg, .jpeg)</li>
            <li>PNG (.png)</li>
            <li>WebP (.webp)</li>
          </ul>
          
          <h4>{t('admin.imageManagement.sizeLimits')}:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            <li>{t('admin.imageManagement.maxSize')}</li>
            <li>{t('admin.imageManagement.autoGenerate')}:</li>
            <ul style={{ paddingLeft: '20px' }}>
              <li>{t('admin.imageManagement.thumbnail')}: 300x200 pixels</li>
              <li>{t('admin.imageManagement.medium')}: 800x600 pixels</li>
              <li>{t('admin.imageManagement.large')}: 1920x1080 pixels</li>
              <li>{t('admin.imageManagement.original')}: {t('admin.imageManagement.keepOriginal')}</li>
            </ul>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ImageManagement;