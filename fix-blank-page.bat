@echo off
echo ==========================================
echo   Fix Blank Page - Single Service Deploy
echo ==========================================
echo.

echo ✓ Updated server.js to serve React app
echo ✓ Updated environment to use kelu.onrender.com
echo ✓ Updated render config for single service
echo.

echo Deploy steps:
echo 1. git add .
echo 2. git commit -m "Fix blank page - single service"
echo 3. git push origin main
echo.

echo In Render dashboard:
echo - Build Command: npm install && npm run build
echo - Start Command: node server.js
echo.

echo ✓ This will serve both frontend and API from one service!
pause