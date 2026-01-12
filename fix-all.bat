@echo off
echo Comprehensive Fix for Raichuru Belaku...

echo 1. Cleaning node_modules...
if exist "node_modules" rmdir /s /q node_modules
if exist "backend\node_modules" rmdir /s /q backend\node_modules

echo 2. Installing frontend dependencies...
npm install

echo 3. Installing backend dependencies...
cd backend
npm install
cd ..

echo 4. Creating required directories...
if not exist "uploads" mkdir uploads
if not exist "backend\uploads" mkdir backend\uploads

echo 5. Testing backend connection...
node test-backend.js

echo.
echo Fix complete! 
echo.
echo To start the application:
echo   npm run start:all
echo.
echo Or start separately:
echo   Backend: npm run backend:dev
echo   Frontend: npm run dev
echo.
pause