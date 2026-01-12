@echo off
title Raichuru Belaku - Digital Newspaper
color 0A

echo.
echo ==========================================
echo    ರಾಯಚೂರು ಬೆಳಕು - Raichuru Belaku
echo    Digital Newspaper Application
echo ==========================================
echo.

echo [INFO] Checking if dependencies are installed...

if not exist "node_modules" (
    echo [WARNING] Frontend dependencies not found. Installing...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

if not exist "backend\node_modules" (
    echo [WARNING] Backend dependencies not found. Installing...
    cd backend
    call npm install
    cd ..
    if errorlevel 1 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
)

echo [INFO] Dependencies check complete.
echo.

echo ==========================================
echo           Starting Application
echo ==========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.
echo Admin Login:
echo Username: admin
echo Password: admin123
echo.
echo Press Ctrl+C to stop both servers
echo ==========================================
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "npm run dev"

echo.
echo [INFO] Both servers are starting...
echo [INFO] Frontend will open automatically in your browser
echo [INFO] Close this window to stop monitoring
echo.

:monitor
timeout /t 10 /nobreak >nul
echo [%time%] Servers running... (Press Ctrl+C to stop)
goto monitor