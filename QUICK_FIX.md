# Quick Fix for PDF Upload Issue

## Problem
- PDF uploads but imageUrl = Missing
- Newspaper not visible after upload

## Solution Steps

### 1. Start Backend First
```bash
cd backend
npm run dev
```
Wait for "MongoDB connected successfully" message.

### 2. Start Frontend
```bash
npm run dev
```

### 3. Test Upload Process
1. Go to Admin Dashboard
2. Login with admin/admin123
3. Check "Backend Debug" shows "connected ✅"
4. Go to "PDF ಟೆಸ್ಟ್" tab
5. Use "PDF Conversion Test" to test a small PDF first
6. If conversion works, try uploading via "PDF ಅಪ್ಲೋಡ್" tab

### 4. Check Results
- Backend Debug should show increased newspaper count
- Upload should show success message in Kannada
- Go to "ಪತ್ರಿಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ" tab to see uploaded newspapers

## If Still Not Working

### Check Browser Console
1. Press F12 → Console tab
2. Look for PDF.js errors
3. Look for network errors (red entries)

### Check Backend Console
1. Look for MongoDB connection errors
2. Look for file upload errors
3. Check if files are being saved to backend/uploads/

### Common Fixes
1. **PDF.js Worker Issue**: Refresh page, try different PDF
2. **MongoDB Connection**: Check .env file, restart backend
3. **File Size**: Try smaller PDF (< 5MB)
4. **Browser**: Try Chrome/Edge instead of Firefox

## Success Indicators
✅ Backend Debug: "connected ✅"
✅ PDF Conversion Test: Shows preview image
✅ Upload Success: Kannada success message
✅ Manage Tab: Shows uploaded newspaper
✅ Files: PDF saved in backend/uploads/