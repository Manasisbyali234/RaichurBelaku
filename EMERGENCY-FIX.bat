@echo off
echo ==========================================
echo   EMERGENCY FIX - Static Site Only
echo ==========================================
echo.

echo ✓ Switched to SimpleApp (minimal version)
echo ✓ Created render-static.yaml for static deployment
echo.

echo DEPLOY AS STATIC SITE:
echo 1. git add .
echo 2. git commit -m "Emergency fix - static site"
echo 3. git push origin main
echo 4. In Render: Create NEW Static Site
echo 5. Use render-static.yaml config
echo.

echo This will show basic page without backend!
pause