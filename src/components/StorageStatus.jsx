import React, { useState, useEffect } from 'react';
import { getStorageInfo, getStorageStatus, cleanupOldNewspapers, clearAllData } from '../utils/localStorage';

const StorageStatus = ({ onDataChange }) => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [storageStatus, setStorageStatus] = useState(null);

  useEffect(() => {
    updateStorageInfo();
  }, []);

  const updateStorageInfo = async () => {
    const info = await getStorageInfo();
    const status = getStorageStatus();
    setStorageInfo(info);
    setStorageStatus(status);
  };

  const handleCleanup = async () => {
    if (window.confirm('ಹಳೆಯ ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಬೇಕೇ? (ಕೊನೆಯ 2 ಮಾತ್ರ ಉಳಿಯುತ್ತವೆ)')) {
      const deleted = await cleanupOldNewspapers(2);
      alert(`${deleted} ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಲಾಗಿದೆ`);
      await updateStorageInfo();
      if (onDataChange) onDataChange();
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಬೇಕೇ? ಇದನ್ನು ರದ್ದುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ!')) {
      await clearAllData();
      alert('ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಲಾಗಿದೆ');
      await updateStorageInfo();
      if (onDataChange) onDataChange();
    }
  };

  if (!storageInfo || !storageStatus) return null;

  const isSupabase = storageStatus.storageType.includes('Supabase');

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold text-newspaper-blue mb-3">ಸ್ಟೋರೇಜ್ ಸ್ಥಿತಿ</h3>
      
      <div className="space-y-3">
        {/* Storage Type Indicator */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">ಸ್ಟೋರೇಜ್ ಪ್ರಕಾರ:</span>
          <span className={`font-medium px-2 py-1 rounded text-xs ${
            isSupabase 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isSupabase ? 'ಕ್ಲೌಡ್ (ಸಂಗ್ರಹಿಸಲಾಗಿದೆ)' : 'ಸ್ಥಾನಿಕ ಮಾತ್ರ'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">ಪತ್ರಿಕೆಗಳು:</span>
          <span className="font-medium">{storageInfo.newspaperCount}</span>
        </div>
        
        {!isSupabase && (
          <>
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
          </>
        )}
        
        {isSupabase && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-800 text-sm">
              ✓ ಕ್ಲೌಡ್ ಸ್ಟೋರೇಜ್ ಸಕ್ರಿಯ. ಎಲ್ಲಾ ಬಳಕೆದಾರರು ಇದೇ ಡೇಟಾ ನೋಡಲು ಸಾಧ್ಯ.
            </p>
          </div>
        )}
        
        {!isSupabase && storageInfo.usagePercent > 70 && (
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