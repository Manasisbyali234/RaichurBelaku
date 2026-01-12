@echo off
echo ಸರ್ವರ್ ಪ್ರಾರಂಭಿಸುವುದು...

cd backend

echo ಪೋರ್ಟ್ 3001 ಮುಕ್ತಗೊಳಿಸುವುದು...
netstat -ano | findstr :3001 > nul
if %errorlevel% == 0 (
    echo ಪೋರ್ಟ್ 3001 ಬಳಕೆಯಲ್ಲಿದೆ. ಮುಕ್ತಗೊಳಿಸುವುದು...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /f /pid %%a > nul 2>&1
)

echo ಸರ್ವರ್ ಪ್ರಾರಂಭಿಸುವುದು...
node init.js

cd ..
pause