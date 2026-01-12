const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Newspaper = require('../models/Newspaper');
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper function to convert relative URLs to full URLs
const getFullUrl = (req, relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http') || relativePath.startsWith('data:')) {
    return relativePath;
  }
  if (relativePath.startsWith('/uploads/')) {
    return `${req.protocol}://${req.get('host')}${relativePath}`;
  }
  return relativePath;
};

// Helper function to process newspaper data with full URLs
const processNewspaperData = (req, newspaper) => {
  if (!newspaper) return newspaper;
  
  const processed = newspaper.toObject ? newspaper.toObject() : newspaper;
  
  return {
    ...processed,
    pdfUrl: getFullUrl(req, processed.pdfUrl),
    imageUrl: getFullUrl(req, processed.imageUrl),
    previewImage: getFullUrl(req, processed.previewImage),
    pages: processed.pages ? processed.pages.map(page => {
      if (typeof page === 'string') {
        return getFullUrl(req, page);
      }
      return {
        ...page,
        imageUrl: getFullUrl(req, page.imageUrl)
      };
    }) : []
  };
};

// PDF validation function
const validatePDF = (buffer) => {
  const pdfHeader = buffer.slice(0, 4).toString();
  return pdfHeader === '%PDF';
};

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    if (file.fieldname === 'pdf') {
      cb(null, `${timestamp}-${file.originalname}`);
    } else {
      cb(null, `${timestamp}-preview.jpg`);
    }
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
      return cb(new Error('ಅಮಾನ್ಯ PDF ಫೈಲ್. ದಯವಿಟ್ಟು ಮತ್ತೊಂದು ಫೈಲ್ ಪ್ರಯತ್ನಿಸಿ.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Get all newspapers
router.get('/', async (req, res) => {
  try {
    const newspapers = await Newspaper.find().sort({ date: -1 });
    const processedNewspapers = newspapers.map(newspaper => processNewspaperData(req, newspaper));
    res.json(processedNewspapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Set newspaper as today's newspaper
router.post('/:id/set-today', async (req, res) => {
  try {
    // First, unset any existing today's newspaper
    await Newspaper.updateMany({}, { isToday: false });
    
    // Set the selected newspaper as today's
    const newspaper = await Newspaper.findByIdAndUpdate(
      req.params.id,
      { isToday: true },
      { new: true }
    );

    if (!newspaper) {
      return res.status(404).json({ message: 'Newspaper not found' });
    }

    res.json(processNewspaperData(req, newspaper));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's newspaper
router.get('/today', async (req, res) => {
  try {
    // First try to find newspaper marked as today's
    let newspaper = await Newspaper.findOne({ isToday: true });
    
    // If no newspaper is marked as today's, get the latest one
    if (!newspaper) {
      newspaper = await Newspaper.findOne().sort({ date: -1 });
    }
    
    res.json(processNewspaperData(req, newspaper));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get newspaper by ID
router.get('/:id', async (req, res) => {
  try {
    const newspaper = await Newspaper.findById(req.params.id);
    if (!newspaper) {
      return res.status(404).json({ message: 'Newspaper not found' });
    }
    res.json(processNewspaperData(req, newspaper));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload newspaper - Updated to handle single PDF with image data
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { name, date, imageUrl, width, height } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'PDF ಫೈಲ್ ಅಗತ್ಯವಿದೆ' });
    }

    // Validate PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    if (!validatePDF(pdfBuffer)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'ಅಮಾನ್ಯ PDF ಫೈಲ್. ದಯವಿಟ್ಟು ಮತ್ತೊಂದು ಫೈಲ್ ಪ್ರಯತ್ನಿಸಿ.' });
    }

    // Save image data if provided
    let savedImageUrl = null;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      try {
        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const imagePath = path.join(uploadsDir, `${Date.now()}-preview.jpg`);
        fs.writeFileSync(imagePath, imageBuffer);
        savedImageUrl = `/uploads/${path.basename(imagePath)}`;
        console.log('Image saved successfully:', savedImageUrl);
      } catch (error) {
        console.error('Failed to save image:', error);
        savedImageUrl = null;
      }
    } else {
      console.log('No valid imageUrl provided, will use placeholder');
    }

    const newspaper = new Newspaper({
      name: name || req.file.originalname.replace('.pdf', ''),
      date: new Date(date || Date.now()),
      pdfUrl: `/uploads/${req.file.filename}`,
      imageUrl: savedImageUrl || '/logo.jpg',
      previewImage: savedImageUrl || '/logo.jpg',
      clickableAreas: [],
      areas: [],
      pages: [savedImageUrl || '/logo.jpg'],
      totalPages: 1,
      actualPages: 1,
      width: parseInt(width) || 800,
      height: parseInt(height) || 1200
    });

    await newspaper.save();
    
    console.log('Newspaper saved successfully:', {
      id: newspaper._id,
      name: newspaper.name,
      pdfUrl: newspaper.pdfUrl,
      imageUrl: newspaper.imageUrl
    });
    
    res.json(processNewspaperData(req, newspaper));
  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'ಫೈಲ್ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ. 50MB ಕ್ಕಿಂತ ಚಿಕ್ಕ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ.' });
    }
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Update clickable areas
router.put('/:id/areas', async (req, res) => {
  try {
    const { clickableAreas } = req.body;
    
    console.log(`Updating areas for newspaper ${req.params.id}:`, {
      areasCount: clickableAreas?.length || 0,
      areas: clickableAreas?.map(a => ({ title: a.title, x: a.x, y: a.y, width: a.width, height: a.height }))
    });
    
    const newspaper = await Newspaper.findByIdAndUpdate(
      req.params.id,
      { 
        clickableAreas,
        areas: clickableAreas // Update both fields for compatibility
      },
      { new: true }
    );

    if (!newspaper) {
      return res.status(404).json({ message: 'Newspaper not found' });
    }

    console.log('Areas updated successfully:', {
      newspaperId: newspaper._id,
      areasCount: newspaper.clickableAreas?.length || 0
    });

    res.json(processNewspaperData(req, newspaper));
  } catch (error) {
    console.error('Error updating areas:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete newspaper
router.delete('/:id', async (req, res) => {
  try {
    const newspaper = await Newspaper.findById(req.params.id);
    if (!newspaper) {
      return res.status(404).json({ message: 'Newspaper not found' });
    }

    // Delete associated files
    if (newspaper.pdfUrl && newspaper.pdfUrl.startsWith('/uploads/')) {
      const pdfPath = path.join(uploadsDir, path.basename(newspaper.pdfUrl));
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }
    
    if (newspaper.imageUrl && newspaper.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(uploadsDir, path.basename(newspaper.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Newspaper.findByIdAndDelete(req.params.id);
    res.json({ message: 'Newspaper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;