# Backend Setup & Troubleshooting

## Quick Start

1. **Start the complete application:**
   ```bash
   start-complete.bat
   ```

2. **Or start manually:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend  
   npm run dev
   ```

## Backend Status

- **URL:** http://localhost:3001
- **Database:** MongoDB Atlas
- **Storage:** Backend uploads folder + MongoDB

## Troubleshooting PDF Upload Issues

### 1. Check Backend Connection
- Open Admin Dashboard
- Look for "Backend Debug" section at the top
- Should show "connected ✅"

### 2. If Backend is Offline
```bash
cd backend
npm run dev
```

### 3. Check MongoDB Connection
- Ensure `.env` file exists in backend folder
- Verify MONGODB_URI is correct
- Check console for connection errors

### 4. Upload Process Flow
1. **Frontend:** PDF selected → converted to image
2. **FormData:** PDF file + image data + metadata
3. **Backend:** Receives upload → validates PDF → saves to MongoDB
4. **Response:** Returns newspaper object with database ID

### 5. Common Issues

**"PDF not visible":**
- Check Backend Debug component shows newspapers
- Verify PDF was saved to database (count > 0)
- Check browser console for API errors

**"Upload fails silently":**
- Open browser DevTools → Network tab
- Look for failed POST to `/api/newspapers`
- Check backend console for error messages

**"Backend offline":**
- Restart backend: `cd backend && npm run dev`
- Check port 3001 is not in use
- Verify MongoDB connection string

### 6. File Structure
```
backend/
├── uploads/          # PDF and image files
├── models/
│   └── Newspaper.js  # MongoDB schema
├── routes/
│   └── newspapers.js # API endpoints
└── server.js         # Express server
```

### 7. API Endpoints
- `GET /api/newspapers` - List all newspapers
- `POST /api/newspapers` - Upload new newspaper
- `PUT /api/newspapers/:id/areas` - Update clickable areas
- `DELETE /api/newspapers/:id` - Delete newspaper

### 8. Database Schema
```javascript
{
  name: String,
  date: Date,
  pdfUrl: String,      // /uploads/filename.pdf
  imageUrl: String,    // /uploads/filename.jpg
  clickableAreas: [],  // Array of clickable regions
  width: Number,       // Image dimensions
  height: Number
}
```

## Environment Variables

Create `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3001
```

## Success Indicators

✅ Backend Debug shows "connected"
✅ Upload shows success message in Kannada
✅ Newspaper appears in "Manage Newspapers" tab
✅ PDF file visible in backend/uploads folder
✅ Database entry created (check Backend Debug count)

## Need Help?

1. Check both backend and frontend console logs
2. Verify all dependencies installed: `npm install`
3. Ensure MongoDB Atlas is accessible
4. Try uploading a small PDF file first
5. Use Backend Debug component to monitor status