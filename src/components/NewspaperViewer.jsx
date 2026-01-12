import React, { useState, useEffect, useRef } from 'react';

const NewspaperViewer = ({ newspaper }) => {
  const [areas, setAreas] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const imageRef = useRef(null);

  console.log('NewspaperViewer rendered with newspaper:', newspaper);

  useEffect(() => {
    const loadAreas = () => {
      if (newspaper) {
        try {
          // Get areas from the newspaper object (from backend)
          let clickableAreas = newspaper.clickableAreas || [];
          
          console.log('Loading areas for newspaper:', newspaper._id || newspaper.id, 'Name:', newspaper.name);
          console.log('Clickable areas found:', clickableAreas.length);
          console.log('Areas data:', clickableAreas);
          console.log('Current page:', currentPage + 1);
          console.log('Areas for current page:', clickableAreas.filter(area => !area.pageNumber || area.pageNumber === currentPage + 1));
          setAreas(clickableAreas);
        } catch (error) {
          console.error('Error loading areas:', error);
          setAreas([]);
        }
      } else {
        console.log('No newspaper loaded');
      }
    };
    
    loadAreas();
  }, [newspaper, currentPage]);

  const handleAreaClick = (area) => {
    console.log('Area clicked:', area);
    if (area && (area.title || area.content)) {
      setSelectedNews(area);
    } else {
      console.log('No content for this area');
    }
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
  };

  const nextPage = () => {
    if (newspaper.pages && currentPage < newspaper.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getCurrentPageImage = () => {
    if (newspaper.pages && newspaper.pages[currentPage]) {
      return getFullImageUrl(newspaper.pages[currentPage].imageUrl || newspaper.pages[currentPage]);
    }
    // Try different image properties
    return getFullImageUrl(newspaper.imageUrl || newspaper.previewImage || newspaper.preview);
  };

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return '/logo.jpg';
    
    // If it's already a full URL or base64, return as is
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    // If it's a relative path, prepend backend URL
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:3001${imageUrl}`;
    }
    
    return imageUrl;
  };

  if (!newspaper) {
    console.log('NewspaperViewer: No newspaper provided');
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">ಇಂದಿನ ಪತ್ರಿಕೆ ಲಭ್ಯವಿಲ್ಲ</h3>
        <p className="text-gray-600">ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಆರ್ಕೈವ್ ಪರಿಶೀಲಿಸಿ</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Debug: Newspaper object is null or undefined</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-newspaper-blue">ರಾಯಚೂರು ಬೆಳಕು</h1>
              <p className="text-sm text-gray-600">{new Date(newspaper.date).toLocaleDateString('kn-IN')}</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowThumbnails(!showThumbnails)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm flex-1 sm:flex-none"
              >
                {showThumbnails ? 'ಮುಚ್ಚಿಸಿ' : 'ಪುಟಗಳು'}
              </button>
              <div className="flex items-center gap-1 bg-gray-200 rounded">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                  className="px-2 py-1 hover:bg-gray-300 rounded-l text-lg font-bold"
                >-</button>
                <span className="px-2 py-1 text-sm min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                  className="px-2 py-1 hover:bg-gray-300 rounded-r text-lg font-bold"
                >+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Thumbnails Sidebar */}
        {showThumbnails && newspaper.pages && (
          <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-3">ಪುಟಗಳು</h3>
              <div className="space-y-2">
                {newspaper.pages.map((page, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`cursor-pointer border-2 rounded p-2 transition-colors ${
                      currentPage === index ? 'border-newspaper-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={getFullImageUrl(page.imageUrl || page)}
                      alt={`Page ${index + 1}`}
                      className="w-full h-auto rounded"
                      onError={(e) => { e.target.src = '/logo.jpg'; }}
                    />
                    <p className="text-xs text-center mt-1">ಪುಟ {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Viewer */}
        <div className="flex-1 overflow-auto">
          <div className="p-2 md:p-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div 
                className="relative mx-auto" 
                style={{ 
                  transform: `scale(${zoom})`, 
                  transformOrigin: 'top center',
                  position: 'relative',
                  maxWidth: '100%'
                }}
              >
                <img
                  ref={imageRef}
                  src={getCurrentPageImage()}
                  alt={`Newspaper page ${currentPage + 1}`}
                  className="newspaper-viewer-image w-full h-auto block mx-auto"
                  style={{ 
                    pointerEvents: 'none', 
                    userSelect: 'none', 
                    position: 'relative', 
                    zIndex: 1,
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                  onError={(e) => {
                    console.error('Failed to load newspaper image:', getCurrentPageImage());
                    e.target.src = '/logo.jpg'; // Fallback image
                  }}
                />
                
                {/* Clickable areas container */}
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    pointerEvents: 'none',
                    zIndex: 10,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {areas.filter(area => !area.pageNumber || area.pageNumber === currentPage + 1).map((area, index) => {
                    // Calculate scaled coordinates based on current image display size
                    const imgElement = imageRef.current;
                    if (!imgElement) return null;
                    
                    const displayWidth = imgElement.offsetWidth;
                    const displayHeight = imgElement.offsetHeight;
                    const naturalWidth = imgElement.naturalWidth;
                    const naturalHeight = imgElement.naturalHeight;
                    
                    // Calculate scale factors
                    const scaleX = displayWidth / naturalWidth;
                    const scaleY = displayHeight / naturalHeight;
                    
                    // Scale the area coordinates
                    const scaledX = area.x * scaleX;
                    const scaledY = area.y * scaleY;
                    const scaledWidth = Math.abs(area.width) * scaleX;
                    const scaledHeight = Math.abs(area.height) * scaleY;
                    
                    return (
                      <div
                        key={area.id || index}
                        className="absolute cursor-pointer transition-all duration-200"
                        style={{
                          left: `${scaledX}px`,
                          top: `${scaledY}px`,
                          width: `${scaledWidth}px`,
                          height: `${scaledHeight}px`,
                          pointerEvents: 'auto',
                          zIndex: 20
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Area clicked!', area);
                          handleAreaClick(area);
                        }}
                        title={area.title || 'ಕ್ಲಿಕ್ ಮಾಡಿ'}
                      >
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      {newspaper.pages && newspaper.totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="bg-newspaper-blue text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                ಹಿಂದಿನ ಪುಟ
              </button>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                <span className="text-sm font-medium whitespace-nowrap">ಪುಟ {currentPage + 1} / {newspaper.totalPages}</span>
                <input
                  type="range"
                  min="0"
                  max={newspaper.totalPages - 1}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                  className="w-24 sm:w-32"
                />
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === newspaper.totalPages - 1}
                className="bg-newspaper-blue text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                ಮುಂದಿನ ಪುಟ
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50">
          <div>Areas loaded: {areas.length}</div>
          <div>Current page: {currentPage + 1}</div>
          <div>Areas for page: {areas.filter(area => !area.pageNumber || area.pageNumber === currentPage + 1).length}</div>
        </div>
      )}

      {/* News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b bg-newspaper-blue text-white">
              <h3 className="text-xl font-bold">{selectedNews.title || 'ಸುದ್ದಿ'}</h3>
              <button
                onClick={closeNewsModal}
                className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-blue-700"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
            
            {/* Show cropped image from the selected area - Main focus */}
            <div className="mb-6">
              <CroppedImage 
                sourceImage={getCurrentPageImage()}
                area={selectedNews}
                alt={selectedNews.title || 'ಸುದ್ದಿ'}
              />
            </div>
            
            {/* Additional image if provided */}
            {selectedNews.imageUrl && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">ಹೆಚ್ಚುವರಿ ಚಿತ್ರ:</h4>
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-auto rounded-lg border border-gray-200"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            
            {/* Content text */}
            {selectedNews.content && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">ವಿವರಣೆ:</h4>
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedNews.content}
                </div>
              </div>
            )}
            
            </div>
            <div className="p-4 border-t bg-gray-50 text-center">
              <button
                onClick={closeNewsModal}
                className="bg-newspaper-red text-white px-8 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                ಮುಚ್ಚಿಸಿ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CroppedImage = ({ sourceImage, area, alt }) => {
  const canvasRef = React.useRef(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sourceImage || !area) {
      setError('Missing image or area data');
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) {
          setError('Canvas not available');
          return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Canvas context not available');
          return;
        }
        
        // Validate area dimensions
        const width = Math.abs(area.width);
        const height = Math.abs(area.height);
        
        if (width <= 0 || height <= 0) {
          setError('Invalid area dimensions');
          return;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Clear canvas first
        ctx.clearRect(0, 0, width, height);
        
        // Draw the cropped image
        ctx.drawImage(
          img,
          area.x, area.y, width, height,
          0, 0, width, height
        );
        
        setCroppedImageUrl(canvas.toDataURL('image/jpeg', 0.8));
        setError(null);
      } catch (err) {
        console.error('Error cropping image:', err);
        setError('Failed to crop image');
      }
    };
    
    img.onerror = () => {
      console.error('Failed to load source image:', sourceImage);
      setError('Failed to load image');
    };
    
    img.crossOrigin = 'anonymous';
    img.src = sourceImage;
  }, [sourceImage, area]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="text-center">
        {error ? (
          <div className="text-red-500 p-4">
            <p>ಚಿತ್ರ ಲೋಡ್ ಆಗಲಿಲ್ಲ</p>
            <p className="text-xs">{error}</p>
          </div>
        ) : croppedImageUrl ? (
          <img
            src={croppedImageUrl}
            alt={alt}
            className="max-w-full h-auto mx-auto rounded border-2 border-gray-300 shadow-lg bg-white"
            style={{ maxHeight: '500px' }}
          />
        ) : (
          <div className="text-gray-500 p-4">ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
        )}
        <p className="text-xs text-gray-600 mt-2">ಆಯ್ಕೆ ಮಾಡಿದ ಪ್ರದೇಶದ ಚಿತ್ರ</p>
      </div>
    </div>
  );
};

export default NewspaperViewer;