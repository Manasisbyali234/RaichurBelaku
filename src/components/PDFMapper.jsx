import React, { useState, useRef } from 'react';
import { saveClickableAreas } from '../utils/localStorage';

const PDFMapper = ({ newspaper }) => {
  const [areas, setAreas] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentArea, setCurrentArea] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentArea({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentArea(prev => ({
      ...prev,
      width: x - prev.x,
      height: y - prev.y
    }));
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentArea) return;
    
    if (Math.abs(currentArea.width) > 20 && Math.abs(currentArea.height) > 20) {
      const newArea = {
        id: Date.now().toString(),
        ...currentArea
      };
      setAreas(prev => [...prev, newArea]);
    }
    setCurrentArea(null);
    setIsDrawing(false);
  };

  const deleteArea = (areaId) => {
    const updatedAreas = areas.filter(area => area.id !== areaId);
    setAreas(updatedAreas);
  };

  const handleSaveAll = () => {
    saveClickableAreas(newspaper.id, areas);
    alert('ಎಲ್ಲಾ ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-newspaper-blue mb-4">ಕ್ಲಿಕ್ ಮಾಡಬಹುದಾದ ಪ್ರದೇಶಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಿ</h2>
      
      <div className="relative inline-block">
        <img
          ref={imageRef}
          src={newspaper.pages ? newspaper.pages[currentPage].imageUrl : newspaper.previewImage}
          alt={`Newspaper page ${currentPage + 1}`}
          className="max-w-full h-auto border border-gray-300 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          draggable={false}
        />
        
        {areas.map(area => (
          <div
            key={area.id}
            className="clickable-area group"
            style={{
              left: area.x,
              top: area.y,
              width: Math.abs(area.width),
              height: Math.abs(area.height)
            }}
          >
            <button
              onClick={() => deleteArea(area.id)}
              className="absolute -top-2 -right-2 bg-newspaper-red text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
        
        {currentArea && (
          <div
            className="drawing-area"
            style={{
              left: currentArea.x,
              top: currentArea.y,
              width: Math.abs(currentArea.width),
              height: Math.abs(currentArea.height)
            }}
          />
        )}
      </div>

      {newspaper.pages && newspaper.totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← ಹಿಂದಿನ ಪುಟ
          </button>
          
          <div className="text-sm text-gray-600">
            ಪುಟ {currentPage + 1} / {newspaper.totalPages}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(newspaper.totalPages - 1, currentPage + 1))}
            disabled={currentPage === newspaper.totalPages - 1}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ಮುಂದಿನ ಪುಟ →
          </button>
        </div>
      )}

      <div className="mt-4">
        {areas.length > 0 && (
          <div className="mb-4">
            <button
              onClick={handleSaveAll}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              ಎಲ್ಲಾ ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಿ ({areas.length})
            </button>
          </div>
        )}
        <div className="text-sm text-gray-600">
          <p>• ಮೌಸ್ ಡ್ರ್ಯಾಗ್ ಮಾಡಿ ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ</p>
          <p>• ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಪ್ರದೇಶಗಳನ್ನು ಅಳಿಸಲು × ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ</p>
        </div>
      </div>
    </div>
  );
};

export default PDFMapper;