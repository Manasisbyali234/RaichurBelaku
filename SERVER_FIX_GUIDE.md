# ಸರ್ವರ್ ದೋಷ ಸರಿಪಡಿಸುವ ಮಾರ್ಗದರ್ಶಿ (Server Error Fix Guide)

## ತ್ವರಿತ ಪರಿಹಾರ (Quick Fix)

### ವಿಧಾನ 1: ಸ್ವಯಂಚಾಲಿತ ಸರಿಪಡಿಸುವಿಕೆ (Automatic Fix)
```bash
# ಈ ಫೈಲ್ ರನ್ ಮಾಡಿ (Run this file):
fix-server-error.bat
```

### ವಿಧಾನ 2: ಹಸ್ತಚಾಲಿತ ಸರಿಪಡಿಸುವಿಕೆ (Manual Fix)
```bash
# 1. ಹಳೆಯ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ನಿಲ್ಲಿಸಿ (Stop old processes)
taskkill /f /im node.exe

# 2. ಡಿಪೆಂಡೆನ್ಸಿಗಳನ್ನು ಮರುಸ್ಥಾಪಿಸಿ (Reinstall dependencies)
npm install
cd backend
npm install
cd ..

# 3. ಸರ್ವರ್ ಪ್ರಾರಂಭಿಸಿ (Start server)
npm run start:simple
```

### ವಿಧಾನ 3: ಸಂಪೂರ್ಣ ಅಪ್ಲಿಕೇಶನ್ ಪ್ರಾರಂಭ (Complete App Start)
```bash
# ಈ ಫೈಲ್ ರನ್ ಮಾಡಿ (Run this file):
start-app-fixed.bat
```

## ಸಾಮಾನ್ಯ ಸಮಸ್ಯೆಗಳು (Common Issues)

### 1. ಪೋರ್ಟ್ ಈಗಾಗಲೇ ಬಳಕೆಯಲ್ಲಿದೆ (Port Already in Use)
```bash
# ಪೋರ್ಟ್ 3001 ಬಳಸುವ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ಕೊಲ್ಲಿ (Kill processes using port 3001)
netstat -ano | findstr :3001
taskkill /f /pid [PID_NUMBER]
```

### 2. Node.js ಇನ್ಸ್ಟಾಲ್ ಆಗಿಲ್ಲ (Node.js Not Installed)
- Node.js ಅನ್ನು https://nodejs.org ನಿಂದ ಡೌನ್ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಇನ್ಸ್ಟಾಲ್ ಮಾಡಿ
- Download and install Node.js from https://nodejs.org

### 3. ಅನುಮತಿ ದೋಷಗಳು (Permission Errors)
```bash
# ಆಡಳಿತಗಾರ ಆಗಿ ಕಮಾಂಡ್ ಪ್ರಾಂಪ್ಟ್ ರನ್ ಮಾಡಿ (Run Command Prompt as Administrator)
```

## ಪರೀಕ್ಷೆ (Testing)

### ಸರ್ವರ್ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆಯೇ ಎಂದು ಪರೀಕ್ಷಿಸಿ (Check if server is working):
```bash
# ಬ್ರೌಸರ್ನಲ್ಲಿ ಈ URL ಗೆ ಭೇಟಿ ನೀಡಿ (Visit this URL in browser):
http://localhost:3001/api/health

# ಅಥವಾ ಕಮಾಂಡ್ ಲೈನ್ನಲ್ಲಿ (Or in command line):
curl http://localhost:3001/api/health
```

### ಪೂರ್ಣ ಅಪ್ಲಿಕೇಶನ್ ಪರೀಕ್ಷೆ (Full application test):
```bash
# ಬ್ರೌಸರ್ನಲ್ಲಿ ಈ URL ಗೆ ಭೇಟಿ ನೀಡಿ (Visit this URL in browser):
http://localhost:5173
```

## ಸಹಾಯ (Help)

ಇನ್ನೂ ಸಮಸ್ಯೆ ಇದ್ದರೆ, ಈ ಫೈಲ್ ರನ್ ಮಾಡಿ (If still having issues, run this file):
```bash
diagnose-server.bat
```

ಇದು ಸಮಸ್ಯೆಯ ವಿವರವಾದ ವರದಿಯನ್ನು ನೀಡುತ್ತದೆ (This will give a detailed problem report).