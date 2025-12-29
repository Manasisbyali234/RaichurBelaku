import React, { useState, useEffect } from 'react';
import { getStorageInfo, cleanupOldNewspapers, clearAllData } from '../utils/localStorage';

const StorageStatus = ({ onDataChange }) => {
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    updateStorageInfo();
  }, []);

  const updateStorageInfo = () => {
    const info = getStorageInfo();
    setStorageInfo(info);
  };

  const handleCleanup = () => {
    if (window.confirm('ಹಳೆಯ ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಬೇಕೇ? (ಕೊನೆಯ 2 ಮಾತ್ರ ಉಳಿಯುತ್ತವೆ)')) {
      const deleted = cleanupOldNewspapers(2);
      alert(`${deleted} ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಲಾಗಿದೆ`);
      updateStorageInfo();
      if (onDataChange) onDataChange();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಬೇಕೇ? ಇದನ್ನು ರದ್ದುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ!')) {
      clearAllData();
      alert('ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಲಾಗಿದೆ');
      updateStorageInfo();
      if (onDataChange) onDataChange();
    }
  };

  if (!storageInfo) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold text-newspaper-blue mb-3">ಸ್ಟೋರೇಜ್ ಸ್ಥಿತಿ</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">ಪತ್ರಿಕೆಗಳು:</span>
          <span className="font-medium">{storageInfo.newspaperCount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">ಬಳಸಿದ ಸ್ಥಳ:</span>
          <span className="font-medium">{storageInfo.usedMB} MB</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              storageInfo.usagePercent > 80 ? 'bg-red-500' : 
              storageInfo.usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(storageInfo.usagePercent, 100)}%` }}
          ></div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          {storageInfo.usagePercent}% ಬಳಸಲಾಗಿದೆ
        </div>
        
        {storageInfo.usagePercent > 70 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ ಸ್ಟೋರೇಜ್ ಸ್ಥಳ ಕಡಿಮೆಯಾಗಿದೆ. ಹಳೆಯ ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಿ.
            </p>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCleanup}
            className="flex-1 bg-orange-500 text-white px-3 py-2 rounded text-sm hover:bg-orange-600"
          >
            ಹಳೆಯವುಗಳನ್ನು ಅಳಿಸಿ
          </button>
          <button
            onClick={handleClearAll}
            className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
          >
            ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorageStatus;