import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const PDFTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testPDFConversion = async (file) => {
    setLoading(true);
    setResult('Starting PDF test...');
    
    try {
      console.log('Testing PDF:', file.name, file.size, file.type);
      setResult(prev => prev + `\nFile: ${file.name}, Size: ${file.size}, Type: ${file.type}`);
      
      // Test 1: Read as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      console.log('ArrayBuffer created:', arrayBuffer.byteLength);
      setResult(prev => prev + `\nArrayBuffer: ${arrayBuffer.byteLength} bytes`);
      
      // Test 2: Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log('PDF loaded:', pdf.numPages, 'pages');
      setResult(prev => prev + `\nPDF loaded: ${pdf.numPages} pages`);
      
      // Test 3: Get first page
      const page = await pdf.getPage(1);
      console.log('Page loaded');
      setResult(prev => prev + `\nPage 1 loaded`);
      
      // Test 4: Create viewport
      const viewport = page.getViewport({ scale: 1.0 });
      console.log('Viewport:', viewport.width, 'x', viewport.height);
      setResult(prev => prev + `\nViewport: ${viewport.width}x${viewport.height}`);
      
      // Test 5: Create canvas and render
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: ctx, viewport }).promise;
      console.log('Page rendered');
      setResult(prev => prev + `\nPage rendered successfully`);
      
      // Test 6: Convert to image
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Image data length:', imageData.length);
      setResult(prev => prev + `\nImage data: ${imageData.length} chars`);
      setResult(prev => prev + `\nSUCCESS: PDF converted to image!`);
      
      // Show preview
      const img = document.createElement('img');
      img.src = imageData;
      img.style.maxWidth = '300px';
      img.style.border = '1px solid #ccc';
      document.getElementById('preview').innerHTML = '';
      document.getElementById('preview').appendChild(img);
      
    } catch (error) {
      console.error('PDF test error:', error);
      setResult(prev => prev + `\nERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      testPDFConversion(file);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">PDF.js Test</h3>
      
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="mb-4 block"
      />
      
      {loading && <div className="text-blue-600">Testing PDF...</div>}
      
      <div className="bg-gray-100 p-3 rounded text-sm font-mono whitespace-pre-wrap mb-4">
        {result || 'Select a PDF file to test...'}
      </div>
      
      <div id="preview" className="border border-gray-300 p-2 rounded min-h-[100px]">
        Preview will appear here...
      </div>
    </div>
  );
};

export default PDFTest;