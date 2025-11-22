# ರಾಯಚೂರು ಬೆಳಕು - Raichuru Belku Digital Newspaper

A complete frontend-only e-newspaper web application built with React and Tailwind CSS for the digital newspaper "Raichuru Belku". The entire UI is in Kannada with a blue (#1E40AF) and red (#B91C1C) theme.

## Features

### User Features
- **Home Page**: Welcome page with today's newspaper preview
- **Today's Newspaper**: Interactive newspaper viewer with clickable areas
- **Archive**: Browse and search through all published newspapers
- **News Articles**: Click on newspaper areas to read full articles in new tabs

### Admin Features
- **PDF Upload**: Upload newspaper PDFs with drag-and-drop support
- **Area Mapping**: Draw rectangular clickable areas on newspaper pages
- **Content Management**: Add news titles, content, and images for each area
- **Newspaper Management**: View and manage all uploaded newspapers

## Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **PDF Processing**: PDF.js
- **Storage**: localStorage (no backend required)
- **Font**: Noto Sans Kannada

## Installation

1. **Clone or download the project**
   ```bash
   cd Newzpaper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

### For Admins

1. **Upload PDF**
   - Go to Admin Dashboard (ಆಡಳಿತ)
   - Upload a newspaper PDF file
   - The first page will be converted to an image automatically

2. **Map Clickable Areas**
   - Switch to "ಪ್ರದೇಶ ಮ್ಯಾಪಿಂಗ್" tab
   - Draw rectangular areas on the newspaper image by dragging
   - Fill in news title, content, and optional image URL for each area
   - Areas are saved automatically

3. **Manage Newspapers**
   - View all uploaded newspapers
   - Select different newspapers to edit their clickable areas

### For Users

1. **Read Today's Newspaper**
   - Visit "ಇಂದಿನ ಪತ್ರಿಕೆ" to see today's edition
   - Click on highlighted areas to read full articles
   - Articles open in new tabs for better reading experience

2. **Browse Archive**
   - Visit "ಆರ್ಕೈವ್" to see all past newspapers
   - Search and filter newspapers by date or name
   - Download original PDF files

## Project Structure

```
src/
├── components/
│   ├── AdminUploadPDF.jsx    # PDF upload with drag-and-drop
│   ├── PDFMapper.jsx         # Interactive area mapping
│   ├── NewspaperViewer.jsx   # User newspaper viewer
│   ├── NewsTab.jsx           # Individual article reader
│   └── Navbar.jsx            # Navigation component
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── NewsPage.jsx          # Today's newspaper page
│   ├── Archive.jsx           # Newspaper archive
│   └── AdminDashboard.jsx    # Admin interface
├── utils/
│   ├── pdfUtils.js           # PDF processing utilities
│   └── localStorage.js       # Data storage utilities
├── App.jsx                   # Main app with routing
└── main.jsx                  # React entry point
```

## Key Features Explained

### PDF to Image Conversion
- Uses PDF.js to convert the first page of uploaded PDFs to images
- Maintains aspect ratio and quality for interactive viewing

### Interactive Area Mapping
- Mouse-based drawing of rectangular clickable areas
- Real-time preview of drawn areas
- Form-based content entry for each area

### Responsive Design
- Mobile-friendly interface
- Tailwind CSS for consistent styling
- Kannada font support with Noto Sans Kannada

### Data Storage
- All data stored in browser's localStorage
- No backend or database required
- Persistent across browser sessions

## Browser Compatibility

- Modern browsers with ES6+ support
- localStorage support required
- PDF.js worker support needed

## Customization

### Colors
Edit `tailwind.config.js` to change theme colors:
```javascript
colors: {
  'newspaper-blue': '#1E40AF',  // Primary blue
  'newspaper-red': '#B91C1C',   // Accent red
}
```

### Fonts
The app uses Noto Sans Kannada. To change fonts, update:
1. `index.html` - Google Fonts link
2. `tailwind.config.js` - Font family configuration
3. `index.css` - Default font family

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## License

This project is open source and available under the MIT License.