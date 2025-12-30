import React, { useState } from 'react';

const PDFLinkTest = ({ pdfUrl }) => {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testPDFAccess = async () => {
    if (!pdfUrl) {
      setTestResult('No PDF URL provided');
      return;
    }

    setTesting(true);
    try {
      const response = await fetch(pdfUrl, { method: 'HEAD' });
      if (response.ok) {
        setTestResult('✅ PDF accessible');
      } else {
        setTestResult(`❌ Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`❌ Network error: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  if (!pdfUrl) return null;

  return (
    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">PDF Link Test:</span>
        <button
          onClick={testPDFAccess}
          disabled={testing}
          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Test Access'}
        </button>
      </div>
      {testResult && (
        <div className="mt-1 text-xs">
          {testResult}
        </div>
      )}
      <div className="mt-1 text-xs text-gray-500 break-all">
        URL: {pdfUrl}
      </div>
    </div>
  );
};

export default PDFLinkTest;