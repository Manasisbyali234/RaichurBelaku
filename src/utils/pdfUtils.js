import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const convertPDFToImage = async (pdfFile) => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdf.getPage(1);
    
    const scale = 2;
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
    
    return {
      imageUrl: canvas.toDataURL('image/png'),
      width: viewport.width,
      height: viewport.height
    };
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw error;
  }
};

export const convertAllPDFPagesToImages = async (pdfFile) => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    const pages = [];
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const scale = 2;
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
      
      pages.push({
        pageNumber: pageNum,
        imageUrl: canvas.toDataURL('image/png'),
        width: viewport.width,
        height: viewport.height
      });
    }
    
    return {
      pages,
      totalPages: numPages,
      previewImage: pages[0].imageUrl,
      width: pages[0].width,
      height: pages[0].height
    };
  } catch (error) {
    console.error('Error converting PDF pages to images:', error);
    throw error;
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