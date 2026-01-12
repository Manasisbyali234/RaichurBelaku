const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    // Check if backend is running
    console.log('Testing backend connection...');
    const healthResponse = await fetch('http://localhost:3001/api/newspapers');
    console.log('Backend status:', healthResponse.status);
    
    // Find a PDF file in uploads
    const uploadsDir = path.join(__dirname, 'backend', 'uploads');
    const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.pdf'));
    
    if (files.length === 0) {
      console.log('No PDF files found in uploads directory');
      return;
    }
    
    const pdfFile = files[0];
    const pdfPath = path.join(uploadsDir, pdfFile);
    
    console.log(`Testing upload with: ${pdfFile}`);
    
    // Create form data
    const form = new FormData();
    form.append('pdf', fs.createReadStream(pdfPath));
    form.append('name', 'Test Newspaper');
    form.append('date', new Date().toISOString());
    form.append('imageUrl', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    form.append('width', '800');
    form.append('height', '1200');
    
    // Upload
    const response = await fetch('http://localhost:3001/api/newspapers', {
      method: 'POST',
      body: form
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Upload successful:', result);
    } else {
      const error = await response.text();
      console.log('Upload failed:', error);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testUpload();