@echo off
echo Setting up Raichuru Belaku with Backend Storage...

echo Installing frontend dependencies...
npm install

echo Installing backend dependencies...
cd backend && npm install && cd ..

echo Creating uploads directories...
if not exist "uploads" mkdir uploads
if not exist "backend\uploads" mkdir backend\uploads

echo.
echo Setup complete!
echo.
echo To start the backend server: npm run backend:dev
echo To start the frontend: npm run dev
echo To start both: npm run start:all
echo.
echo Backend will run on http://localhost:3001
echo Frontend will run on http://localhost:5173
pause