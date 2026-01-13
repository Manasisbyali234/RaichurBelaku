const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// In-memory storage (temporary)
let newspapers = [];
let adminLoggedIn = false;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    adminLoggedIn = true;
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Newspaper routes
app.get('/api/newspapers', (req, res) => {
  res.json(newspapers);
});

app.get('/api/newspapers/today', (req, res) => {
  const today = newspapers.find(n => n.isToday) || newspapers[newspapers.length - 1] || null;
  res.json(today);
});

app.get('/api/newspapers/:id', (req, res) => {
  const newspaper = newspapers.find(n => n.id === req.params.id || n._id === req.params.id);
  if (newspaper) {
    res.json(newspaper);
  } else {
    res.status(404).json({ message: 'Newspaper not found' });
  }
});

app.post('/api/newspapers/:id/set-today', (req, res) => {
  newspapers.forEach(n => n.isToday = false);
  const newspaper = newspapers.find(n => n.id === req.params.id || n._id === req.params.id);
  if (newspaper) {
    newspaper.isToday = true;
    res.json(newspaper);
  } else {
    res.status(404).json({ message: 'Newspaper not found' });
  }
});

app.put('/api/newspapers/:id/areas', (req, res) => {
  const { clickableAreas } = req.body;
  const newspaper = newspapers.find(n => n.id === req.params.id || n._id === req.params.id);
  if (newspaper) {
    newspaper.clickableAreas = clickableAreas;
    newspaper.areas = clickableAreas;
    res.json(newspaper);
  } else {
    res.status(404).json({ message: 'Newspaper not found' });
  }
});

// Simple file upload handling - store as base64
const multer = require('multer');
const storage = multer.memoryStorage(); // Store in memory instead of disk
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

app.post('/api/newspapers', upload.single('pdf'), (req, res) => {
  try {
    const { name, date, imageUrl, width, height } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file required' });
    }

    // Convert PDF to base64
    const pdfBase64 = req.file.buffer.toString('base64');
    const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;

    let savedImageUrl = null;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      savedImageUrl = imageUrl; // Store image as base64 too
    }

    const newspaper = {
      id: Date.now().toString(),
      _id: Date.now().toString(),
      name: name || req.file.originalname.replace('.pdf', ''),
      date: new Date(date || Date.now()),
      pdfUrl: pdfDataUrl, // Store as base64 data URL
      pdfBase64: pdfBase64, // Store raw base64
      imageUrl: savedImageUrl || '/logo.jpg',
      previewImage: savedImageUrl || '/logo.jpg',
      clickableAreas: [],
      areas: [],
      pages: [savedImageUrl || '/logo.jpg'],
      width: parseInt(width) || 800,
      height: parseInt(height) || 1200,
      isToday: newspapers.length === 0,
      totalPages: 1,
      actualPages: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    newspapers.push(newspaper);
    res.json(newspaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add endpoint to serve PDF as base64
app.get('/api/newspapers/:id/pdf', (req, res) => {
  const newspaper = newspapers.find(n => n.id === req.params.id || n._id === req.params.id);
  if (newspaper && newspaper.pdfBase64) {
    res.json({ pdfBase64: newspaper.pdfBase64 });
  } else {
    res.status(404).json({ message: 'PDF not found' });
  }
});

const PORT = process.env.PORT || 3001;

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

app.listen(PORT, () => {
  console.log(`✓ Simple server running on port ${PORT}`);
  console.log(`✓ No MongoDB required - using in-memory storage`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✓ Uploads directory: ${uploadsDir}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`✗ Port ${PORT} is already in use. Please close other applications using this port.`);
    console.error('✗ Or change the PORT in .env file');
  } else {
    console.error('✗ Server error:', err);
  }
  process.exit(1);
});