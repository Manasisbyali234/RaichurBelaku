import React, { useState } from 'react';
import { convertAllPDFPagesToImages, savePDFFile } from '../utils/pdfUtils';
import { saveNewspaper } from '../utils/localStorage';

const AdminUploadPDF = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedNewspaper, setUploadedNewspaper] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ PDF ಫೈಲ್ ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಿ');
      return;
    }

    setUploading(true);
    try {
      const [pagesData, pdfData] = await Promise.all([
        convertAllPDFPagesToImages(file),
        savePDFFile(file)
      ]);

      const newspaper = {
        id: Date.now().toString(),
        name: file.name,
        date: new Date().toISOString(),
        pdfData,
        pages: pagesData.pages,
        totalPages: pagesData.totalPages,
        previewImage: pagesData.previewImage,
        width: pagesData.width,
        height: pagesData.height
      };

      setUploadedNewspaper(newspaper);
      setCurrentPage(0);
      alert('PDF ಯಶಸ್ವಿಯಾಗಿ ಅಪ್ಲೋಡ್ ಆಗಿದೆ!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('PDF ಅಪ್ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveNewspaper = () => {
    if (uploadedNewspaper) {
      saveNewspaper(uploadedNewspaper);
      onUploadSuccess(uploadedNewspaper);
      setUploadedNewspaper(null);
      setCurrentPage(0);
    }
  };

  const nextPage = () => {
    if (currentPage < uploadedNewspaper.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-newspaper-blue mb-4">PDF ಅಪ್ಲೋಡ್ ಮಾಡಿ</h2>
      
      {!uploadedNewspaper ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-newspaper-blue bg-blue-50' 
              : 'border-gray-300 hover:border-newspaper-blue'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-newspaper-blue mb-4"></div>
              <p className="text-gray-600">PDF ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 mb-2">PDF ಫೈಲ್ ಅನ್ನು ಇಲ್ಲಿ ಡ್ರ್ಯಾಗ್ ಮಾಡಿ</p>
              <p className="text-sm text-gray-500 mb-4">ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ ಆಯ್ಕೆ ಮಾಡಿ</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="bg-newspaper-blue text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ
              </label>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{uploadedNewspaper.name}</h3>
            <div className="text-sm text-gray-600">
              ಪುಟ {currentPage + 1} / {uploadedNewspaper.totalPages}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 mb-4">
            <img
              src={uploadedNewspaper.pages[currentPage].imageUrl}
              alt={`Page ${currentPage + 1}`}
              className="max-w-full h-auto mx-auto"
              style={{ maxHeight: '600px' }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← ಹಿಂದಿನ ಪುಟ
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setUploadedNewspaper(null);
                  setCurrentPage(0);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                ರದ್ದುಮಾಡಿ
              </button>
              <button
                onClick={handleSaveNewspaper}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                ಉಳಿಸಿ
              </button>
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === uploadedNewspaper.totalPages - 1}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ಮುಂದಿನ ಪುಟ →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploadPDF;