// localStorage-based storage utilities
const NEWSPAPERS_KEY = 'newspapers';
const TODAY_KEY = 'todaysNewspaper';

// Save newspaper with storage optimization
export const saveNewspaper = async (newspaper, pdfFile = null) => {
  try {
    // Don't store PDF data to save space
    const optimizedNewspaper = { ...newspaper };
    delete optimizedNewspaper.pdfData;
    
    const newspapers = getNewspapers();
    const existingIndex = newspapers.findIndex(n => n.id === newspaper.id);
    
    if (existingIndex >= 0) {
      newspapers[existingIndex] = { ...optimizedNewspaper, updatedAt: new Date().toISOString() };
    } else {
      newspapers.push({ ...optimizedNewspaper, updatedAt: new Date().toISOString() });
    }
    
    // Check storage size before saving
    const testData = JSON.stringify(newspapers);
    if (testData.length > 3 * 1024 * 1024) { // 3MB limit (reduced from 4.5MB)
      // Auto-cleanup: keep only 2 most recent newspapers
      const sorted = newspapers.sort((a, b) => new Date(b.date) - new Date(a.date));
      const cleaned = sorted.slice(0, 2);
      const deletedCount = newspapers.length - 2;
      localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify(cleaned));
      throw new Error(`ಸ್ಟೋರೇಜ್ ಸ್ಥಳ ನಿಂದಿದೆ. ${deletedCount} ಹಳೆಯ ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಲಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.`);
    }
    
    localStorage.setItem(NEWSPAPERS_KEY, testData);
    return newspaper.id;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // Emergency cleanup - keep only 1 newspaper
      try {
        const newspapers = getNewspapers();
        if (newspapers.length > 0) {
          const latest = newspapers.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify([latest]));
          throw new Error('ಎಮರ್ಜೆನ್ಸಿ ಕ್ಲೀನಪ್: ಕೊನೆಯ ಪತ್ರಿಕೆ ಮಾತ್ರ ಉಳಿಸಲಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.');
        } else {
          localStorage.clear();
          throw new Error('ಸ್ಟೋರೇಜ್ ಕ್ಲಿಯರ್ ಮಾಡಲಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.');
        }
      } catch (clearError) {
        throw new Error('ಸ್ಟೋರೇಜ್ ಸಮಸ್ಯೆ. ಬ್ರೌಸರ್ ರೀಸ್ಟಾರ್ಟ್ ಮಾಡಿ.');
      }
    }
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

// Get storage usage info
export const getStorageInfo = () => {
  try {
    const newspapers = getNewspapers();
    const dataSize = JSON.stringify(newspapers).length;
    const maxSize = 5 * 1024 * 1024; // 5MB estimate
    
    return {
      newspaperCount: newspapers.length,
      usedBytes: dataSize,
      usedMB: (dataSize / (1024 * 1024)).toFixed(2),
      maxMB: (maxSize / (1024 * 1024)).toFixed(2),
      usagePercent: Math.round((dataSize / maxSize) * 100),
      canAddMore: dataSize < (maxSize * 0.8)
    };
  } catch (error) {
    return {
      newspaperCount: 0,
      usedBytes: 0,
      usedMB: '0.00',
      maxMB: '5.00',
      usagePercent: 0,
      canAddMore: true
    };
  }
};

// Cleanup old newspapers to free space
export const cleanupOldNewspapers = (keepCount = 2) => {
  try {
    const newspapers = getNewspapers();
    if (newspapers.length <= keepCount) return 0;
    
    const sorted = newspapers.sort((a, b) => new Date(b.date) - new Date(a.date));
    const toKeep = sorted.slice(0, keepCount);
    
    localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify(toKeep));
    return newspapers.length - keepCount;
  } catch (error) {
    console.error('Error cleaning up newspapers:', error);
    return 0;
  }
};

// Clear all data
export const clearAllData = () => {
  try {
    localStorage.removeItem(NEWSPAPERS_KEY);
    localStorage.removeItem(TODAY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Create backup
export const createBackup = () => {
  try {
    const data = {
      newspapers: getNewspapers(),
      todaysNewspaper: localStorage.getItem(TODAY_KEY),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raichuru-belaku-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error creating backup:', error);
    return false;
  }
};

// Restore from backup
export const restoreFromBackup = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.newspapers) {
          localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify(data.newspapers));
        }
        if (data.todaysNewspaper) {
          localStorage.setItem(TODAY_KEY, data.todaysNewspaper);
        }
        resolve(true);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Test localStorage functionality
export const testLocalStorage = () => {
  try {
    const testKey = 'test-' + Date.now();
    const testValue = 'test-value';
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    console.log('localStorage test:', retrieved === testValue ? 'PASS' : 'FAIL');
    return retrieved === testValue;
  } catch (error) {
    console.error('localStorage test failed:', error);
    return false;
  }
};

// Force save test data
export const forceSaveTest = () => {
  try {
    const testNewspaper = {
      id: 'test-' + Date.now(),
      name: 'Test Newspaper',
      date: new Date().toISOString(),
      pages: [],
      totalPages: 1,
      areas: []
    };
    
    const newspapers = getNewspapers();
    newspapers.push(testNewspaper);
    localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify(newspapers));
    return true;
  } catch (error) {
    console.error('Force save test failed:', error);
    return false;
  }
};