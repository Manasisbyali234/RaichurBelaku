// localStorage-based storage utilities
const NEWSPAPERS_KEY = 'newspapers';
const TODAY_KEY = 'todaysNewspaper';

// Save newspaper
export const saveNewspaper = async (newspaper, pdfFile = null) => {
  try {
    // Convert PDF to base64 if provided
    if (pdfFile) {
      const reader = new FileReader();
      const pdfData = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(pdfFile);
      });
      newspaper.pdfData = pdfData;
    }
    
    const newspapers = getNewspapers();
    const existingIndex = newspapers.findIndex(n => n.id === newspaper.id);
    
    if (existingIndex >= 0) {
      newspapers[existingIndex] = { ...newspaper, updatedAt: new Date().toISOString() };
    } else {
      newspapers.push({ ...newspaper, updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify(newspapers));
    return newspaper.id;
  } catch (error) {
    console.error('Error saving newspaper:', error);
    throw error;
  }
};

// Get all newspapers
export const getNewspapers = () => {
  try {
    const stored = localStorage.getItem(NEWSPAPERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting newspapers:', error);
    return [];
  }
};

// Get newspaper by ID
export const getNewspaperById = async (id) => {
  try {
    const newspapers = getNewspapers();
    return newspapers.find(n => n.id === id) || null;
  } catch (error) {
    console.error('Error getting newspaper:', error);
    return null;
  }
};

// Delete newspaper
export const deleteNewspaper = async (id) => {
  try {
    const newspapers = getNewspapers();
    const filtered = newspapers.filter(n => n.id !== id);
    localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify(filtered));
    
    // Clear from today's newspaper if it's the current one
    const todaysNewspaper = await getTodaysNewspaper();
    if (todaysNewspaper && todaysNewspaper.id === id) {
      localStorage.removeItem(TODAY_KEY);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting newspaper:', error);
    return false;
  }
};

// Save clickable areas
export const saveClickableAreas = async (newspaperId, areas) => {
  try {
    const newspapers = getNewspapers();
    const index = newspapers.findIndex(n => n.id === newspaperId);
    
    if (index >= 0) {
      newspapers[index].areas = areas;
      newspapers[index].updatedAt = new Date().toISOString();
      localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify(newspapers));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving areas:', error);
    return false;
  }
};

// Get clickable areas
export const getClickableAreas = async (newspaperId) => {
  try {
    const newspaper = await getNewspaperById(newspaperId);
    return newspaper?.areas || [];
  } catch (error) {
    console.error('Error getting areas:', error);
    return [];
  }
};

// Get today's newspaper
export const getTodaysNewspaper = async () => {
  try {
    const stored = localStorage.getItem(TODAY_KEY);
    if (stored) {
      const todayData = JSON.parse(stored);
      return await getNewspaperById(todayData.newspaperId);
    }
    return null;
  } catch (error) {
    console.error('Error getting today\'s newspaper:', error);
    return null;
  }
};

// Set today's newspaper
export const setTodaysNewspaper = async (newspaper) => {
  try {
    localStorage.setItem(TODAY_KEY, JSON.stringify({ 
      newspaperId: newspaper.id,
      updatedAt: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.error('Error setting today\'s newspaper:', error);
    return false;
  }
};

// Publish newspaper as today's edition
export const publishToday = async (newspaperId) => {
  try {
    const newspaper = await getNewspaperById(newspaperId);
    if (newspaper) {
      await setTodaysNewspaper(newspaper);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error publishing newspaper:', error);
    return false;
  }
};

// Check storage status
export const getStorageStatus = () => {
  return {
    usingFirebase: false,
    storageType: 'localStorage Only'
  };
};