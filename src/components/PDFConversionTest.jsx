import React, { useState } from 'react';
import { convertPDFToImage } from '../utils/pdfUtils';

const PDFConversionTest = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConversion = async (file) => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Testing PDF conversion for:', file.name);
      const conversionResult = await convertPDFToImage(file);
      console.log('Conversion successful:', conversionResult);
      setResult(conversionResult);
    } catch (err) {
      console.error('Conversion failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-newspaper-blue mb-3">PDF Conversion Test</h3>
      
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => testConversion(e.target.files[0])}
        className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-newspaper-blue file:text-white hover:file:bg-blue-700"
      />
      
      {loading && (
        <div className="text-blue-600">Converting PDF...</div>
      )}
      
      {error && (
        <div className="text-red-600 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="space-y-3">
          <div className="text-green-600">
            <strong>✓ Conversion successful!</strong>
          </div>
          <div className="text-sm space-y-1">
            <div>Width: {result.width}px</div>
            <div>Height: {result.height}px</div>
            <div>Image URL: {result.imageUrl ? 'Generated ✓' : 'Missing ❌'}</div>
          </div>
          {result.imageUrl && (
            <div>
              <strong>Preview:</strong>
              <img 
                src={result.imageUrl} 
                alt="PDF Preview" 
                className="mt-2 max-w-xs border rounded"
                style={{ maxHeight: '200px' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFConversionTest;