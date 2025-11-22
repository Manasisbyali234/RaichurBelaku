import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-lg border-b-4 border-newspaper-blue">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-newspaper-red rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">ರ</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-newspaper-blue">ರಾಯಚೂರು ಬೆಳಕು</h1>
              <p className="text-sm text-gray-600">Raichuru Belku</p>
            </div>
          </Link>
          
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಮುಖ್ಯ ಪುಟ
            </Link>
            <Link 
              to="/today" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/today') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಇಂದಿನ ಪತ್ರಿಕೆ
            </Link>
            <Link 
              to="/archive" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/archive') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು
            </Link>
            <Link 
              to="/admin" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/admin') 
                  ? 'bg-newspaper-red text-white' 
                  : 'text-newspaper-red hover:bg-red-50'
              }`}
            >
              ಆಡಳಿತ
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;