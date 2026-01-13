@echo off
echo ರಾಯಚೂರು ಬೆಳಕು ಅಪ್ಲಿಕೇಶನ್ ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ... (Starting Raichuru Belaku Application...)
echo.

cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ದೋಷ: Node.js ಇನ್ಸ್ಟಾಲ್ ಮಾಡಲಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು Node.js ಇನ್ಸ್ಟಾಲ್ ಮಾಡಿ.
    echo Error: Node.js is not installed. Please install Node.js.
    pause
    exit /b 1
)

REM Install frontend dependencies if needed
if not exist node_modules (
    echo ಫ್ರಂಟೆಂಡ್ ಡಿಪೆಂಡೆನ್ಸಿಗಳನ್ನು ಇನ್ಸ್ಟಾಲ್ ಮಾಡಲಾಗುತ್ತಿದೆ... (Installing frontend dependencies...)
    npm install
)

REM Install backend dependencies if needed
cd backend
if not exist node_modules (
    echo ಬ್ಯಾಕೆಂಡ್ ಡಿಪೆಂಡೆನ್ಸಿಗಳನ್ನು ಇನ್ಸ್ಟಾಲ್ ಮಾಡಲಾಗುತ್ತಿದೆ... (Installing backend dependencies...)
    npm install
)
cd ..

echo.
echo ಸರ್ವರ್ ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ... (Starting servers...)
echo.
echo ಬ್ಯಾಕೆಂಡ್: http://localhost:3001
echo ಫ್ರಂಟೆಂಡ್: http://localhost:5173
echo.
echo ಸರ್ವರ್ ಬಂದ ನಂತರ ಬ್ರೌಸರ್‌ನಲ್ಲಿ http://localhost:5173 ಗೆ ಭೇಟಿ ನೀಡಿ
echo After servers start, visit http://localhost:5173 in your browser
echo.

REM Start both servers using concurrently
npm run start:all

pause