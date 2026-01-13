import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function SimpleHome() {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          ರಾಯಚೂರು ಬೆಳಕು
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          ಡಿಜಿಟಲ್ ಪತ್ರಿಕೆ
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">ಸ್ವಾಗತ</h2>
          <p className="text-gray-600">
            ಈ ಪುಟ ಸದ್ಯ ಅಭಿವೃದ್ಧಿ ಹಂತದಲ್ಲಿದೆ
          </p>
        </div>
      </div>
    </div>
  );
}

function SimpleApp() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<SimpleHome />} />
      </Routes>
    </Router>
  );
}

export default SimpleApp;