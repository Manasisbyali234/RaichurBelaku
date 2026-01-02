const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('adminToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('adminToken', data.token);
    }
    
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  // Newspaper methods
  async getNewspapers() {
    return this.request('/newspapers');
  }

  async getTodayNewspaper() {
    return this.request('/newspapers/today');
  }

  async getNewspaper(id) {
    return this.request(`/newspapers/${id}`);
  }

  async uploadNewspaper(formData) {
    try {
      return await this.request('/newspapers/upload', {
        method: 'POST',
        headers: {}, // Remove Content-Type to let browser set it for FormData
        body: formData,
      });
    } catch (error) {
      // Re-throw with original message for Kannada error handling
      throw new Error(error.message);
    }
  }

  async updateClickableAreas(id, clickableAreas) {
    return this.request(`/newspapers/${id}/areas`, {
      method: 'PUT',
      body: JSON.stringify({ clickableAreas }),
    });
  }

  async deleteNewspaper(id) {
    return this.request(`/newspapers/${id}`, {
      method: 'DELETE',
    });
  }

  async validatePDF(file) {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('name', file.name);
    formData.append('date', new Date().toISOString());
    
    // Create a dummy image for validation
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    canvas.toBlob((blob) => {
      formData.append('image', blob, 'dummy.png');
    });
    
    return this.uploadNewspaper(formData);
  }
}

export default new ApiService();