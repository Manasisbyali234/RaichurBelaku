import React, { useState, useEffect } from 'react';
import AdminUploadPDF from '../components/AdminUploadPDF';
import PDFMapper from '../components/PDFMapper';
import AdminLogin from '../components/AdminLogin';
import { getNewspapers, publishToday, getTodaysNewspaper } from '../utils/localStorage';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentNewspaper, setCurrentNewspaper] = useState(null);
  const [newspapers, setNewspapers] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [todaysNewspaper, setTodaysNewspaper] = useState(null);

  useEffect(() => {
    const loadNewspapers = () => {
      const savedNewspapers = getNewspapers();
      setNewspapers(savedNewspapers);
      setTodaysNewspaper(getTodaysNewspaper());
      
      if (savedNewspapers.length > 0) {
        setCurrentNewspaper(savedNewspapers[savedNewspapers.length - 1]);
      }
    };
    
    loadNewspapers();
  }, []);

  const handleUploadSuccess = (newspaper) => {
    setCurrentNewspaper(newspaper);
    setNewspapers(prev => [...prev, newspaper]);
    setActiveTab('mapper');
  };

  const handleNewspaperSelect = (newspaper) => {
    setCurrentNewspaper(newspaper);
    setActiveTab('mapper');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handlePublishToday = (newspaperId) => {
    publishToday(newspaperId);
    setTodaysNewspaper(newspapers.find(n => n.id === newspaperId));
    alert('ಇಂದಿನ ಪತ್ರಿಕೆಯಾಗಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-newspaper-blue mb-2">ಆಡಳಿತ ಡ್ಯಾಶ್ಬೋರ್ಡ್</h1>
            <p className="text-gray-600">ಪತ್ರಿಕೆ ಅಪ್ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಕ್ಲಿಕ್ ಮಾಡಬಹುದಾದ ಪ್ರದೇಶಗಳನ್ನು ಸೇರಿಸಿ</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-newspaper-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            ಲಾಗ್ ಔಟ್
          </button>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-newspaper-blue text-newspaper-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                PDF ಅಪ್ಲೋಡ್
              </button>
              <button
                onClick={() => setActiveTab('mapper')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mapper'
                    ? 'border-newspaper-blue text-newspaper-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={!currentNewspaper}
              >
                ಪ್ರದೇಶ ಮ್ಯಾಪಿಂಗ್
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manage'
                    ? 'border-newspaper-blue text-newspaper-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ಪತ್ರಿಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ
              </button>
            </nav>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'upload' && (
            <AdminUploadPDF onUploadSuccess={handleUploadSuccess} />
          )}

          {activeTab === 'mapper' && (
            <div>
              {currentNewspaper ? (
                <PDFMapper newspaper={currentNewspaper} />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">ಯಾವುದೇ ಪತ್ರಿಕೆ ಆಯ್ಕೆಯಾಗಿಲ್ಲ</h3>
                  <p className="text-gray-600">ಮೊದಲು PDF ಅಪ್ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಪತ್ರಿಕೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-newspaper-blue mb-4">ಪತ್ರಿಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ</h2>
              
              {newspapers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">ಇನ್ನೂ ಯಾವುದೇ ಪತ್ರಿಕೆಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಲಾಗಿಲ್ಲ</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {newspapers.map((newspaper) => (
                    <div
                      key={newspaper.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        currentNewspaper?.id === newspaper.id
                          ? 'border-newspaper-blue bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleNewspaperSelect(newspaper)}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={newspaper.previewImage}
                          alt={newspaper.name}
                          className="w-16 h-20 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{newspaper.name}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(newspaper.date).toLocaleDateString('kn-IN')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ಗಾತ್ರ: {newspaper.width} × {newspaper.height}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {todaysNewspaper?.id === newspaper.id && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                              ಇಂದಿನ ಪತ್ರಿಕೆ
                            </span>
                          )}
                          {currentNewspaper?.id === newspaper.id && (
                            <span className="bg-newspaper-blue text-white text-xs px-2 py-1 rounded">
                              ಆಯ್ಕೆಯಾಗಿದೆ
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublishToday(newspaper.id);
                            }}
                            className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700"
                          >
                            ಪ್ರಕಟಿಸಿ
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNewspaperSelect(newspaper);
                              setActiveTab('mapper');
                            }}
                            className="text-newspaper-blue hover:text-blue-700 text-sm"
                          >
                            ಸಂಪಾದಿಸಿ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;