import React, { useState, useEffect } from 'react';
import { getClickableAreas } from '../utils/localStorage';

const NewspaperViewer = ({ newspaper }) => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    if (newspaper) {
      const clickableAreas = getClickableAreas(newspaper.id);
      setAreas(clickableAreas);
    }
  }, [newspaper]);

  const handleAreaClick = (area) => {
    // Create canvas to crop the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = Math.abs(area.width);
      canvas.height = Math.abs(area.height);
      
      ctx.drawImage(
        img,
        area.x, area.y,
        Math.abs(area.width), Math.abs(area.height),
        0, 0,
        Math.abs(area.width), Math.abs(area.height)
      );
      
      // Open cropped image in new tab
      const croppedDataUrl = canvas.toDataURL();
      const newWindow = window.open();
      newWindow.document.write(`<img src="${croppedDataUrl}" style="max-width:100%;height:auto;">`);
    };
    
    img.src = newspaper.previewImage;
  };

  if (!newspaper) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">ಇಂದಿನ ಪತ್ರಿಕೆ ಲಭ್ಯವಿಲ್ಲ</h3>
        <p className="text-gray-600">ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಆರ್ಕೈವ್ ಪರಿಶೀಲಿಸಿ</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-newspaper-blue mb-2">ಇಂದಿನ ಪತ್ರಿಕೆ</h2>
        <p className="text-gray-600">{new Date(newspaper.date).toLocaleDateString('kn-IN')}</p>
      </div>
      
      <div className="relative inline-block">
        <img
          src={newspaper.previewImage}
          alt="Today's newspaper"
          className="max-w-full h-auto border border-gray-300 rounded-lg shadow-sm"
        />
        
        {areas.map(area => (
          <div
            key={area.id}
            className="absolute cursor-pointer"
            style={{
              left: area.x,
              top: area.y,
              width: Math.abs(area.width),
              height: Math.abs(area.height)
            }}
            onClick={() => handleAreaClick(area)}
          />
        ))}
        

      </div>
      

    </div>
  );
};

export default NewspaperViewer;