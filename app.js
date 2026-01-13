const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('dist'));

let newspapers = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, message: 'Login successful' });
});

app.get('/api/newspapers', (req, res) => {
  res.json(newspapers);
});

app.get('/api/newspapers/today', (req, res) => {
  res.json(newspapers[0] || null);
});

app.post('/api/newspapers', (req, res) => {
  const newspaper = {
    id: Date.now().toString(),
    name: req.body.name || 'Test Paper',
    date: new Date(),
    clickableAreas: [],
    isToday: true
  };
  newspapers.push(newspaper);
  res.json(newspaper);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});