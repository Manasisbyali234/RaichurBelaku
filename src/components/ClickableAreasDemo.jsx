import React, { useState } from 'react';
import { saveNewspaper, saveClickableAreas } from '../utils/localStorage';

const ClickableAreasDemo = () => {
  const [demoCreated, setDemoCreated] = useState(false);

  const createDemoNewspaper = () => {
    // Create a demo newspaper with sample image
    const demoNewspaper = {
      id: 'demo-' + Date.now(),
      name: 'ಡೆಮೋ ಪತ್ರಿಕೆ',
      date: new Date().toISOString(),
      previewImage: 'https://via.placeholder.com/800x1000/f0f0f0/333?text=ಡೆಮೋ+ಪತ್ರಿಕೆ',
      pages: [{
        imageUrl: 'https://via.placeholder.com/800x1000/f0f0f0/333?text=ಡೆಮೋ+ಪತ್ರಿಕೆ',
        pageNumber: 1
      }],
      totalPages: 1,
      areas: []
    };

    // Save the demo newspaper
    const newspaperId = saveNewspaper(demoNewspaper);

    // Create sample clickable areas
    const sampleAreas = [
      {
        id: 'area-1',
        x: 50,
        y: 100,
        width: 300,
        height: 150,
        title: 'ಮುಖ್ಯ ಸುದ್ದಿ',
        content: 'ಇದು ಮುಖ್ಯ ಸುದ್ದಿಯ ವಿವರಣೆ. ಈ ಪ್ರದೇಶವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿದಾಗ ಈ ಸುದ್ದಿ ತೆರೆಯುತ್ತದೆ.',
        imageUrl: '',
        pageNumber: 1
      },
      {
        id: 'area-2',
        x: 400,
        y: 200,
        width: 250,
        height: 120,
        title: 'ಕ್ರೀಡಾ ಸುದ್ದಿ',
        content: 'ಇಂದಿನ ಕ್ರೀಡಾ ಸುದ್ದಿಗಳು ಮತ್ತು ಫಲಿತಾಂಶಗಳು ಇಲ್ಲಿ ಲಭ್ಯವಿದೆ.',
        imageUrl: '',
        pageNumber: 1
      },
      {
        id: 'area-3',
        x: 100,
        y: 400,
        width: 200,
        height: 100,
        title: 'ಸ್ಥಳೀಯ ಸುದ್ದಿ',
        content: 'ರಾಯಚೂರಿನ ಸ್ಥಳೀಯ ಸುದ್ದಿಗಳು ಮತ್ತು ಘಟನೆಗಳ ವಿವರಗಳು.',
        imageUrl: '',
        pageNumber: 1
      }
    ];

    // Save the clickable areas
    const success = saveClickableAreas(newspaperId, sampleAreas);
    
    if (success) {
      setDemoCreated(true);
      alert('ಡೆಮೋ ಪತ್ರಿಕೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ! ಈಗ "ಇಂದಿನ ಪತ್ರಿಕೆ" ಪುಟಕ್ಕೆ ಹೋಗಿ ಕ್ಲಿಕ್ ಮಾಡಬಹುದಾದ ಪ್ರದೇಶಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.');
    } else {
      alert('ಡೆಮೋ ರಚಿಸುವಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-newspaper-blue mb-4">
        ಕ್ಲಿಕ್ ಮಾಡಬಹುದಾದ ಪ್ರದೇಶಗಳ ಡೆಮೋ
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-700">
          ಈ ಡೆಮೋ ಕ್ಲಿಕ್ ಮಾಡಬಹುದಾದ ಪ್ರದೇಶಗಳೊಂದಿಗೆ ಮಾದರಿ ಪತ್ರಿಕೆಯನ್ನು ರಚಿಸುತ್ತದೆ.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">ಡೆಮೋ ವೈಶಿಷ್ಟ್ಯಗಳು:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 3 ಕ್ಲಿಕ್ ಮಾಡಬಹುದಾದ ಪ್ರದೇಶಗಳು</li>
            <li>• ಪ್ರತಿ ಪ್ರದೇಶಕ್ಕೆ ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿಷಯ</li>
            <li>• ಹೋವರ್ ಎಫೆಕ್ಟ್‌ಗಳು ಮತ್ತು ಆನಿಮೇಷನ್‌ಗಳು</li>
            <li>• ಮೊಬೈಲ್ ಸ್ನೇಹಿ ಇಂಟರ್‌ಫೇಸ್</li>
          </ul>
        </div>
        
        <button
          onClick={createDemoNewspaper}
          disabled={demoCreated}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            demoCreated 
              ? 'bg-green-600 text-white cursor-not-allowed' 
              : 'bg-newspaper-blue text-white hover:bg-blue-700'
          }`}
        >
          {demoCreated ? '✓ ಡೆಮೋ ರಚಿಸಲಾಗಿದೆ' : 'ಡೆಮೋ ಪತ್ರಿಕೆ ರಚಿಸಿ'}
        </button>
        
        {demoCreated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              ಡೆಮೋ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ! ಈಗ "ಇಂದಿನ ಪತ್ರಿಕೆ" ಪುಟಕ್ಕೆ ಹೋಗಿ ನೀಲಿ ಪ್ರದೇಶಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClickableAreasDemo;