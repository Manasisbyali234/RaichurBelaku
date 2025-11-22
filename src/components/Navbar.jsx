import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-lg border-b-4 border-newspaper-blue">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-newspaper-red rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">ರ</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-newspaper-blue">ರಾಯಚೂರು ಬೆಳಕು</h1>
              <p className="text-xs sm:text-sm text-gray-600">Raichuru Belku</p>
            </div>
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-newspaper-blue hover:bg-blue-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-2 lg:space-x-6">
            <Link 
              to="/" 
              className={`px-2 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
                isActive('/') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಮುಖ್ಯ ಪುಟ
            </Link>
            <Link 
              to="/today" 
              className={`px-2 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
                isActive('/today') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಇಂದಿನ ಪತ್ರಿಕೆ
            </Link>
            <Link 
              to="/archive" 
              className={`px-2 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
                isActive('/archive') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು
            </Link>
            <Link 
              to="/admin" 
              className={`px-2 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
                isActive('/admin') 
                  ? 'bg-newspaper-red text-white' 
                  : 'text-newspaper-red hover:bg-red-50'
              }`}
            >
              ಆಡಳಿತ
            </Link>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಮುಖ್ಯ ಪುಟ
            </Link>
            <Link 
              to="/today" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/today') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಇಂದಿನ ಪತ್ರಿಕೆ
            </Link>
            <Link 
              to="/archive" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/archive') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು
            </Link>
            <Link 
              to="/admin" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/admin') 
                  ? 'bg-newspaper-red text-white' 
                  : 'text-newspaper-red hover:bg-red-50'
              }`}
            >
              ಆಡಳಿತ
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;