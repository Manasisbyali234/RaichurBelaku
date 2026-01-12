@echo off
echo ==========================================
echo    Raichuru Belaku - System Diagnostics
echo ==========================================
echo.

echo [1] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
) else (
    echo ✓ Node.js version: 
    node --version
)

echo.
echo [2] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ npm is not available
) else (
    echo ✓ npm version: 
    npm --version
)

echo.
echo [3] Checking project structure...
if exist "package.json" (
    echo ✓ Frontend package.json found
) else (
    echo ✗ Frontend package.json missing
)

if exist "backend\package.json" (
    echo ✓ Backend package.json found
) else (
    echo ✗ Backend package.json missing
)

if exist "src\App.jsx" (
    echo ✓ Main App component found
) else (
    echo ✗ Main App component missing
)

echo.
echo [4] Checking dependencies...
if exist "node_modules" (
    echo ✓ Frontend dependencies installed
) else (
    echo ✗ Frontend dependencies missing - run 'npm install'
)

if exist "backend\node_modules" (
    echo ✓ Backend dependencies installed
) else (
    echo ✗ Backend dependencies missing - run 'cd backend && npm install'
)

echo.
echo [5] Checking MongoDB (optional)...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo ⚠ MongoDB not found - app will use localStorage fallback
) else (
    echo ✓ MongoDB is available
)

echo.
echo [6] Checking ports...
netstat -an | findstr ":3001" >nul 2>&1
if not errorlevel 1 (
    echo ⚠ Port 3001 is already in use
) else (
    echo ✓ Port 3001 is available
)

netstat -an | findstr ":5173" >nul 2>&1
if not errorlevel 1 (
    echo ⚠ Port 5173 is already in use
) else (
    echo ✓ Port 5173 is available
)

echo.
echo ==========================================
echo           Diagnostic Complete
echo ==========================================
echo.
echo If you see any ✗ errors above, please fix them before starting the app.
echo If you see ⚠ warnings, the app may still work but with limitations.
echo.
pause