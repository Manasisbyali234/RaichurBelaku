@echo off
echo ಸರ್ವರ್ ಸಮಸ್ಯೆ ಪರಿಶೀಲನೆ... (Server Problem Diagnosis...)
echo.

cd /d "%~dp0"

echo 1. Node.js ಆವೃತ್ತಿ ಪರಿಶೀಲನೆ (Checking Node.js version):
node --version
echo.

echo 2. ಬ್ಯಾಕೆಂಡ್ ಫೋಲ್ಡರ್ ಪರಿಶೀಲನೆ (Checking backend folder):
if exist backend (
    echo ✓ ಬ್ಯಾಕೆಂಡ್ ಫೋಲ್ಡರ್ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ (Backend folder exists)
) else (
    echo ✗ ಬ್ಯಾಕೆಂಡ್ ಫೋಲ್ಡರ್ ಇಲ್ಲ (Backend folder missing)
)
echo.

echo 3. ಬ್ಯಾಕೆಂಡ್ ಫೈಲ್ಗಳ ಪರಿಶೀಲನೆ (Checking backend files):
if exist backend\simple-server.js (
    echo ✓ simple-server.js ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ (simple-server.js exists)
) else (
    echo ✗ simple-server.js ಇಲ್ಲ (simple-server.js missing)
)

if exist backend\package.json (
    echo ✓ backend package.json ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ (backend package.json exists)
) else (
    echo ✗ backend package.json ಇಲ್ಲ (backend package.json missing)
)
echo.

echo 4. ಬ್ಯಾಕೆಂಡ್ ಡಿಪೆಂಡೆನ್ಸಿಗಳ ಪರಿಶೀಲನೆ (Checking backend dependencies):
cd backend
if exist node_modules (
    echo ✓ ಬ್ಯಾಕೆಂಡ್ node_modules ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ (Backend node_modules exists)
) else (
    echo ✗ ಬ್ಯಾಕೆಂಡ್ node_modules ಇಲ್ಲ (Backend node_modules missing)
    echo   ಇನ್ಸ್ಟಾಲ್ ಮಾಡಲಾಗುತ್ತಿದೆ... (Installing...)
    npm install
)
cd ..
echo.

echo 5. ಪೋರ್ಟ್ 3001 ಪರಿಶೀಲನೆ (Checking port 3001):
netstat -an | findstr :3001
if errorlevel 1 (
    echo ✓ ಪೋರ್ಟ್ 3001 ಮುಕ್ತವಾಗಿದೆ (Port 3001 is free)
) else (
    echo ⚠ ಪೋರ್ಟ್ 3001 ಬಳಕೆಯಲ್ಲಿದೆ (Port 3001 is in use)
)
echo.

echo 6. ಸರಳ ಸರ್ವರ್ ಪರೀಕ್ಷೆ (Simple server test):
echo ಸರ್ವರ್ ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ... (Starting server...)
cd backend
timeout /t 2 /nobreak >nul
start /b node simple-server.js
timeout /t 3 /nobreak >nul

echo ಸರ್ವರ್ ಪರೀಕ್ಷೆ... (Testing server...)
curl -s http://localhost:3001/api/health >nul 2>&1
if errorlevel 1 (
    echo ✗ ಸರ್ವರ್ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತಿಲ್ಲ (Server not responding)
) else (
    echo ✓ ಸರ್ವರ್ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ (Server is working)
)

echo.
echo ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿತು (Diagnosis complete)
pause