import React, { useState, useEffect } from 'react';
import { isSupabaseAvailable } from '../utils/supabaseStorage';

const SupabaseDebug = () => {
  const [status, setStatus] = useState({});

  useEffect(() => {
    const checkStatus = () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY;
      
      setStatus({
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlValid: supabaseUrl && !supabaseUrl.includes('your-project-id'),
        keyValid: supabaseKey && !supabaseKey.includes('your-anon-key'),
        supabaseAvailable: isSupabaseAvailable(),
        url: supabaseUrl,
        keyPreview: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'Not set'
      });
    };

    checkStatus();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-newspaper-blue mb-4">Supabase Configuration Debug</h3>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-3 ${status.hasUrl ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Supabase URL: {status.hasUrl ? 'Set' : 'Missing'}</span>
        </div>
        
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-3 ${status.hasKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Supabase Key: {status.hasKey ? 'Set' : 'Missing'}</span>
        </div>
        
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-3 ${status.urlValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>URL Valid: {status.urlValid ? 'Yes' : 'No (contains placeholder)'}</span>
        </div>
        
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-3 ${status.keyValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Key Valid: {status.keyValid ? 'Yes' : 'No (contains placeholder)'}</span>
        </div>
        
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-3 ${status.supabaseAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Supabase Available: {status.supabaseAvailable ? 'Yes' : 'No'}</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>URL:</strong> {status.url || 'Not set'}</p>
        <p><strong>Key Preview:</strong> {status.keyPreview}</p>
      </div>
      
      {!status.supabaseAvailable && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 text-sm">
            <strong>Issue:</strong> Supabase not properly configured. 
            Check environment variables in Netlify dashboard.
          </p>
        </div>
      )}
      
      {status.supabaseAvailable && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-700 text-sm">
            <strong>Success:</strong> Supabase is configured. 
            If PDFs still not accessible, check Storage bucket policies.
          </p>
        </div>
      )}
    </div>
  );
};

export default SupabaseDebug;