import React, { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SmartImageUploader = ({ 
  type = 'tour', 
  category = 'general',
  onUpload, 
  onError,
  maxFiles = 1,
  className = '',
  showPreview = true,
  showProgress = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previews, setPreviews] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  // 处理文件选择
  const handleFileSelect = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // 验证文件数量
    if (fileArray.length > maxFiles) {
      onError?.(`最多只能上传 ${maxFiles} 个文件`);
      return;
    }

    // 验证文件类型和大小
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
        // 单文件上传
        await uploadSingleFile(fileArray[0]);
      } else {
        // 多文件上传
        await uploadMultipleFiles(fileArray);
      }
    } catch (error) {
      console.error('上传失败:', error);
      onError?.(error.message || '上传失败');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [type, category, maxFiles, onUpload, onError]);

  // 单文件上传
  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    formData.append('category', category);

    // 创建预览
    const previewUrl = URL.createObjectURL(file);
    setPreviews([{ id: uuidv4(), url: previewUrl, file }]);

    try {
      const response = await fetch('/api/upload/smart-upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImages([result.data]);
        onUpload?.(result.data);
        
        // 更新预览为上传后的图片
        setPreviews([{
          id: uuidv4(),
          url: result.data.thumbnails.thumbnail.url,
          uploaded: true
        }]);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setPreviews([]);
      throw error;
    }
  };

  // 多文件上传
  const uploadMultipleFiles = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('type', type);
    formData.append('category', category);

    // 创建预览
    const previews = files.map(file => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      file
    }));
    setPreviews(previews);

    try {
      const response = await fetch('/api/upload/smart-batch-upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImages(result.data);
        onUpload?.(result.data);
        
        // 更新预览为上传后的图片
        const newPreviews = result.data.map((data, index) => ({
          id: uuidv4(),
          url: data.thumbnails.thumbnail.url,
          uploaded: true
        }));
        setPreviews(newPreviews);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setPreviews([]);
      throw error;
    }
  };

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
    if (!uploading) {
      fileInputRef.current?.click();
    }
  }, [uploading]);

  // 清理预览URL
  const cleanupPreviews = useCallback(() => {
    previews.forEach(preview => {
      if (preview.url.startsWith('blob:')) {
        URL.revokeObjectURL(preview.url);
      }
    });
  }, [previews]);

  // 组件卸载时清理
  React.useEffect(() => {
    return cleanupPreviews;
  }, [cleanupPreviews]);

  return (
    <div className={`smart-image-uploader ${className}`}>
      {/* 上传区域 */}
      <div
        className={`upload-area ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          backgroundColor: uploading ? '#f5f5f5' : '#fafafa',
          transition: 'all 0.3s ease'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={maxFiles > 1}
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        
        {uploading ? (
          <div>
            <div>上传中...</div>
            {showProgress && (
              <div className="progress-bar">
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
            <div>点击或拖拽上传图片</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              支持 JPEG、PNG、WebP 格式，最大 10MB
            </div>
            {maxFiles > 1 && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                最多可上传 {maxFiles} 张图片
              </div>
            )}
          </div>
        )}
      </div>

      {/* 预览区域 */}
      {showPreview && previews.length > 0 && (
        <div className="preview-area" style={{ marginTop: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {previews.map((preview) => (
              <div key={preview.id} className="preview-item" style={{ position: 'relative' }}>
                <img
                  src={preview.url}
                  alt="预览"
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 上传结果 */}
      {uploadedImages.length > 0 && (
        <div className="upload-results" style={{ marginTop: '20px' }}>
          <h4>上传成功 ({uploadedImages.length} 张图片)</h4>
          {uploadedImages.map((image, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <div><strong>文件名:</strong> {image.fileName}</div>
              <div><strong>类型:</strong> {image.type}</div>
              <div><strong>分类:</strong> {image.category}</div>
              <div><strong>尺寸:</strong></div>
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

export default SmartImageUploader;
