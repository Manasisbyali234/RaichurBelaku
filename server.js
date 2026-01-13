const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({
  origin: ['https://kelu.onrender.com', /\.onrender\.com$/],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

let newspapers = [];
let adminLoggedIn = false;

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    adminLoggedIn = true;
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/newspapers', (req, res) => {
  res.json(newspapers);
});

app.get('/api/newspapers/today', (req, res) => {
  const today = newspapers.find(n => n.isToday) || newspapers[newspapers.length - 1] || null;
  res.json(today);
});

app.post('/api/newspapers', (req, res) => {
  try {
    const { name, date, imageUrl, width, height, pdfBase64 } = req.body;
    
    const newspaper = {
      id: Date.now().toString(),
      _id: Date.now().toString(),
      name: name || 'New Newspaper',
      date: new Date(date || Date.now()),
      pdfUrl: pdfBase64 ? `data:application/pdf;base64,${pdfBase64}` : null,
      imageUrl: imageUrl || '/logo.jpg',
      clickableAreas: [],
      width: parseInt(width) || 800,
      height: parseInt(height) || 1200,
      isToday: newspapers.length === 0,
      createdAt: new Date()
    };

    newspapers.push(newspaper);
    res.json(newspaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/newspapers/:id/areas', (req, res) => {
  const { clickableAreas } = req.body;
  const newspaper = newspapers.find(n => n.id === req.params.id);
  if (newspaper) {
    newspaper.clickableAreas = clickableAreas;
    res.json(newspaper);
  } else {
    res.status(404).json({ message: 'Newspaper not found' });
  }
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});