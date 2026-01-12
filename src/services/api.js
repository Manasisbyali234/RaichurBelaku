// Backend API service
class ApiService {
  constructor() {
    // Use environment variable for API URL, empty means localStorage only
    const apiUrl = import.meta.env.VITE_API_URL;
    this.baseURL = apiUrl ? `${apiUrl}/api` : null;
    this.isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    console.log('API Service initialized with baseURL:', this.baseURL || 'localStorage only');
  }

  // Auth methods
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const data = await response.json();
        this.isLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        return data;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      // Fallback to simple auth for development
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        this.isLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        return { success: true, message: 'Login successful' };
      } else {
        throw new Error('Invalid credentials');
      }
    }
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
  }

  // Newspaper methods
  async getNewspapers() {
    if (!this.baseURL) {
      // localStorage only mode
      return JSON.parse(localStorage.getItem('newspapers') || '[]');
    }
    
    try {
      const response = await fetch(`${this.baseURL}/newspapers`);
      if (response.ok) {
        const text = await response.text();
        return text ? JSON.parse(text) : [];
      }
    } catch (error) {
      console.log('Backend not available, using localStorage');
    }
    
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem('newspapers') || '[]');
  }

  async setTodayNewspaper(newspaperId) {
    if (!this.baseURL) {
      const newspapers = JSON.parse(localStorage.getItem('newspapers') || '[]');
      newspapers.forEach(n => n.isToday = n.id === newspaperId || n._id === newspaperId);
      localStorage.setItem('newspapers', JSON.stringify(newspapers));
      return { success: true };
    }
    
    try {
      const response = await fetch(`${this.baseURL}/newspapers/${newspaperId}/set-today`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error setting today\'s newspaper:', error);
      throw error;
    }
  }

  async getTodayNewspaper() {
    if (!this.baseURL) {
      const newspapers = JSON.parse(localStorage.getItem('newspapers') || '[]');
      const today = newspapers.find(n => n.isToday);
      return today || (newspapers.length > 0 ? newspapers[newspapers.length - 1] : null);
    }
    
    try {
      const response = await fetch(`${this.baseURL}/newspapers/today`);
      if (response.ok) {
        const text = await response.text();
        const newspaper = text ? JSON.parse(text) : null;
        console.log('Today\'s newspaper from backend:', newspaper);
        return newspaper;
      } else {
        console.log('Backend error, falling back to latest newspaper');
      }
    } catch (error) {
      console.log('Backend not available, falling back to latest newspaper');
    }
    
    // Fallback to latest newspaper if backend fails
    const newspapers = await this.getNewspapers();
    const latest = newspapers.length > 0 ? newspapers[newspapers.length - 1] : null;
    console.log('Using latest newspaper as fallback:', latest);
    return latest;
  }

  async getNewspaper(id) {
    try {
      const response = await fetch(`${this.baseURL}/newspapers/${id}`);
      if (response.ok) {
        const text = await response.text();
        const newspaper = text ? JSON.parse(text) : null;
        console.log('Fetched newspaper by ID:', id, newspaper);
        return newspaper;
      } else {
        console.error('Failed to fetch newspaper:', response.status, response.statusText);
      }
    } catch (error) {
      console.log('Backend not available, using localStorage');
    }
    
    // Fallback
    const newspapers = await this.getNewspapers();
    const found = newspapers.find(n => n.id === id || n._id === id);
    console.log('Fallback search result:', found);
    return found;
  }

  async uploadNewspaper(formData) {
    if (!this.baseURL) {
      throw new Error('Backend not configured. Please use Supabase or deploy a backend server.');
    }
    
    try {
      console.log('Uploading to backend...');
      
      // Check if backend is reachable first
      const healthCheck = await fetch(`${this.baseURL}/newspapers`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }).catch(() => null);
      
      if (!healthCheck) {
        throw new Error('Backend server is not reachable. Please check if the server is running.');
      }
      
      const response = await fetch(`${this.baseURL}/newspapers`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(30000) // 30 second timeout for upload
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Backend upload successful:', result);
        return result;
      } else {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Backend upload failed:', error);
      
      // Provide more specific error messages
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        throw new Error('Upload timeout. The file might be too large or the connection is slow.');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (error.message.includes('not reachable')) {
        throw new Error('Backend server is not running. Please start the backend server first.');
      } else {
        throw error;
      }
    }
  }

  async updateClickableAreas(id, clickableAreas) {
    try {
      console.log('Updating clickable areas for newspaper:', id, 'Areas count:', clickableAreas.length);
      
      const response = await fetch(`${this.baseURL}/newspapers/${id}/areas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clickableAreas })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Areas updated successfully in backend:', result.clickableAreas?.length || 0);
        return result;
      } else {
        const errorText = await response.text();
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Backend update failed:', error);
      
      // Fallback to localStorage
      console.log('Falling back to localStorage for area update');
      const newspapers = JSON.parse(localStorage.getItem('newspapers') || '[]');
      const index = newspapers.findIndex(n => (n.id === id || n._id === id));
      
      if (index !== -1) {
        newspapers[index].clickableAreas = clickableAreas;
        newspapers[index].areas = clickableAreas; // Compatibility
        localStorage.setItem('newspapers', JSON.stringify(newspapers));
        console.log('Areas saved to localStorage successfully');
        return newspapers[index];
      }
      
      throw new Error('Newspaper not found in localStorage either');
    }
  }

  async deleteNewspaper(id) {
    try {
      const response = await fetch(`${this.baseURL}/newspapers/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Backend not available, using localStorage');
    }
    
    // Fallback
    const newspapers = JSON.parse(localStorage.getItem('newspapers') || '[]');
    const filtered = newspapers.filter(n => n.id !== id);
    localStorage.setItem('newspapers', JSON.stringify(filtered));
    return { success: true };
  }
}

export default new ApiService();