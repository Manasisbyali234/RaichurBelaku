import React, { useState } from 'react';
import * as localStorage from '../utils/localStorage';

const DataMigration = () => {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const migrateData = async () => {
    setIsLoading(true);
    setStatus('ಡೇಟಾ ಮೈಗ್ರೇಶನ್ ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ...');

    try {
      // Get localStorage data
      const localNewspapers = JSON.parse(window.localStorage.getItem('newspapers') || '[]');
      const localToday = window.localStorage.getItem('todaysNewspaper');

      if (localNewspapers.length === 0) {
        setStatus('ಯಾವುದೇ ಸ್ಥಳೀಯ ಡೇಟಾ ಕಂಡುಬಂದಿಲ್ಲ');
        setIsLoading(false);
        return;
      }

      setStatus(`${localNewspapers.length} ಪತ್ರಿಕೆಗಳನ್ನು ಮೈಗ್ರೇಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ...`);

      // Migrate newspapers
      for (let i = 0; i < localNewspapers.length; i++) {
        const newspaper = localNewspapers[i];
        setStatus(`ಪತ್ರಿಕೆ ${i + 1}/${localNewspapers.length} ಅಪ್ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ: ${newspaper.name}`);
        await localStorage.saveNewspaper(newspaper);
      }

      // Migrate today's newspaper
      if (localToday) {
        const todayData = JSON.parse(localToday);
        const todayNewspaper = localNewspapers.find(n => n.id === todayData.newspaperId);
        if (todayNewspaper) {
          await localStorage.setTodaysNewspaper(todayNewspaper);
          setStatus('ಇಂದಿನ ಪತ್ರಿಕೆ ಸೆಟ್ ಮಾಡಲಾಗಿದೆ');
        }
      }

      setStatus(`✅ ಯಶಸ್ವಿಯಾಗಿ ${localNewspapers.length} ಪತ್ರಿಕೆಗಳನ್ನು ಮೈಗ್ರೇಟ್ ಮಾಡಲಾಗಿದೆ!`);
    } catch (error) {
      console.error('Migration error:', error);
      setStatus(`❌ ಮೈಗ್ರೇಶನ್ ವಿಫಲವಾಗಿದೆ: ${error.message}`);
    }

    setIsLoading(false);
  };

  const clearLocalData = () => {
    if (window.confirm('ಸ್ಥಳೀಯ ಡೇಟಾವನ್ನು ಅಳಿಸುವುದು ಖಚಿತವೇ?')) {
      window.localStorage.removeItem('newspapers');
      window.localStorage.removeItem('todaysNewspaper');
      setStatus('✅ ಸ್ಥಳೀಯ ಡೇಟಾ ಅಳಿಸಲಾಗಿದೆ');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-newspaper-blue mb-4">
        ಡೇಟಾ ಮೈಗ್ರೇಶನ್
      </h3>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          ನಿಮ್ಮ ಸ್ಥಳೀಯ ಡೇಟಾವನ್ನು ಕ್ಲೌಡ್‌ಗೆ ಮೈಗ್ರೇಟ್ ಮಾಡಿ
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={migrateData}
            disabled={isLoading}
            className="bg-newspaper-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'ಮೈಗ್ರೇಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'ಡೇಟಾ ಮೈಗ್ರೇಟ್ ಮಾಡಿ'}
          </button>
          
          <button
            onClick={clearLocalData}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            ಸ್ಥಳೀಯ ಡೇಟಾ ಅಳಿಸಿ
          </button>
        </div>
        
        {status && (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataMigration;