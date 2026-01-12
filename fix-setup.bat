@echo off
echo ==========================================
echo    Raichuru Belaku - Quick Fix Setup
echo ==========================================
echo.

echo [1/5] Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Frontend dependencies installation failed
    pause
    exit /b 1
)

echo.
echo [2/5] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend dependencies installation failed
    pause
    exit /b 1
)

echo.
echo [3/5] Creating uploads directory...
if not exist "uploads" mkdir uploads
echo Uploads directory created.

echo.
echo [4/5] Checking MongoDB connection...
cd ..
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/raichur-belaku', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('✓ MongoDB connection successful');
  process.exit(0);
}).catch(err => {
  console.log('✗ MongoDB connection failed:', err.message);
  console.log('Please make sure MongoDB is running on your system.');
  process.exit(1);
});
" 2>nul
if errorlevel 1 (
    echo WARNING: MongoDB connection failed. Please ensure MongoDB is installed and running.
    echo You can still use the application with localStorage fallback.
)

echo.
echo [5/5] Setup complete!
echo.
echo ==========================================
echo           How to start the app:
echo ==========================================
echo 1. Start backend: npm run backend:dev
echo 2. Start frontend: npm run dev
echo 3. Or start both: npm run start:all
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:3001
echo.
echo ==========================================
echo           Admin Login:
echo ==========================================
echo Username: admin
echo Password: admin123
echo.
pause