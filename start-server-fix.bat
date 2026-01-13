@echo off
echo ಸರ್ವರ್ ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ... (Starting server...)
echo.

cd /d "%~dp0"

echo ಬ್ಯಾಕೆಂಡ್ ಡಿಪೆಂಡೆನ್ಸಿಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ... (Checking backend dependencies...)
cd backend
if not exist node_modules (
    echo ಡಿಪೆಂಡೆನ್ಸಿಗಳನ್ನು ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಲಾಗುತ್ತಿದೆ... (Installing dependencies...)
    npm install
)

echo.
echo ಸರ್ವರ್ ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ... (Starting server...)
echo ಸರ್ವರ್ ಬಂದ ನಂತರ http://localhost:3001/api/health ಗೆ ಭೇಟಿ ನೀಡಿ
echo.
node simple-server.js

pause