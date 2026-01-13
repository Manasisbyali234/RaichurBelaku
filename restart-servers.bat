@echo off
echo ಸರ್ವರ್ ಮರುಪ್ರಾರಂಭ... (Restarting servers...)

REM Kill existing processes
taskkill /f /pid 4068 2>nul
taskkill /f /pid 14716 2>nul
timeout /t 2 /nobreak >nul

REM Start backend
echo Starting backend...
start "Backend" cmd /k "cd backend && node simple-server.js"
timeout /t 3 /nobreak >nul

REM Start frontend  
echo Starting frontend...
start "Frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo ✓ ಸರ್ವರ್‌ಗಳು ಮರುಪ್ರಾರಂಭವಾಗಿವೆ! (Servers restarted!)
echo ✓ Frontend: http://localhost:5173
echo ✓ Backend: http://localhost:3001

REM Open browser
start "" "http://localhost:5173"

pause