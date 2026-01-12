import React, { useState } from 'react';

const SimpleUploadTest = () => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSimpleUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Testing simple upload:', file.name);
      
      // Create minimal FormData
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('name', file.name.replace('.pdf', ''));
      formData.append('date', new Date().toISOString());
      formData.append('imageUrl', '');
      formData.append('width', '800');
      formData.append('height', '1200');
      
      // Direct fetch to backend
      const response = await fetch('http://localhost:3001/api/newspapers', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
        console.log('Simple upload successful:', data);
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('Simple upload error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-newspaper-blue mb-4">Simple Upload Test</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleSimpleUpload(e.target.files[0])}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-newspaper-blue file:text-white hover:file:bg-blue-700"
        />
      </div>
      
      {uploading && (
        <div className="text-blue-600 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 inline-block mr-2"></div>
          Uploading...
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-red-800 font-medium mb-2">Error:</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-medium mb-2">Success!</h3>
          <pre className="text-green-700 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SimpleUploadTest;