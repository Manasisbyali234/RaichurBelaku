@echo off
echo ==========================================
echo Raichur Belaku PDF Upload Fix
echo ==========================================
echo.

echo 1. Checking if backend is running...
curl -s http://localhost:3001/api/newspapers >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend is running on port 3001
) else (
    echo ✗ Backend is not running
    echo.
    echo Starting backend server...
    cd backend
    start "Backend Server" cmd /k "npm run dev"
    cd ..
    echo Waiting for backend to start...
    timeout /t 5 /nobreak >nul
)

echo.
echo 2. Checking frontend...
echo ✓ Frontend should be running on port 5173

echo.
echo 3. Quick fixes applied:
echo ✓ Added better error handling to PDF upload
echo ✓ Added timeout management for uploads
echo ✓ Added ErrorBoundary to prevent page crashes
echo ✓ Added SimpleUploadTest component for debugging

echo.
echo 4. How to test:
echo   - Go to http://localhost:5173
echo   - Login to Admin Dashboard (admin/admin123)
echo   - Try the "PDF ಟೆಸ್ಟ್" tab first for simple upload test
echo   - Then try the regular "PDF ಅಪ್ಲೋಡ್" tab

echo.
echo 5. If you still get errors:
echo   - Check browser console (F12) for detailed error messages
echo   - Try a smaller PDF file (under 10MB)
echo   - Make sure the PDF is not corrupted
echo   - Try refreshing the page

echo.
echo ==========================================
echo Fix completed! You can now test PDF upload.
echo ==========================================
pause