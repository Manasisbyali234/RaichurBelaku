const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Newspaper = require('../models/Newspaper');
const router = express.Router();

// PDF validation function
const validatePDF = (buffer) => {
  // Check PDF header
  const pdfHeader = buffer.slice(0, 4).toString();
  return pdfHeader === '%PDF';
};

// Multer configuration with PDF validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf') {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('ಅಮಾನ್ಯ PDF ಫೈಲ್. ದಯವಿಟ್ಟು ಮತ್ತೊಂದು ಫೈಲ್ ಪ್ರಯತ್ನಿಸಿ.'));
      }
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
    res.json(newspapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's newspaper
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newspaper = await Newspaper.findOne({
      date: { $gte: today }
    }).sort({ date: -1 });
    
    res.json(newspaper);
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
    res.json(newspaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload newspaper
router.post('/upload', upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, date } = req.body;
    
    if (!req.files.pdf || !req.files.image) {
      return res.status(400).json({ message: 'PDF ಮತ್ತು ಚಿತ್ರ ಫೈಲ್ಗಳು ಅಗತ್ಯವಿದೆ' });
    }

    // Additional PDF validation by reading file content
    const pdfPath = req.files.pdf[0].path;
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    if (!validatePDF(pdfBuffer)) {
      // Delete the invalid file
      fs.unlinkSync(pdfPath);
      if (req.files.image) {
        fs.unlinkSync(req.files.image[0].path);
      }
      return res.status(400).json({ message: 'ಅಮಾನ್ಯ PDF ಫೈಲ್. ದಯವಿಟ್ಟು ಮತ್ತೊಂದು ಫೈಲ್ ಪ್ರಯತ್ನಿಸಿ.' });
    }

    const newspaper = new Newspaper({
      name,
      date: new Date(date),
      pdfUrl: `/uploads/${req.files.pdf[0].filename}`,
      imageUrl: `/uploads/${req.files.image[0].filename}`,
      previewImage: `/uploads/${req.files.image[0].filename}`,
      clickableAreas: [],
      areas: [],
      pages: [`/uploads/${req.files.image[0].filename}`],
      totalPages: 1,
      actualPages: 1,
      width: 800, // Default values, can be updated later
      height: 1200
    });

    await newspaper.save();
    
    // Return response in format expected by frontend
    const response = {
      id: newspaper._id,
      name: newspaper.name,
      date: newspaper.date,
      pdfUrl: newspaper.pdfUrl,
      imageUrl: newspaper.imageUrl,
      previewImage: newspaper.previewImage,
      clickableAreas: newspaper.clickableAreas,
      areas: newspaper.areas,
      pages: newspaper.pages,
      totalPages: newspaper.totalPages,
      actualPages: newspaper.actualPages,
      width: newspaper.width,
      height: newspaper.height
    };
    
    res.json(response);
  } catch (error) {
    // Handle multer errors with Kannada messages
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'ಫೈಲ್ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ. 50MB ಕ್ಕಿಂತ ಚಿಕ್ಕ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ.' });
    }
    
    // Clean up uploaded files on error
    if (req.files) {
      if (req.files.pdf) fs.unlinkSync(req.files.pdf[0].path);
      if (req.files.image) fs.unlinkSync(req.files.image[0].path);
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Update clickable areas
router.put('/:id/areas', async (req, res) => {
  try {
    const { clickableAreas } = req.body;
    
    const newspaper = await Newspaper.findByIdAndUpdate(
      req.params.id,
      { clickableAreas },
      { new: true }
    );

    if (!newspaper) {
      return res.status(404).json({ message: 'Newspaper not found' });
    }

    res.json(newspaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete newspaper
router.delete('/:id', async (req, res) => {
  try {
    const newspaper = await Newspaper.findByIdAndDelete(req.params.id);
    if (!newspaper) {
      return res.status(404).json({ message: 'Newspaper not found' });
    }
    res.json({ message: 'Newspaper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;