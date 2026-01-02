# Backend Setup for Raichur Belaku

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup MongoDB:
- Install MongoDB locally or use MongoDB Atlas
- Update MONGODB_URI in .env file

4. Create default admin user:
```bash
curl -X POST http://localhost:5000/api/auth/create-admin
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Admin login
- POST `/api/auth/create-admin` - Create default admin

### Newspapers
- GET `/api/newspapers` - Get all newspapers
- GET `/api/newspapers/today` - Get today's newspaper
- GET `/api/newspapers/:id` - Get specific newspaper
- POST `/api/newspapers/upload` - Upload new newspaper
- PUT `/api/newspapers/:id/areas` - Update clickable areas
- DELETE `/api/newspapers/:id` - Delete newspaper

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/raichur-belaku
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Default Admin Credentials
- Username: admin
- Password: admin123