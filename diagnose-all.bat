@echo off
echo Raichuru Belaku Diagnostic Check...
echo.

echo 1. Checking Node.js version...
node --version
echo.

echo 2. Checking npm version...
npm --version
echo.

echo 3. Checking if dependencies are installed...
if exist "node_modules" (
    echo ✓ Frontend dependencies installed
) else (
    echo ✗ Frontend dependencies missing
)

if exist "backend\node_modules" (
    echo ✓ Backend dependencies installed
) else (
    echo ✗ Backend dependencies missing
)
echo.

echo 4. Checking required directories...
if exist "uploads" (
    echo ✓ Frontend uploads directory exists
) else (
    echo ✗ Frontend uploads directory missing
)

if exist "backend\uploads" (
    echo ✓ Backend uploads directory exists
) else (
    echo ✗ Backend uploads directory missing
)
echo.

echo 5. Checking environment files...
if exist ".env" (
    echo ✓ Main .env file exists
) else (
    echo ✗ Main .env file missing
)

if exist "backend\.env" (
    echo ✓ Backend .env file exists
) else (
    echo ✗ Backend .env file missing
)
echo.

echo 6. Testing backend connection...
echo Testing MongoDB connection...
node test-backend.js
echo.

echo Diagnostic complete!
echo.
echo If you see any ✗ marks above, run: fix-all.bat
pause