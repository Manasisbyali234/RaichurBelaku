@echo off
echo Setting up Raichuru Belaku with Backend Storage...

echo Installing dependencies...
npm install

echo Creating uploads directory...
if not exist "uploads" mkdir uploads

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