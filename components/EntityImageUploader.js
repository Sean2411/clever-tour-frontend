import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const EntityImageUploader = ({ 
  entityType = 'tour',
  onUpload,
  onError,
  onEntitySelect,
  className = '',
  showEntitySelector = true,
  showUploadArea = true
}) => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previews, setPreviews] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 获取实体列表
  const fetchEntities = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/upload/entities/${entityType}?page=${page}&limit=10&search=${encodeURIComponent(search)}`
      );
      const result = await response.json();
      
      if (result.success) {
        setEntities(result.data.entities);
        setTotalPages(result.data.pagination.pages);
        setCurrentPage(page);
      } else {
        onError?.(result.message);
      }
    } catch (error) {
      console.error('获取实体列表失败:', error);
      onError?.('获取实体列表失败');
    } finally {
      setLoading(false);
    }
  }, [entityType, onError]);

  // 初始加载实体列表
  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  // 搜索实体
  const handleSearch = useCallback((search) => {
    setSearchTerm(search);
    fetchEntities(1, search);
  }, [fetchEntities]);

  // 选择实体
  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    setUploadedImages([]);
    setPreviews([]);
    // 调用外部回调
    onEntitySelect?.(entity);
  };

  // 单文件上传
  const uploadSingleFile = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('entityType', entityType);
    formData.append('entityId', selectedEntity.id);
    formData.append('description', '');
    formData.append('isPrimary', 'false');

    // 创建预览
    const previewUrl = URL.createObjectURL(file);
    setPreviews([{ id: uuidv4(), url: previewUrl, file }]);

    try {
      const response = await fetch('/api/upload/upload-for-entity', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImages([result.data]);
        onUpload?.(result.data);
        
        // 更新预览
        const thumbnail = result.data.thumbnails.find(t => t.size === 'thumbnail');
        setPreviews([{
          id: uuidv4(),
          url: thumbnail ? thumbnail.url : result.data.original.url,
          uploaded: true
        }]);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setPreviews([]);
      throw error;
    }
  }, [selectedEntity, entityType, onUpload]);

  // 多文件上传
  const uploadMultipleFiles = useCallback(async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('entityType', entityType);
    formData.append('entityId', selectedEntity.id);
    formData.append('descriptions', JSON.stringify([]));

    // 创建预览
    const previews = files.map(file => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      file
    }));
    setPreviews(previews);

    try {
      const response = await fetch('/api/upload/batch-upload-for-entity', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImages(result.data.images);
        onUpload?.(result.data.images);
        
        // 更新预览
        const newPreviews = result.data.images.map((data, index) => {
          const thumbnail = data.thumbnails.find(t => t.size === 'thumbnail');
          return {
            id: uuidv4(),
            url: thumbnail ? thumbnail.url : data.original.url,
            uploaded: true,
            isPrimary: index === 0
          };
        });
        setPreviews(newPreviews);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setPreviews([]);
      throw error;
    }
  }, [selectedEntity, entityType, onUpload]);

  // 处理文件选择
  const handleFileSelect = useCallback(async (files) => {
    if (!selectedEntity) {
      onError?.('请先选择要关联的对象');
      return;
    }

    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // 验证文件
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        onError?.('只支持图片文件');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        onError?.('文件大小不能超过 10MB');
        return;
      }
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      if (fileArray.length === 1) {
        await uploadSingleFile(fileArray[0]);
      } else {
        await uploadMultipleFiles(fileArray);
      }
    } catch (error) {
      console.error('上传失败:', error);
      onError?.(error.message || '上传失败');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [selectedEntity, onUpload, onError, uploadSingleFile, uploadMultipleFiles]);

  // 处理拖拽上传
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  // 处理点击上传
  const handleClick = useCallback(() => {
    if (!uploading && selectedEntity) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.onchange = (e) => handleFileSelect(e.target.files);
      input.click();
    }
  }, [uploading, selectedEntity, handleFileSelect]);

  // 清理预览URL
  const cleanupPreviews = useCallback(() => {
    previews.forEach(preview => {
      if (preview.url.startsWith('blob:')) {
        URL.revokeObjectURL(preview.url);
      }
    });
  }, [previews]);

  // 组件卸载时清理
  useEffect(() => {
    return cleanupPreviews;
  }, [cleanupPreviews]);

  return (
    <div className={`entity-image-uploader ${className}`}>
      {/* 实体选择器 */}
      {showEntitySelector && (
        <div className="entity-selector" style={{ marginBottom: '20px' }}>
          <h3>Select {entityType === 'tour' ? 'Tour' : 'Attraction'}</h3>
          
          {/* 搜索框 */}
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder={`Search ${entityType === 'tour' ? 'tours' : 'attractions'}...`}
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
            className="entity-list"
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
            ) : entities.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No {entityType === 'tour' ? 'tours' : 'attractions'} found
              </div>
            ) : (
              entities.map((entity) => (
                <div
                  key={entity.id}
                  className={`entity-item ${selectedEntity?.id === entity.id ? 'selected' : ''}`}
                  onClick={() => handleSelectEntity(entity)}
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    backgroundColor: selectedEntity?.id === entity.id ? '#e3f2fd' : 'white',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{entity.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    {entity.description?.substring(0, 100)}...
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <button
                onClick={() => fetchEntities(currentPage - 1, searchTerm)}
                disabled={currentPage === 1}
                style={{ marginRight: '10px' }}
              >
                Previous
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                onClick={() => fetchEntities(currentPage + 1, searchTerm)}
                disabled={currentPage === totalPages}
                style={{ marginLeft: '10px' }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* 选中的实体信息 */}
      {selectedEntity && (
        <div 
          className="selected-entity"
          style={{
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontWeight: 'bold' }}>Selected: {selectedEntity.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {selectedEntity.id} | Type: {entityType === 'tour' ? 'Tour' : 'Attraction'}
          </div>
        </div>
      )}

      {/* 上传区域 */}
      {showUploadArea && (
        <div
          className={`upload-area ${uploading ? 'uploading' : ''} ${!selectedEntity ? 'disabled' : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          style={{
            border: '2px dashed #ccc',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            cursor: !selectedEntity ? 'not-allowed' : uploading ? 'not-allowed' : 'pointer',
            backgroundColor: !selectedEntity ? '#f5f5f5' : uploading ? '#f5f5f5' : '#fafafa',
            transition: 'all 0.3s ease',
            opacity: !selectedEntity ? 0.6 : 1
          }}
        >
        {!selectedEntity ? (
          <div>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
            <div>Please select a {entityType === 'tour' ? 'tour' : 'attraction'} to associate with</div>
          </div>
        ) : uploading ? (
          <div>
            <div>Uploading...</div>
            {uploadProgress > 0 && (
              <div className="progress-bar" style={{ marginTop: '10px' }}>
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${uploadProgress}%`,
                    height: '4px',
                    backgroundColor: '#007bff',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📷</div>
            <div>Click or drag to upload images to {selectedEntity.name}</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Supports JPEG, PNG, WebP formats, max 10MB
            </div>
          </div>
        )}
        </div>
      )}

      {/* 预览区域 */}
      {previews.length > 0 && (
        <div className="preview-area" style={{ marginTop: '20px' }}>
          <h4>Upload Preview</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {previews.map((preview) => (
              <div key={preview.id} className="preview-item" style={{ position: 'relative' }}>
                <img
                  src={preview.url}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: preview.uploaded ? '2px solid #28a745' : '1px solid #ddd'
                  }}
                />
                {preview.uploaded && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    ✓
                  </div>
                )}
                {preview.isPrimary && (
                  <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    left: '5px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '10px'
                  }}>
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 上传结果 */}
      {uploadedImages.length > 0 && (
        <div className="upload-results" style={{ marginTop: '20px' }}>
          <h4>Upload Successful ({uploadedImages.length} images)</h4>
          {uploadedImages.map((image, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <div><strong>File Name:</strong> {image.fileName}</div>
              <div><strong>Associated Object:</strong> {image.entityType === 'tour' ? 'Tour' : 'Attraction'} - {selectedEntity.name}</div>
              <div><strong>Is Primary:</strong> {image.isPrimary ? 'Yes' : 'No'}</div>
              <div><strong>Sizes:</strong></div>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {image.thumbnails.map((thumb) => (
                  <li key={thumb.size}>
                    {thumb.size}: {thumb.dimensions.width}x{thumb.dimensions.height}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntityImageUploader;