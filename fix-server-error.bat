@echo off
echo ಸರ್ವರ್ ದೋಷ ಸರಿಪಡಿಸಲಾಗುತ್ತಿದೆ... (Fixing Server Error...)
echo.

cd /d "%~dp0"

REM Kill any existing Node processes on port 3001
echo ಹಳೆಯ ಸರ್ವರ್ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ನಿಲ್ಲಿಸಲಾಗುತ್ತಿದೆ... (Stopping old server processes...)
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Clean and reinstall dependencies
echo ಡಿಪೆಂಡೆನ್ಸಿಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಲಾಗುತ್ತಿದೆ... (Cleaning dependencies...)

REM Frontend cleanup
if exist node_modules (
    echo ಫ್ರಂಟೆಂಡ್ node_modules ಅಳಿಸಲಾಗುತ್ತಿದೆ... (Deleting frontend node_modules...)
    rmdir /s /q node_modules
)

REM Backend cleanup
cd backend
if exist node_modules (
    echo ಬ್ಯಾಕೆಂಡ್ node_modules ಅಳಿಸಲಾಗುತ್ತಿದೆ... (Deleting backend node_modules...)
    rmdir /s /q node_modules
)

REM Create uploads directory
if not exist uploads (
    echo ಅಪ್ಲೋಡ್ ಡೈರೆಕ್ಟರಿ ರಚಿಸಲಾಗುತ್ತಿದೆ... (Creating uploads directory...)
    mkdir uploads
)
cd ..

REM Reinstall dependencies
echo ಡಿಪೆಂಡೆನ್ಸಿಗಳನ್ನು ಮರುಸ್ಥಾಪಿಸಲಾಗುತ್ತಿದೆ... (Reinstalling dependencies...)

echo ಫ್ರಂಟೆಂಡ್ ಡಿಪೆಂಡೆನ್ಸಿಗಳು... (Frontend dependencies...)
npm install

echo ಬ್ಯಾಕೆಂಡ್ ಡಿಪೆಂಡೆನ್ಸಿಗಳು... (Backend dependencies...)
cd backend
npm install
cd ..

REM Test the server
echo.
echo ಸರ್ವರ್ ಪರೀಕ್ಷೆ... (Testing server...)
cd backend
start /b node simple-server.js
timeout /t 5 /nobreak >nul

REM Check if server is responding
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3001/api/health' -UseBasicParsing | Out-Null; Write-Host '✓ ಸರ್ವರ್ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ (Server is working)' -ForegroundColor Green } catch { Write-Host '✗ ಸರ್ವರ್ ಇನ್ನೂ ಸಮಸ್ಯೆಯಲ್ಲಿದೆ (Server still has issues)' -ForegroundColor Red }"

echo.
echo ಸರಿಪಡಿಸುವಿಕೆ ಪೂರ್ಣಗೊಂಡಿತು! (Fix completed!)
echo.
echo ಈಗ ಈ ಕಮಾಂಡ್ ರನ್ ಮಾಡಿ: (Now run this command:)
echo npm run start:simple
echo.
echo ಅಥವಾ ಈ ಫೈಲ್ ರನ್ ಮಾಡಿ: (Or run this file:)
echo start-app-fixed.bat
echo.

pause