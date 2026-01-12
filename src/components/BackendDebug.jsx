import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const BackendDebug = () => {
  const [status, setStatus] = useState('checking...');
  const [newspapers, setNewspapers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      setStatus('connecting...');
      const response = await fetch('http://localhost:3001/api/newspapers');
      
      if (response.ok) {
        setStatus('connected ✅');
        const data = await response.json();
        setNewspapers(data);
        setError(null);
      } else {
        setStatus('backend error ❌');
        setError(`HTTP ${response.status}`);
      }
    } catch (err) {
      setStatus('backend offline ❌');
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold text-newspaper-blue mb-3">Backend Status</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Connection:</strong> {status}
        </div>
        
        {error && (
          <div className="text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div>
          <strong>Newspapers in DB:</strong> {newspapers.length}
        </div>
        
        {newspapers.length > 0 && (
          <div className="mt-3">
            <h4 className="font-medium mb-2">Recent uploads:</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {newspapers.slice(0, 5).map((newspaper) => (
                <div key={newspaper._id || newspaper.id} className="text-sm bg-gray-50 p-2 rounded">
                  <div><strong>{newspaper.name}</strong></div>
                  <div className="text-gray-600">
                    {new Date(newspaper.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    PDF: {newspaper.pdfUrl ? '✅' : '❌'} | 
                    Image: {newspaper.imageUrl ? '✅' : '❌'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          onClick={checkBackend}
          className="bg-newspaper-blue text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default BackendDebug;