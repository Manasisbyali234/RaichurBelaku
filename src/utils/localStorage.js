const API_BASE = '/.netlify/functions';

// API helper
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : null
  });
  return response.json();
};

export const saveNewspaper = async (newspaper) => {
  try {
    const newspapers = await getNewspapers();
    const existingIndex = newspapers.findIndex(n => n.id === newspaper.id);
    
    if (existingIndex >= 0) {
      newspapers[existingIndex] = { ...newspaper, updatedAt: new Date().toISOString() };
    } else {
      newspapers.push({ ...newspaper, updatedAt: new Date().toISOString() });
    }
    
    await apiCall('/newspapers', 'POST', newspapers);
    return newspaper.id;
  } catch (error) {
    console.error('Error saving newspaper:', error);
    throw error;
  }
};

export const getNewspapers = async () => {
  try {
    const newspapers = await apiCall('/newspapers');
    return Array.isArray(newspapers) ? newspapers : [];
  } catch (error) {
    console.error('Error getting newspapers:', error);
    return [];
  }
};

export const getNewspaperById = async (id) => {
  try {
    const newspapers = await getNewspapers();
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
export const getTodaysNewspaper = () => {
  try {
    const stored = localStorage.getItem(TODAY_KEY);
    if (!stored) return null;
    
    const todayData = JSON.parse(stored);
    if (!todayData || !todayData.newspaperId) return null;
    
    return getNewspaperById(todayData.newspaperId);
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