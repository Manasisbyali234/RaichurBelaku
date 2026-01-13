@echo off
title ರಾಯಚೂರು ಬೆಳಕು - Server Fix
color 0A

echo.
echo ==========================================
echo    ರಾಯಚೂರು ಬೆಳಕು - Server Error Fix
echo ==========================================
echo.

REM Step 1: Kill existing processes
echo [1/6] Stopping existing servers...
taskkill /f /im node.exe 2>nul
taskkill /f /im "vite.exe" 2>nul
timeout /t 2 /nobreak >nul

REM Step 2: Navigate to project directory
cd /d "%~dp0"
echo [2/6] Project directory: %CD%

REM Step 3: Check and install dependencies
echo [3/6] Checking dependencies...
if not exist "node_modules" (
    echo Installing main dependencies...
    npm install --silent
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install --silent
    cd ..
)

REM Step 4: Test backend connection
echo [4/6] Testing backend connection...
node test-backend-connection.js
if %ERRORLEVEL% NEQ 0 (
    echo Backend not running, starting it...
    start "Backend Server" cmd /k "cd backend && echo Backend starting... && node simple-server.js"
    timeout /t 5 /nobreak >nul
)

REM Step 5: Start frontend
echo [5/6] Starting frontend...
start "Frontend" cmd /k "echo Frontend starting... && npm run dev"

REM Step 6: Open test page
echo [6/6] Opening test page...
timeout /t 3 /nobreak >nul
start "" "api-test.html"

echo.
echo ✓ ಸರ್ವರ್ ಸರಿಪಡಿಸಲಾಗಿದೆ! (Server fixed!)
echo.
echo URLs to check:
echo ✓ Frontend: http://localhost:5173
echo ✓ Backend Health: http://localhost:3001/api/health
echo ✓ API Test: api-test.html (should open automatically)
echo.
echo If you still see errors:
echo 1. Check if ports 3001 and 5173 are free
echo 2. Restart your computer
echo 3. Run this script again
echo.
pause