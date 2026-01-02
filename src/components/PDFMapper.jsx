import React, { useState, useRef, useEffect } from 'react';
import { saveClickableAreas } from '../utils/localStorage';

const PDFMapper = ({ newspaper, onAreasUpdate, onNavigateToManage }) => {
  const [areas, setAreas] = useState(newspaper?.areas || []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentArea, setCurrentArea] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '' });
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (newspaper?.areas) {
      setAreas(newspaper.areas);
    }
  }, [newspaper]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    startPos.current = pos;
    setIsDrawing(true);
    setCurrentArea({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    const width = pos.x - startPos.current.x;
    const height = pos.y - startPos.current.y;
    
    setCurrentArea({
      x: width < 0 ? pos.x : startPos.current.x,
      y: height < 0 ? pos.y : startPos.current.y,
      width: Math.abs(width),
      height: Math.abs(height)
    });
    
    drawCanvas();
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentArea || currentArea.width < 10 || currentArea.height < 10) {
      setIsDrawing(false);
      setCurrentArea(null);
      return;
    }
    
    setIsDrawing(false);
    setSelectedArea(currentArea);
    setShowForm(true);
    setFormData({ title: '', content: '', imageUrl: '' });
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (!img) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Draw existing areas
    areas.forEach((area, index) => {
      ctx.strokeStyle = '#1E40AF';
      ctx.fillStyle = 'rgba(30, 64, 175, 0.2)';
      ctx.lineWidth = 2;
      ctx.fillRect(area.x, area.y, area.width, area.height);
      ctx.strokeRect(area.x, area.y, area.width, area.height);
      
      // Draw area number
      ctx.fillStyle = '#1E40AF';
      ctx.font = '16px Arial';
      ctx.fillText(index + 1, area.x + 5, area.y + 20);
    });
    
    // Draw current area being drawn
    if (currentArea) {
      ctx.strokeStyle = '#B91C1C';
      ctx.fillStyle = 'rgba(185, 28, 28, 0.2)';
      ctx.lineWidth = 2;
      ctx.fillRect(currentArea.x, currentArea.y, currentArea.width, currentArea.height);
      ctx.strokeRect(currentArea.x, currentArea.y, currentArea.width, currentArea.height);
    }
  };

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    drawCanvas();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('ದಯವಿಟ್ಟು ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('ದಯವಿಟ್ಟು ವಿಷಯ ನಮೂದಿಸಿ');
      return;
    }
    
    const newArea = {
      ...selectedArea,
      id: Date.now(),
      pageNumber: 1, // Add page number for single-page newspapers
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl
    };
    
    const updatedAreas = [...areas, newArea];
    setAreas(updatedAreas);
    
    // Save to localStorage
    saveClickableAreas(newspaper.id, updatedAreas);
    if (onAreasUpdate) onAreasUpdate(updatedAreas);
    
    setShowForm(false);
    setSelectedArea(null);
    setCurrentArea(null);
    drawCanvas();
  };

  const handleDeleteArea = (index) => {
    const updatedAreas = areas.filter((_, i) => i !== index);
    setAreas(updatedAreas);
    
    // Save to localStorage
    saveClickableAreas(newspaper.id, updatedAreas);
    onAreasUpdate(updatedAreas);
    drawCanvas();
  };

  useEffect(() => {
    drawCanvas();
  }, [areas]);

  if (!newspaper?.imageUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">ಮೊದಲು PDF ಅಪ್ಲೋಡ್ ಮಾಡಿ</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-newspaper-blue mb-4">ಕ್ಲಿಕ್ ಮಾಡಬಹುದಾದ ಪ್ರದೇಶಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಿ</h2>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-newspaper-blue">
          ಮೌಸ್ ಡ್ರ್ಯಾಗ್ ಮಾಡಿ ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ಅನಂತರ ಕ್ಲಿಕ್ ಮಾಡಿ ವಿಷಯ ಸೇರಿಸಿ
        </p>
      </div>

      <div className="relative border border-gray-300 rounded-lg overflow-hidden">
        <img
          ref={imageRef}
          src={newspaper.imageUrl}
          alt="Newspaper"
          className="w-full h-auto"
          onLoad={handleImageLoad}
          style={{ display: 'none' }}
        />
        
        <canvas
          ref={canvasRef}
          className="w-full h-auto cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      {areas.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-newspaper-blue">ಮ್ಯಾಪ್ ಮಾಡಿದ ಪ್ರದೇಶಗಳು</h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Save all button clicked');
                if (onNavigateToManage) {
                  onNavigateToManage();
                } else {
                  console.log('onNavigateToManage callback not available');
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
            >
              ಎಲ್ಲಾ ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಿ
            </button>
          </div>
          <div className="space-y-2">
            {areas.map((area, index) => (
              <div key={area.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-newspaper-blue">ಪ್ರದೇಶ {index + 1}:</span>
                  <span className="ml-2">{area.title}</span>
                </div>
                <button
                  onClick={() => handleDeleteArea(index)}
                  className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
                >
                  ಅಳಿಸಿ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-newspaper-blue mb-4">ಪ್ರದೇಶದ ವಿಷಯ ಸೇರಿಸಿ</h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ಶೀರ್ಷಿಕೆ *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ವಿಷಯ *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ಚಿತ್ರದ URL (ಐಚ್ಛಿಕ)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-newspaper-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  ಸೇರಿಸಿ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedArea(null);
                    setCurrentArea(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  ರದ್ದುಮಾಡಿ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFMapper;