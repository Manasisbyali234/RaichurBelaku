// LocalStorage utility functions
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Specific functions for newspaper data
export const saveNewspaper = (newspaper) => {
  const newspapers = getFromLocalStorage('newspapers') || [];
  newspapers.push(newspaper);
  saveToLocalStorage('newspapers', newspapers);
};

export const publishToday = (newspaperId) => {
  const newspapers = getNewspapers();
  const newspaper = newspapers.find(n => n.id === newspaperId);
  if (newspaper) {
    setTodaysNewspaper(newspaper);
  }
};

export const getNewspapers = () => {
  return getFromLocalStorage('newspapers') || [];
};

export const getTodaysNewspaper = () => {
  const newspapers = getNewspapers();
  return newspapers.length > 0 ? newspapers[newspapers.length - 1] : null;
};

export const setTodaysNewspaper = (newspaper) => {
  saveToLocalStorage('todaysNewspaper', newspaper);
};

export const saveClickableAreas = (newspaperId, areas) => {
  saveToLocalStorage(`areas_${newspaperId}`, areas);
};

export const getClickableAreas = (newspaperId) => {
  return getFromLocalStorage(`areas_${newspaperId}`) || [];
};