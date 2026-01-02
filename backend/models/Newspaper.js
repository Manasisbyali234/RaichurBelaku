const mongoose = require('mongoose');

const clickableAreaSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String }
});

const newspaperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  clickableAreas: [clickableAreaSchema],
  isToday: {
    type: Boolean,
    default: false
  },
  // Additional fields for frontend compatibility
  pages: [String], // Array of page image URLs
  totalPages: Number,
  actualPages: Number,
  previewImage: String,
  width: Number,
  height: Number,
  areas: [clickableAreaSchema] // Alias for clickableAreas
}, {
  timestamps: true
});

module.exports = mongoose.model('Newspaper', newspaperSchema);