@echo off
echo ==========================================
echo   Raichur Belaku - Render Deployment Fix
echo ==========================================
echo.

echo 1. Checking backend configuration...
if exist "backend\simple-server.js" (
    echo ✓ Backend server file found
) else (
    echo ✗ Backend server file missing
    pause
    exit /b 1
)

echo.
echo 2. Backend server has been updated with:
echo   - CORS configuration for Render domain
echo   - Production environment settings
echo.

echo 3. Frontend configuration updated to use:
echo   - Backend URL: https://pop-belku.onrender.com
echo   - Production environment
echo.

echo 4. Next steps for Render deployment:
echo   a) Commit and push these changes to GitHub
echo   b) Redeploy your backend service on Render
echo   c) Wait for deployment to complete
echo   d) Test the admin panel at: https://pop-belku.onrender.com/admin
echo.

echo Commands to run:
echo   git add .
echo   git commit -m "Fix Render deployment CORS and environment"
echo   git push origin main
echo.

echo ✓ Configuration files updated successfully!
echo.
pause