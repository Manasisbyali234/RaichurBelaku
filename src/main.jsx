import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h2 style="color: #B91C1C;">ಅಪ್ಲಿಕೇಶನ್ ಲೋಡ್ ಆಗಲಿಲ್ಲ</h2>
      <p>ದಯವಿಟ್ಟು ಪುಟವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background: #1E40AF; color: white; border: none; border-radius: 5px; cursor: pointer;">
        ರಿಲೋಡ್ ಮಾಡಿ
      </button>
    </div>
  `;
}