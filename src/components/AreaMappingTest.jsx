import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const AreaMappingTest = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [selectedNewspaper, setSelectedNewspaper] = useState(null);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    loadNewspapers();
  }, []);

  const loadNewspapers = async () => {
    try {
      const data = await apiService.getNewspapers();
      setNewspapers(data);
      console.log('Loaded newspapers for testing:', data.length);
    } catch (error) {
      console.error('Error loading newspapers:', error);
    }
  };

  const testAreaMapping = async (newspaper) => {
    const results = [];
    
    // Test 1: Check if newspaper has areas
    const hasAreas = newspaper.clickableAreas && newspaper.clickableAreas.length > 0;
    results.push({
      test: 'Has Clickable Areas',
      result: hasAreas,
      details: `Found ${newspaper.clickableAreas?.length || 0} areas`
    });

    // Test 2: Check area structure
    if (hasAreas) {
      const validAreas = newspaper.clickableAreas.filter(area => 
        area.x !== undefined && 
        area.y !== undefined && 
        area.width !== undefined && 
        area.height !== undefined &&
        area.title && 
        area.content
      );
      
      results.push({
        test: 'Valid Area Structure',
        result: validAreas.length === newspaper.clickableAreas.length,
        details: `${validAreas.length}/${newspaper.clickableAreas.length} areas have valid structure`
      });
    }

    // Test 3: Check image URL accessibility
    const imageUrl = newspaper.imageUrl || newspaper.previewImage;
    const imageAccessible = await testImageAccess(imageUrl);
    results.push({
      test: 'Image Accessible',
      result: imageAccessible,
      details: `Image URL: ${imageUrl}`
    });

    // Test 4: Test backend save/retrieve
    if (hasAreas) {
      try {
        const testArea = {
          id: Date.now(),
          x: 100,
          y: 100,
          width: 50,
          height: 50,
          title: 'Test Area',
          content: 'Test Content',
          pageNumber: 1
        };
        
        const updatedAreas = [...newspaper.clickableAreas, testArea];
        await apiService.updateClickableAreas(newspaper._id || newspaper.id, updatedAreas);
        
        // Retrieve and verify
        const retrieved = await apiService.getNewspaper(newspaper._id || newspaper.id);
        const hasTestArea = retrieved.clickableAreas.some(area => area.title === 'Test Area');
        
        results.push({
          test: 'Backend Save/Retrieve',
          result: hasTestArea,
          details: hasTestArea ? 'Test area saved and retrieved successfully' : 'Failed to save/retrieve test area'
        });
        
        // Clean up test area
        await apiService.updateClickableAreas(newspaper._id || newspaper.id, newspaper.clickableAreas);
        
      } catch (error) {
        results.push({
          test: 'Backend Save/Retrieve',
          result: false,
          details: `Error: ${error.message}`
        });
      }
    }

    setTestResults(results);
  };

  const testImageAccess = (imageUrl) => {
    return new Promise((resolve) => {
      if (!imageUrl) {
        resolve(false);
        return;
      }
      
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      
      // Handle relative URLs
      if (imageUrl.startsWith('/uploads/')) {
        img.src = `http://localhost:3001${imageUrl}`;
      } else {
        img.src = imageUrl;
      }
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-newspaper-blue mb-4">Area Mapping Test</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Newspaper to Test:
        </label>
        <select
          value={selectedNewspaper?._id || selectedNewspaper?.id || ''}
          onChange={(e) => {
            const newspaper = newspapers.find(n => (n._id || n.id) === e.target.value);
            setSelectedNewspaper(newspaper);
            setTestResults([]);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
        >
          <option value="">Select a newspaper...</option>
          {newspapers.map((newspaper) => (
            <option key={newspaper._id || newspaper.id} value={newspaper._id || newspaper.id}>
              {newspaper.name} - {new Date(newspaper.date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {selectedNewspaper && (
        <div className="mb-6">
          <button
            onClick={() => testAreaMapping(selectedNewspaper)}
            className="bg-newspaper-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Run Area Mapping Test
          </button>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Test Results:</h3>
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.result 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{result.test}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  result.result 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {result.result ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <p className="text-sm mt-1">{result.details}</p>
            </div>
          ))}
        </div>
      )}

      {selectedNewspaper && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Newspaper Details:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Name:</strong> {selectedNewspaper.name}</p>
            <p><strong>Date:</strong> {new Date(selectedNewspaper.date).toLocaleDateString()}</p>
            <p><strong>Areas:</strong> {selectedNewspaper.clickableAreas?.length || 0}</p>
            <p><strong>Image URL:</strong> {selectedNewspaper.imageUrl || 'None'}</p>
            <p><strong>PDF URL:</strong> {selectedNewspaper.pdfUrl || 'None'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaMappingTest;