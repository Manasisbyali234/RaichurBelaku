import { createClient } from '@supabase/supabase-js';

let supabase = null;

// Initialize Supabase client safely
const initSupabase = () => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
      console.log('Supabase not configured, using localStorage only');
      return null;
    }
    
    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return null;
  }
};

// Initialize on module load
supabase = initSupabase();

// Check if Supabase is available
const isSupabaseAvailable = () => {
  return supabase !== null;
};

// Export isSupabaseAvailable function
export { isSupabaseAvailable };

// Save newspaper
export const saveNewspaper = async (newspaper, pdfFile = null) => {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase not available');
  }
  
  try {
    let pdfUrl = null;
    
    // Upload PDF file if provided
    if (pdfFile) {
      pdfUrl = await uploadPDFFile(pdfFile, newspaper.id);
    }
    
    const { data, error } = await supabase
      .from('newspapers')
      .upsert({
        id: newspaper.id,
        name: newspaper.name,
        date: newspaper.date,
        pages: newspaper.pages,
        total_pages: newspaper.totalPages,
        preview_image: newspaper.previewImage,
        width: newspaper.width,
        height: newspaper.height,
        areas: newspaper.areas || [],
        pdf_url: pdfUrl,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return newspaper.id;
  } catch (error) {
    console.error('Error saving newspaper:', error);
    throw error;
  }
};

// Get all newspapers
export const getNewspapers = async () => {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase not available');
  }
  
  try {
    const { data, error } = await supabase
      .from('newspapers')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      date: item.date,
      pages: item.pages,
      totalPages: item.total_pages,
      previewImage: item.preview_image,
      width: item.width,
      height: item.height,
      areas: item.areas || [],
      pdfUrl: item.pdf_url
    }));
  } catch (error) {
    console.error('Error getting newspapers:', error);
    throw error;
  }
};

// Get newspaper by ID
export const getNewspaperById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('newspapers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      date: data.date,
      pages: data.pages,
      totalPages: data.total_pages,
      previewImage: data.preview_image,
      width: data.width,
      height: data.height,
      areas: data.areas || [],
      pdfUrl: data.pdf_url
    };
  } catch (error) {
    console.error('Error getting newspaper:', error);
    return null;
  }
};

// Delete newspaper
export const deleteNewspaper = async (id) => {
  try {
    const { error } = await supabase
      .from('newspapers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting newspaper:', error);
    return false;
  }
};

// Save clickable areas
export const saveClickableAreas = async (newspaperId, areas) => {
  try {
    const { error } = await supabase
      .from('newspapers')
      .update({ 
        areas: areas,
        updated_at: new Date().toISOString()
      })
      .eq('id', newspaperId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving areas:', error);
    return false;
  }
};

// Get clickable areas
export const getClickableAreas = async (newspaperId) => {
  try {
    const { data, error } = await supabase
      .from('newspapers')
      .select('areas')
      .eq('id', newspaperId)
      .single();

    if (error) throw error;
    return data?.areas || [];
  } catch (error) {
    console.error('Error getting areas:', error);
    return [];
  }
};

// Get today's newspaper
export const getTodaysNewspaper = async () => {
  try {
    const { data, error } = await supabase
      .from('todays_newspaper')
      .select('newspaper_id')
      .single();

    if (error) return null;
    
    return await getNewspaperById(data.newspaper_id);
  } catch (error) {
    console.error('Error getting today\'s newspaper:', error);
    return null;
  }
};

// Set today's newspaper
export const setTodaysNewspaper = async (newspaper) => {
  try {
    const { error } = await supabase
      .from('todays_newspaper')
      .upsert({
        id: 1,
        newspaper_id: newspaper.id,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
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

// Upload PDF file to Supabase Storage
export const uploadPDFFile = async (file, newspaperId) => {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase not available');
  }
  
  try {
    const fileName = `${newspaperId}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('newspapers')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('newspapers')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

// Check storage status
export const getStorageStatus = () => {
  return {
    usingFirebase: false,
    storageType: isSupabaseAvailable() ? 'Supabase Cloud' : 'Local Storage'
  };
};

// Cleanup old newspapers to free space
export const cleanupOldNewspapers = async (keepCount = 10) => {
  try {
    const newspapers = await getNewspapers();
    if (newspapers.length <= keepCount) return 0;
    
    const toDelete = newspapers.slice(keepCount);
    
    for (const newspaper of toDelete) {
      await deleteNewspaper(newspaper.id);
    }
    
    return toDelete.length;
  } catch (error) {
    console.error('Error cleaning up newspapers:', error);
    return 0;
  }
};

// Clear all data
export const clearAllData = async () => {
  try {
    await supabase.from('newspapers').delete().neq('id', '');
    await supabase.from('todays_newspaper').delete().neq('id', 0);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Create backup
export const createBackup = async () => {
  try {
    const newspapers = await getNewspapers();
    const todaysNewspaper = await getTodaysNewspaper();
    
    const data = {
      newspapers,
      todaysNewspaper: todaysNewspaper?.id || null,
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
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.newspapers) {
          for (const newspaper of data.newspapers) {
            await saveNewspaper(newspaper);
          }
        }
        
        if (data.todaysNewspaper) {
          const newspaper = await getNewspaperById(data.todaysNewspaper);
          if (newspaper) {
            await setTodaysNewspaper(newspaper);
          }
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

// Test functionality
export const testLocalStorage = async () => {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase not available');
  }
  
  try {
    const testNewspaper = {
      id: 'test-' + Date.now(),
      name: 'Test Connection',
      date: new Date().toISOString(),
      pages: [],
      totalPages: 1,
      areas: []
    };
    
    await saveNewspaper(testNewspaper);
    const retrieved = await getNewspaperById(testNewspaper.id);
    await deleteNewspaper(testNewspaper.id);
    
    console.log('Supabase test:', retrieved ? 'PASS' : 'FAIL');
    return !!retrieved;
  } catch (error) {
    console.error('Supabase test failed:', error);
    throw error;
  }
};

// Force save test data
export const forceSaveTest = async () => {
  try {
    const testNewspaper = {
      id: 'test-' + Date.now(),
      name: 'Test Newspaper',
      date: new Date().toISOString(),
      pages: [],
      totalPages: 1,
      areas: []
    };
    
    await saveNewspaper(testNewspaper);
    return true;
  } catch (error) {
    console.error('Force save test failed:', error);
    return false;
  }
};