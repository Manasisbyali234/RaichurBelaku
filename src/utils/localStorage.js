// Hybrid storage utilities - localStorage for dev, Supabase for production
import * as supabaseStorage from './supabaseStorage';

const NEWSPAPERS_KEY = 'newspapers';
const TODAY_KEY = 'todaysNewspaper';

// Safe JSON parse helper
const safeJsonParse = (str, fallback = null) => {
  try {
    if (!str || str.trim() === '') return fallback;
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
};

// Check if we should use Supabase
const useSupabase = () => {
  // For now, always use localStorage to avoid Supabase dependency
  return false;
};

// Save newspaper with storage optimization
export const saveNewspaper = (newspaper, pdfFile = null) => {
  try {
    const optimizedNewspaper = { ...newspaper };
    delete optimizedNewspaper.pdfData;
    
    const newspapers = getNewspapers();
    const existingIndex = newspapers.findIndex(n => n.id === newspaper.id);
    
    if (existingIndex >= 0) {
      newspapers[existingIndex] = { ...optimizedNewspaper, updatedAt: new Date().toISOString() };
    } else {
      newspapers.push({ ...optimizedNewspaper, updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify(newspapers));
    return newspaper.id;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // Emergency cleanup - keep only 1 newspaper
      const newspapers = getNewspapers();
      if (newspapers.length > 0) {
        const latest = newspapers.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify([latest]));
        throw new Error('ಸ್ಟೋರೇಜ್ ಪೂರ್ಣ. ಕೊನೆಯ ಪತ್ರಿಕೆ ಮಾತ್ರ ಉಳಿಸಲಾಗಿದೆ.');
      } else {
        localStorage.clear();
        throw new Error('ಸ್ಟೋರೇಜ್ ಕ್ಲಿಯರ್ ಮಾಡಲಾಗಿದೆ.');
      }
    }
    throw error;
  }
};

// Get all newspapers
export const getNewspapers = () => {
  try {
    const stored = localStorage.getItem(NEWSPAPERS_KEY);
    const newspapers = safeJsonParse(stored, []);
    return Array.isArray(newspapers) ? newspapers : [];
  } catch (error) {
    console.error('Error getting newspapers:', error);
    localStorage.removeItem(NEWSPAPERS_KEY);
    return [];
  }
};

// Get newspaper by ID
export const getNewspaperById = (id) => {
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
  if (useSupabase()) {
    return await supabaseStorage.deleteNewspaper(id);
  }
  
  try {
    const newspapers = await getNewspapers();
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
export const saveClickableAreas = (newspaperId, areas) => {
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
export const getClickableAreas = (newspaperId) => {
  try {
    const newspaper = getNewspaperById(newspaperId);
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
    const todayData = safeJsonParse(stored, null);
    if (!todayData || !todayData.newspaperId) return null;
    
    return await getNewspaperById(todayData.newspaperId);
  } catch (error) {
    console.error('Error getting today\'s newspaper:', error);
    localStorage.removeItem(TODAY_KEY);
    return null;
  }
};

// Set today's newspaper
export const setTodaysNewspaper = async (newspaper) => {
  if (useSupabase()) {
    return await supabaseStorage.setTodaysNewspaper(newspaper);
  }
  
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
  if (useSupabase()) {
    return await supabaseStorage.publishToday(newspaperId);
  }
  
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
  if (useSupabase()) {
    return supabaseStorage.getStorageStatus();
  }
  
  return {
    usingFirebase: false,
    storageType: 'localStorage Only'
  };
};

// Get storage usage info
export const getStorageInfo = async () => {
  if (useSupabase()) {
    try {
      const newspapers = await getNewspapers();
      return {
        newspaperCount: newspapers.length,
        usedBytes: 0,
        usedMB: '0.00',
        maxMB: 'Unlimited',
        usagePercent: 0,
        canAddMore: true
      };
    } catch (error) {
      return {
        newspaperCount: 0,
        usedBytes: 0,
        usedMB: '0.00',
        maxMB: 'Unlimited',
        usagePercent: 0,
        canAddMore: true
      };
    }
  }
  
  try {
    const newspapers = await getNewspapers();
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
export const cleanupOldNewspapers = async (keepCount = 2) => {
  if (useSupabase()) {
    return await supabaseStorage.cleanupOldNewspapers(keepCount);
  }
  
  try {
    const newspapers = await getNewspapers();
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
export const clearAllData = async () => {
  if (useSupabase()) {
    return await supabaseStorage.clearAllData();
  }
  
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
export const createBackup = async () => {
  if (useSupabase()) {
    return await supabaseStorage.createBackup();
  }
  
  try {
    const data = {
      newspapers: await getNewspapers(),
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
  if (useSupabase()) {
    return await supabaseStorage.restoreFromBackup(file);
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = safeJsonParse(e.target.result, null);
        if (!data) {
          reject(new Error('Invalid backup file format'));
          return;
        }
        
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
export const testLocalStorage = async () => {
  if (useSupabase()) {
    try {
      return await supabaseStorage.testLocalStorage();
    } catch (error) {
      console.error('Supabase test failed, testing localStorage:', error);
      // Continue to test localStorage
    }
  }
  
  try {
    // Check if localStorage is available
    if (typeof Storage === 'undefined' || !window.localStorage) {
      console.error('localStorage is not available');
      return false;
    }
    
    const testKey = 'test-' + Date.now();
    const testValue = 'test-value';
    
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    const success = retrieved === testValue;
    console.log('localStorage test:', success ? 'PASS' : 'FAIL');
    return success;
  } catch (error) {
    console.error('localStorage test failed:', error);
    return false;
  }
};

// Force save test data
export const forceSaveTest = async () => {
  if (useSupabase()) {
    return await supabaseStorage.forceSaveTest();
  }
  
  try {
    const testNewspaper = {
      id: 'test-' + Date.now(),
      name: 'Test Newspaper',
      date: new Date().toISOString(),
      pages: [],
      totalPages: 1,
      areas: []
    };
    
    const newspapers = await getNewspapers();
    newspapers.push(testNewspaper);
    localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify(newspapers));
    return true;
  } catch (error) {
    console.error('Force save test failed:', error);
    return false;
  }
};