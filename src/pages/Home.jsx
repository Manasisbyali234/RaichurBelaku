import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import ClickableAreasDemo from '../components/ClickableAreasDemo';

const Home = () => {
  const [todaysNewspaper, setTodaysNewspaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return '/logo.jpg';
    
    // If it's already a full URL or base64, return as is
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    // If it's a relative path, prepend backend URL
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:3001${imageUrl}`;
    }
    
    return imageUrl;
  };
  
  useEffect(() => {
    const loadTodaysNewspaper = async () => {
      try {
        setLoading(true);
        setError(null);
        const newspaper = await apiService.getTodayNewspaper();
        console.log('Loading today\'s newspaper:', newspaper);
        setTodaysNewspaper(newspaper);
      } catch (err) {
        console.error('Error loading today\'s newspaper:', err);
        setError(err.message || 'Failed to load newspaper');
      } finally {
        setLoading(false);
      }
    };
    
    loadTodaysNewspaper();
    
    // Refresh every 30 seconds to catch new publications
    const interval = setInterval(loadTodaysNewspaper, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-newspaper-blue to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <img 
              src="/logo.jpg" 
              alt="ರಾಯಚೂರು ಬೆಳಕು Logo" 
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">ರಾಯಚೂರು ಬೆಳಕು</h1>
            <p className="text-xl md:text-2xl mb-2">Raichuru Belku</p>
            <p className="text-lg opacity-90 mb-8">ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಪತ್ರಿಕೆ</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/today"
                className="bg-white text-newspaper-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                ಇಂದಿನ ಪತ್ರಿಕೆ ಓದಿ
              </Link>
              <Link
                to="/archive"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-newspaper-blue transition-colors"
              >
                ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು ನೋಡಿ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Newspaper Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">ಇಂದಿನ ಮುಖ್ಯ ಸುದ್ದಿಗಳು</h2>
          <div className="w-24 h-1 bg-newspaper-red mx-auto mb-4"></div>
          <button
            onClick={async () => {
              try {
                setLoading(true);
                setError(null);
                const newspaper = await apiService.getTodayNewspaper();
                console.log('Manual refresh - today\'s newspaper:', newspaper);
                setTodaysNewspaper(newspaper);
              } catch (err) {
                console.error('Error refreshing newspaper:', err);
                setError(err.message || 'Failed to refresh');
              } finally {
                setLoading(false);
              }
            }}
            className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'ರಿಫ್ರೆಶ್ ಮಾಡಿ'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-700 text-sm">ದೋಷ: {error}</p>
            </div>
          </div>
        )}

        {loading && !todaysNewspaper ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-newspaper-blue mx-auto mb-4"></div>
            <p className="text-gray-600">ಲೋಡ್ ಆಗುತ್ತಿದೆ...</p>
          </div>
        ) : todaysNewspaper ? (
          <div className="space-y-8">
            {/* Main Newspaper Display */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex newspaper-preview">
                <div className="md:w-1/2">
                  <img
                    src={getFullImageUrl(todaysNewspaper.previewImage || todaysNewspaper.imageUrl)}
                    alt="Today's newspaper"
                    className="w-full h-64 md:h-96 object-contain bg-gray-50"
                    onError={(e) => { e.target.src = '/logo.jpg'; }}
                  />
                </div>
                <div className="md:w-1/2 p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-newspaper-red rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">
                      {new Date(todaysNewspaper.date).toLocaleDateString('kn-IN')}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">ಇಂದಿನ ಆವೃತ್ತಿ</h3>
                  <p className="text-gray-600 mb-6 text-sm md:text-base">
                    ಇಂದಿನ ಎಲ್ಲಾ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು, ಸ್ಥಳೀಯ ಮಾಹಿತಿ ಮತ್ತು ವಿಶೇಷ ಲೇಖನಗಳನ್ನು ಓದಿ. 
                    ಪ್ರತಿ ಸುದ್ದಿಯನ್ನು ವಿವರವಾಗಿ ತಿಳಿಯಲು ಪತ್ರಿಕೆಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/today"
                      className="inline-flex items-center justify-center bg-newspaper-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      ಪತ್ರಿಕೆ ಓದಿ
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    {todaysNewspaper.pdfUrl && (
                      <a
                        href={getFullImageUrl(todaysNewspaper.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center border-2 border-newspaper-blue text-newspaper-blue px-6 py-3 rounded-lg hover:bg-newspaper-blue hover:text-white transition-colors font-medium"
                      >
                        PDF ಡೌನ್‌ಲೋಡ್
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* News Headlines Grid */}
            <TodaysHeadlines newspaper={todaysNewspaper} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">ಇಂದಿನ ಪತ್ರಿಕೆ ಇನ್ನೂ ಪ್ರಕಟವಾಗಿಲ್ಲ</h3>
            <p className="text-gray-600">ದಯವಿಟ್ಟು ನಂತರ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಹಿಂದಿನ ಆವೃತ್ತಿಗಳನ್ನು ಆರ್ಕೈವ್‌ನಲ್ಲಿ ನೋಡಿ</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">ನಮ್ಮ ವೈಶಿಷ್ಟ್ಯಗಳು</h2>
            <div className="w-16 sm:w-24 h-1 bg-newspaper-red mx-auto"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-newspaper-blue rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">ಡಿಜಿಟಲ್ ಪತ್ರಿಕೆ</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">ಸಂಪೂರ್ಣ ಡಿಜಿಟಲ್ ಅನುಭವದೊಂದಿಗೆ ಪತ್ರಿಕೆ ಓದಿ</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-newspaper-red rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಓದುವಿಕೆ</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">ಪ್ರತಿ ಸುದ್ದಿಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ವಿವರವಾಗಿ ಓದಿ</p>
            </div>
            
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-newspaper-blue rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">ಹಿಂದಿನ ಎಲ್ಲಾ ಆವೃತ್ತಿಗಳನ್ನು ಸುಲಭವಾಗಿ ಪ್ರವೇಶಿಸಿ</p>
            </div>
          </div>
          
          {/* Demo Section */}
          <div className="mt-12">
            <ClickableAreasDemo />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">ರಾಯಚೂರು ಬೆಳಕು ಬಗ್ಗೆ</h2>
          <p className="text-sm sm:text-lg text-gray-700 leading-relaxed px-4">
            ರಾಯಚೂರು ಬೆಳಕು ಒಂದು ಆಧುನಿಕ ಡಿಜಿಟಲ್ ಪತ್ರಿಕೆಯಾಗಿದ್ದು, ಸ್ಥಳೀಯ ಸುದ್ದಿಗಳು, 
            ರಾಜ್ಯ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಮಾಹಿತಿಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ನಿಮಗೆ ತಲುಪಿಸುತ್ತದೆ. 
            ನಮ್ಮ ಗುರಿ ಸತ್ಯವಾದ, ನಿಖರವಾದ ಮತ್ತು ಸಮಯೋಚಿತ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುವುದು.
          </p>
        </div>
      </div>
    </div>
  );
};

// Component to display today's news headlines
const TodaysHeadlines = ({ newspaper }) => {
  const [areas, setAreas] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    try {
      if (newspaper && newspaper.clickableAreas) {
        // Filter areas that have titles (actual news)
        const newsAreas = newspaper.clickableAreas.filter(area => 
          area && area.title && area.title.trim()
        );
        setAreas(newsAreas);
        setError(null);
      } else {
        setAreas([]);
      }
    } catch (err) {
      console.error('Error processing news areas:', err);
      setError(err.message);
      setAreas([]);
    }
  }, [newspaper]);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600">
          <p>ಸುದ್ದಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ: {error}</p>
        </div>
      </div>
    );
  }

  if (areas.length === 0) {
    return null;
  }

  const displayedAreas = showAll ? areas : areas.slice(0, 6);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">ಇಂದಿನ ಮುಖ್ಯ ಸುದ್ದಿಗಳು</h3>
          <p className="text-sm text-gray-600 mt-1">ಒಟ್ಟು {areas.length} ಸುದ್ದಿಗಳು</p>
        </div>
        <Link
          to="/today"
          className="text-newspaper-blue hover:text-blue-700 text-sm font-medium"
        >
          ಪತ್ರಿಕೆಯಲ್ಲಿ ಓದಿ →
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedAreas.map((area, index) => (
          <div key={area.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-newspaper-red rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                  {area.title}
                </h4>
                {area.content && (
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {area.content.length > 100 ? `${area.content.substring(0, 100)}...` : area.content}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-newspaper-blue font-medium">
                    ವಿವರಗಳಿಗೆ ಪತ್ರಿಕೆ ನೋಡಿ
                  </span>
                  <span className="text-xs text-gray-400">
                    #{index + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {areas.length > 6 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center bg-newspaper-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            {showAll ? 'ಕಡಿಮೆ ತೋರಿಸಿ' : `ಎಲ್ಲಾ ${areas.length} ಸುದ್ದಿಗಳು ತೋರಿಸಿ`}
            <svg className={`w-4 h-4 ml-2 transition-transform ${showAll ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Link
            to="/today"
            className="inline-flex items-center border-2 border-newspaper-blue text-newspaper-blue px-6 py-2 rounded-lg hover:bg-newspaper-blue hover:text-white transition-colors"
          >
            ಪತ್ರಿಕೆಯಲ್ಲಿ ಓದಿ
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;