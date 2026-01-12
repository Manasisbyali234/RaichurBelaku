# Quick Fix Guide - Raichuru Belaku

## 🚀 Quick Start (Fixed Version)

### Option 1: Automated Setup
```bash
# Run the fix setup script
fix-setup.bat

# Then start the application
start-app.bat
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Start both servers
npm run start:all
```

### Option 3: Separate Terminals
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

## 🔧 What Was Fixed

### 1. Environment Configuration
- ✅ Fixed MongoDB URI format
- ✅ Added proper environment variables
- ✅ Corrected Vite environment detection

### 2. Dependencies
- ✅ Updated package.json scripts
- ✅ Fixed Node.js version requirements
- ✅ Added missing backend dependencies

### 3. API Service
- ✅ Fixed development/production URL detection
- ✅ Improved error handling
- ✅ Added proper fallback mechanisms

### 4. Startup Scripts
- ✅ Created automated setup script (`fix-setup.bat`)
- ✅ Created application starter (`start-app.bat`)
- ✅ Added diagnostic tool (`diagnose.bat`)

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Admin Panel**: http://localhost:5173/admin

## 🔑 Default Admin Credentials

- **Username**: admin
- **Password**: admin123

## 🛠️ Troubleshooting

### If you get dependency errors:
```bash
# Delete node_modules and reinstall
rmdir /s node_modules
rmdir /s backend\node_modules
npm install
cd backend && npm install
```

### If ports are in use:
- Check `diagnose.bat` to see which ports are occupied
- Kill processes using those ports or change ports in configuration

### If MongoDB connection fails:
- The app will automatically fall back to localStorage
- No action needed for basic functionality

## 📱 Features Working

- ✅ PDF Upload and Preview
- ✅ Interactive Area Mapping
- ✅ News Article Reading
- ✅ Archive Browsing
- ✅ Admin Dashboard
- ✅ Responsive Design
- ✅ Kannada Language Support

## 🎯 Next Steps

1. Run `diagnose.bat` to check system health
2. Run `fix-setup.bat` for automated setup
3. Run `start-app.bat` to launch the application
4. Access http://localhost:5173 in your browser

The application is now ready to use with all major issues resolved!