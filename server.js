import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Newspaper Schema
const newspaperSchema = new mongoose.Schema({
  name: String,
  date: Date,
  pdfUrl: String,
  imageUrl: String,
  width: Number,
  height: Number,
  clickableAreas: [{
    id: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    title: String,
    content: String,
    imageUrl: String,
    pageNumber: Number
  }]
}, { timestamps: true });

const Newspaper = mongoose.model('Newspaper', newspaperSchema);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/newspapers', async (req, res) => {
  try {
    const newspapers = await Newspaper.find().sort({ createdAt: -1 });
    res.json(newspapers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/newspapers/today', async (req, res) => {
  try {
    const today = new Date().toDateString();
    const todayNewspaper = await Newspaper.findOne({
      date: { $gte: new Date(today) }
    }).sort({ createdAt: -1 });
    
    if (!todayNewspaper) {
      const latestNewspaper = await Newspaper.findOne().sort({ createdAt: -1 });
      res.json(latestNewspaper);
    } else {
      res.json(todayNewspaper);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/newspapers/:id', async (req, res) => {
  try {
    const newspaper = await Newspaper.findById(req.params.id);
    if (newspaper) {
      res.json(newspaper);
    } else {
      res.status(404).json({ error: 'Newspaper not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/newspapers', upload.single('pdf'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    const { name, date, imageUrl, width, height } = req.body;
    
    const newspaper = new Newspaper({
      name: name || req.file.originalname.replace('.pdf', ''),
      date: date || new Date(),
      pdfUrl: `/uploads/${req.file.filename}`,
      imageUrl: imageUrl || null,
      width: parseInt(width) || 0,
      height: parseInt(height) || 0,
      clickableAreas: []
    });
    
    await newspaper.save();
    console.log('Newspaper saved:', newspaper._id);
    res.json(newspaper);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

app.put('/api/newspapers/:id/areas', async (req, res) => {
  try {
    const { clickableAreas } = req.body;
    const newspaper = await Newspaper.findByIdAndUpdate(
      req.params.id,
      { clickableAreas },
      { new: true }
    );
    
    if (newspaper) {
      res.json(newspaper);
    } else {
      res.status(404).json({ error: 'Newspaper not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/newspapers/:id', async (req, res) => {
  try {
    const newspaper = await Newspaper.findById(req.params.id);
    
    if (newspaper) {
      // Delete PDF file
      if (newspaper.pdfUrl) {
        const filePath = path.join(__dirname, newspaper.pdfUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      await Newspaper.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Newspaper not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve React frontend (production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});