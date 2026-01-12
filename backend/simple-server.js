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

// Simple file upload handling
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

app.post('/api/newspapers', upload.single('pdf'), (req, res) => {
  try {
    const { name, date, imageUrl, width, height } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file required' });
    }

    let savedImageUrl = null;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const imagePath = path.join(uploadsDir, `${Date.now()}-preview.jpg`);
      fs.writeFileSync(imagePath, imageBuffer);
      savedImageUrl = `/uploads/${path.basename(imagePath)}`;
    }

    const newspaper = {
      id: Date.now().toString(),
      _id: Date.now().toString(),
      name: name || req.file.originalname.replace('.pdf', ''),
      date: new Date(date || Date.now()),
      pdfUrl: `/uploads/${req.file.filename}`,
      imageUrl: savedImageUrl || '/logo.jpg',
      previewImage: savedImageUrl || '/logo.jpg',
      clickableAreas: [],
      areas: [],
      pages: [savedImageUrl || '/logo.jpg'],
      width: parseInt(width) || 800,
      height: parseInt(height) || 1200,
      isToday: newspapers.length === 0
    };

    newspapers.push(newspaper);
    res.json(newspaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ Simple server running on port ${PORT}`);
  console.log(`✓ No MongoDB required - using in-memory storage`);
});