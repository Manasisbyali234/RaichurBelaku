import React, { useState, useEffect } from 'react';
import { convertPDFToImage } from '../utils/pdfUtils';
import { saveNewspaper, getNewspapers, testLocalStorage } from '../utils/localStorage';

const TestPage = () => {
  const [status, setStatus] = useState('');
  const [newspapers, setNewspapers] = useState([]);
  const [pdfWorkerStatus, setPdfWorkerStatus] = useState('ಪರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ...');

  useEffect(() => {
    // Test localStorage
    const localStorageWorks = testLocalStorage();
    setStatus(localStorageWorks ? 'localStorage ಕೆಲಸ ಮಾಡುತ್ತಿದೆ ✓' : 'localStorage ಸಮಸ್ಯೆ ✗');
    
    // Test PDF.js worker
    try {
      import('pdfjs-dist').then(pdfjsLib => {
        setPdfWorkerStatus(`PDF.js ಲೋಡ್ ಆಗಿದೆ ✓ (v${pdfjsLib.version})`);
      });
    } catch (error) {
      setPdfWorkerStatus('PDF.js ಲೋಡ್ ಆಗಲಿಲ್ಲ ✗');
    }
    
    // Load existing newspapers
    loadNewspapers();
  }, []);

  const loadNewspapers = async () => {
    try {
      const saved = await getNewspapers();
      setNewspapers(saved);
    } catch (error) {
      console.error('Error loading newspapers:', error);
    }
  };

  const testPDFUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setStatus('ದಯವಿಟ್ಟು PDF ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ');
      return;
    }

    setStatus('PDF ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದೆ...');
    
    try {
      const result = await convertPDFToImage(file);
      
      const testNewspaper = {
        id: 'test-' + Date.now(),
        name: file.name,
        date: new Date().toISOString(),
        pages: [{
          pageNumber: 1,
          imageUrl: result.imageUrl,
          width: result.width,
          height: result.height
        }],
        totalPages: 1,
        previewImage: result.imageUrl,
        width: result.width,
        height: result.height,
        areas: []
      };

      await saveNewspaper(testNewspaper);
      await loadNewspapers();
      
      setStatus('ಯಶಸ್ವಿ! PDF ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ localStorage ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ ✓');
    } catch (error) {
      setStatus('ದೋಷ: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-newspaper-blue mb-6">ಸಿಸ್ಟಮ್ ಪರೀಕ್ಷೆ</h1>
        
        {/* Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">ಸಿಸ್ಟಮ್ ಸ್ಥಿತಿ</h2>
          <div className="space-y-2">
            <p className="text-sm">localStorage: {status}</p>
            <p className="text-sm">PDF.js Worker: {pdfWorkerStatus}</p>
            <p className="text-sm">ಉಳಿಸಿದ ಪತ್ರಿಕೆಗಳು: {newspapers.length}</p>
          </div>
        </div>

        {/* PDF Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">PDF ಪರೀಕ್ಷೆ</h2>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files[0] && testPDFUpload(e.target.files[0])}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {status && (
            <div className="p-3 bg-gray-100 rounded text-sm">
              {status}
            </div>
          )}
        </div>

        {/* Saved Newspapers */}
        {newspapers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">ಉಳಿಸಿದ ಪತ್ರಿಕೆಗಳು</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newspapers.map((newspaper) => (
                <div key={newspaper.id} className="border rounded-lg p-4">
                  <img
                    src={newspaper.previewImage}
                    alt={newspaper.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-medium text-sm truncate">{newspaper.name}</h3>
                  <p className="text-xs text-gray-600">
                    {new Date(newspaper.date).toLocaleDateString('kn-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;