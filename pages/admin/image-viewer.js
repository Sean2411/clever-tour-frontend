import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { ImageGallery } from '../../components/ResponsiveImage';

const ImageViewer = () => {
  const [selectedTab, setSelectedTab] = useState('tour');
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityImages, setEntityImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 获取实体列表
  const fetchEntities = async (search = '') => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/upload/entities/${selectedTab}?page=1&limit=50&search=${encodeURIComponent(search)}`
      );
      const result = await response.json();
      
      if (result.success) {
        setEntities(result.data.entities);
      } else {
        console.error('获取实体列表失败:', result.message);
      }
    } catch (error) {
      console.error('获取实体列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取实体的图片
  const fetchEntityImages = async (entityId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/upload/entity/${selectedTab}/${entityId}`);
      const result = await response.json();
      
      if (result.success) {
        setEntityImages(result.data.images);
        setSelectedEntity(result.data.entity);
      } else {
        console.error('获取图片失败:', result.message);
        setEntityImages([]);
      }
    } catch (error) {
      console.error('获取图片失败:', error);
      setEntityImages([]);
    } finally {
      setLoading(false);
    }
  };

  // 设置主图
  const setPrimaryImage = async (fileName) => {
    try {
      const response = await fetch(
        `/api/upload/set-primary/${selectedTab}/${selectedEntity.id}/${fileName}`,
        { method: 'PUT' }
      );
      const result = await response.json();
      
      if (result.success) {
        // 重新获取图片列表
        await fetchEntityImages(selectedEntity.id);
        alert('主图设置成功！');
      } else {
        alert('设置主图失败: ' + result.message);
      }
    } catch (error) {
      console.error('设置主图失败:', error);
      alert('设置主图失败');
    }
  };

  // 删除图片
  const deleteImage = async (fileName) => {
    if (!confirm('确定要删除这张图片吗？')) return;
    
    try {
      const response = await fetch(
        `/api/upload/delete/${selectedTab}/${selectedEntity.id}/${fileName}`,
        { method: 'DELETE' }
      );
      const result = await response.json();
      
      if (result.success) {
        // 重新获取图片列表
        await fetchEntityImages(selectedEntity.id);
        alert('图片删除成功！');
      } else {
        alert('删除图片失败: ' + result.message);
      }
    } catch (error) {
      console.error('删除图片失败:', error);
      alert('删除图片失败');
    }
  };

  // 初始加载
  useEffect(() => {
    fetchEntities();
  }, [selectedTab]);

  // 搜索
  const handleSearch = (search) => {
    setSearchTerm(search);
    fetchEntities(search);
  };

  const getEntityTypeLabel = (type) => {
    return type === 'tour' ? '旅游路线' : '景点';
  };

  return (
    <Layout>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>图片查看器</h1>
        
        {/* 标签页 */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
            <button
              onClick={() => setSelectedTab('tour')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: selectedTab === 'tour' ? '#007bff' : 'transparent',
                color: selectedTab === 'tour' ? 'white' : '#333',
                cursor: 'pointer',
                borderBottom: selectedTab === 'tour' ? '2px solid #007bff' : '2px solid transparent'
              }}
            >
              旅游路线图片
            </button>
            <button
              onClick={() => setSelectedTab('attraction')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: selectedTab === 'attraction' ? '#007bff' : 'transparent',
                color: selectedTab === 'attraction' ? 'white' : '#333',
                cursor: 'pointer',
                borderBottom: selectedTab === 'attraction' ? '2px solid #007bff' : '2px solid transparent'
              }}
            >
              景点图片
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          {/* 左侧：实体列表 */}
          <div>
            <h3>{getEntityTypeLabel(selectedTab)} 列表</h3>
            
            {/* 搜索框 */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder={`搜索${getEntityTypeLabel(selectedTab)}...`}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            {/* 实体列表 */}
            <div 
              style={{
                maxHeight: '500px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>
              ) : entities.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  没有找到相关{getEntityTypeLabel(selectedTab)}
                </div>
              ) : (
                entities.map((entity) => (
                  <div
                    key={entity.id}
                    className={`entity-item ${selectedEntity?.id === entity.id ? 'selected' : ''}`}
                    onClick={() => fetchEntityImages(entity.id)}
                    style={{
                      padding: '15px',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      backgroundColor: selectedEntity?.id === entity.id ? '#e3f2fd' : 'white',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{entity.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      ID: {entity.id} | 创建时间: {new Date(entity.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      {entity.description?.substring(0, 80)}...
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 右侧：图片展示 */}
          <div>
            {selectedEntity ? (
              <div>
                <h3>{selectedEntity.name} - 图片管理</h3>
                <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div><strong>ID:</strong> {selectedEntity.id}</div>
                  <div><strong>类型:</strong> {getEntityTypeLabel(selectedTab)}</div>
                  <div><strong>图片数量:</strong> {entityImages.length}</div>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>加载图片中...</div>
                ) : entityImages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    该{getEntityTypeLabel(selectedTab)}还没有图片
                  </div>
                ) : (
                  <div>
                    {/* 图片操作按钮 */}
                    <div style={{ marginBottom: '15px' }}>
                      <button
                        onClick={() => window.open(`/admin/image-management?tab=${selectedTab}&entity=${selectedEntity.id}`, '_blank')}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '10px'
                        }}
                      >
                        上传更多图片
                      </button>
                    </div>

                    {/* 图片画廊 */}
                    <ImageGallery
                      images={entityImages.map((image, index) => ({
                        ...image,
                        alt: `${selectedEntity.name} 图片 ${index + 1}`
                      }))}
                      columns={2}
                      gap="15px"
                    />

                    {/* 图片管理操作 */}
                    <div style={{ marginTop: '20px' }}>
                      <h4>图片管理</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                        {entityImages.map((image, index) => (
                          <div
                            key={index}
                            style={{
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              padding: '10px',
                              backgroundColor: image.isPrimary ? '#e3f2fd' : 'white'
                            }}
                          >
                            <img
                              src={image.thumbnails.thumbnail.url}
                              alt={`图片 ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                marginBottom: '10px'
                              }}
                            />
                            <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                              <strong>文件名:</strong> {image.fileName}
                            </div>
                            <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                              <strong>大小:</strong> {(image.metadata.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                              <strong>上传时间:</strong> {new Date(image.metadata.uploadedAt).toLocaleString()}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '5px' }}>
                              {!image.isPrimary && (
                                <button
                                  onClick={() => setPrimaryImage(image.fileName)}
                                  style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    fontSize: '11px'
                                  }}
                                >
                                  设为主图
                                </button>
                              )}
                              {image.isPrimary && (
                                <span style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#28a745',
                                  color: 'white',
                                  borderRadius: '3px',
                                  fontSize: '11px'
                                }}>
                                  主图
                                </span>
                              )}
                              <button
                                onClick={() => deleteImage(image.fileName)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  cursor: 'pointer',
                                  fontSize: '11px'
                                }}
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                请从左侧选择一个{getEntityTypeLabel(selectedTab)}查看图片
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ImageViewer;
