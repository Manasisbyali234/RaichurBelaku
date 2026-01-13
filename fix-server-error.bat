@echo off
echo ಸರ್ವರ್ ದೋಷ ಸರಿಪಡಿಸುವುದು... (Fixing server error...)
echo.

REM Kill any existing processes on port 3001
echo Stopping any existing servers...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Navigate to project directory
cd /d "%~dp0"

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing main dependencies...
    npm install
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

REM Start the simple backend server (no MongoDB required)
echo Starting simple backend server...
start "Backend Server" cmd /k "cd backend && node simple-server.js"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo ✓ ಸರ್ವರ್ ಪ್ರಾರಂಭವಾಗಿದೆ! (Server started!)
echo ✓ Frontend: http://localhost:5173
echo ✓ Backend: http://localhost:3001
echo.
echo ಬ್ರೌಸರ್‌ನಲ್ಲಿ http://localhost:5173 ತೆರೆಯಿರಿ
echo (Open http://localhost:5173 in your browser)
echo.
pause