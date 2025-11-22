import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-newspaper-blue text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-newspaper-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold">ರ</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">ರಾಯಚೂರು ಬೆಳಕು</h3>
                <p className="text-sm opacity-80">Raichuru Belku</p>
              </div>
            </div>
            <p className="text-sm opacity-80">
              ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಪತ್ರಿಕೆ
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">ಲಿಂಕ್‌ಗಳು</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                ಮುಖ್ಯ ಪುಟ
              </Link>
              <Link to="/today" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                ಇಂದಿನ ಪತ್ರಿಕೆ
              </Link>
              <Link to="/archive" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">ಸಂಪರ್ಕ</h4>
            <div className="space-y-2 text-sm opacity-80">
              <p>📧 info@raichurubelku.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 ರಾಯಚೂರು, ಕರ್ನಾಟಕ</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-600 mt-8 pt-6 text-center">
          <p className="text-sm opacity-80">
            © 2024 ರಾಯಚೂರು ಬೆಳಕು. ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;