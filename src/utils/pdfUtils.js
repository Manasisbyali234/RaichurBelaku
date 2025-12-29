import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker for both development and production
if (typeof window !== 'undefined') {
  // Use CDN worker that works everywhere
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}



export const convertPDFToImage = async (pdfFile) => {
  try {
    console.log('Converting PDF to image:', pdfFile.name);
    
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`
    }).promise;
    
    const page = await pdf.getPage(1);
    
    // High quality scale
    const scale = 2.0;
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    // Convert to base64 and store in localStorage
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    return {
      imageUrl: imageData,
      width: viewport.width,
      height: viewport.height
    };
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw new Error('PDF ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವಲ್ಲಿ ದೋಷ: ' + error.message);
  }
};

export const convertAllPDFPagesToImages = async (pdfFile) => {
  try {
    console.log('Starting PDF conversion for:', pdfFile.name);
    
    const arrayBuffer = await pdfFile.arrayBuffer();
    console.log('PDF arrayBuffer created, size:', arrayBuffer.byteLength);
    
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`
    }).promise;
    
    const numPages = pdf.numPages;
    console.log('PDF loaded successfully, pages:', numPages);
    
    const pages = [];
    
    // Process all pages
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${numPages}`);
      
      const page = await pdf.getPage(pageNum);
      
      // High quality scale
      const scale = 2.0;
      
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // High quality
      pages.push({
        pageNumber: pageNum,
        imageUrl: canvas.toDataURL('image/jpeg', 0.95),
        width: viewport.width,
        height: viewport.height
      });
      
      console.log(`Page ${pageNum} converted successfully`);
    }
    
    console.log('All pages converted successfully');
    
    return {
      pages,
      totalPages: numPages,
      actualPages: numPages,
      previewImage: pages[0].imageUrl,
      width: pages[0].width,
      height: pages[0].height
    };
  } catch (error) {
    console.error('Error converting PDF pages to images:', error);
    
    // Provide more specific error messages
    if (error.name === 'InvalidPDFException') {
      throw new Error('ಅಮಾನ್ಯ PDF ಫೈಲ್. ದಯವಿಟ್ಟು ಮತ್ತೊಂದು ಫೈಲ್ ಪ್ರಯತ್ನಿಸಿ.');
    } else if (error.name === 'MissingPDFException') {
      throw new Error('PDF ಫೈಲ್ ಕಾಣೆಯಾಗಿದೆ ಅಥವಾ ಹಾನಿಗೊಳಗಾಗಿದೆ.');
    } else if (error.name === 'UnexpectedResponseException') {
      throw new Error('PDF ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ನೆಟ್ವರ್ಕ್ ದೋಷ.');
    } else {
      throw new Error('PDF ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವಲ್ಲಿ ದೋಷ: ' + error.message);
    }
  }
};

export const savePDFFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Compress image further if needed
export const compressImage = (canvas, quality = 0.3) => {
  return canvas.toDataURL('image/jpeg', quality);
};

// Utility to estimate storage size
export const estimateStorageSize = (newspaper) => {
  try {
    const jsonString = JSON.stringify(newspaper);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    return { bytes: sizeInBytes, mb: sizeInMB };
  } catch (error) {
    console.error('Error estimating size:', error);
    return { bytes: 0, mb: '0.00' };
  }
};

