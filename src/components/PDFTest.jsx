import React, { useState } from 'react';
import { convertPDFToImage } from '../utils/pdfUtils';

const PDFTest = () => {
  const [status, setStatus] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const testPDFProcessing = async (file) => {
    try {
      setStatus('PDF ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದೆ...');
      const result = await convertPDFToImage(file);
      setImageUrl(result.imageUrl);
      setStatus('ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಿದೆ!');
    } catch (error) {
      setStatus('ದೋಷ: ' + error.message);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">PDF ಪರೀಕ್ಷೆ</h3>
      
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => e.target.files[0] && testPDFProcessing(e.target.files[0])}
        className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      {status && (
        <div className="mb-4 p-2 bg-gray-100 rounded">
          {status}
        </div>
      )}
      
      {imageUrl && (
        <div>
          <p className="mb-2">ಪರಿವರ್ತಿತ ಚಿತ್ರ:</p>
          <img src={imageUrl} alt="PDF Preview" className="max-w-full h-auto border" />
        </div>
      )}
    </div>
  );
};

export default PDFTest;