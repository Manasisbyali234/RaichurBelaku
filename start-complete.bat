@echo off
echo ==========================================
echo   Raichur Belaku - Complete Startup
echo ==========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ==========================================
echo   Servers Starting...
echo   Backend: http://localhost:3001
echo   Frontend: http://localhost:5173
echo ==========================================
echo.
echo Press any key to exit...
pause > nul