// Frontend-only API service using localStorage
class ApiService {
  constructor() {
    this.isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  }

  // Auth methods
  async login(credentials) {
    // Simple frontend-only authentication
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      this.isLoggedIn = true;
      localStorage.setItem('adminLoggedIn', 'true');
      return { success: true, message: 'Login successful' };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
  }

  // Newspaper methods using localStorage
  async getNewspapers() {
    const newspapers = JSON.parse(localStorage.getItem('newspapers') || '[]');
    return newspapers;
  }

  async getTodayNewspaper() {
    const newspapers = await this.getNewspapers();
    const today = new Date().toDateString();
    return newspapers.find(n => new Date(n.date).toDateString() === today) || newspapers[0];
  }

  async getNewspaper(id) {
    const newspapers = await this.getNewspapers();
    return newspapers.find(n => n.id === id);
  }

  async uploadNewspaper(formData) {
    try {
      const file = formData.get('pdf');
      const name = formData.get('name') || file.name.replace('.pdf', '');
      const date = formData.get('date') || new Date().toISOString();
      
      // Create newspaper object
      const newspaper = {
        id: Date.now().toString(),
        name,
        date,
        pdfUrl: URL.createObjectURL(file), // Create blob URL for PDF
        imageUrl: null, // Will be set by the upload component
        clickableAreas: []
      };
      
      // Save to localStorage
      const newspapers = await this.getNewspapers();
      newspapers.unshift(newspaper);
      localStorage.setItem('newspapers', JSON.stringify(newspapers));
      
      return newspaper;
    } catch (error) {
      throw new Error('PDF upload failed: ' + error.message);
    }
  }

  async updateClickableAreas(id, clickableAreas) {
    const newspapers = await this.getNewspapers();
    const index = newspapers.findIndex(n => n.id === id);
    
    if (index !== -1) {
      newspapers[index].clickableAreas = clickableAreas;
      localStorage.setItem('newspapers', JSON.stringify(newspapers));
      return newspapers[index];
    }
    
    throw new Error('Newspaper not found');
  }

  async deleteNewspaper(id) {
    const newspapers = await this.getNewspapers();
    const filtered = newspapers.filter(n => n.id !== id);
    localStorage.setItem('newspapers', JSON.stringify(filtered));
    return { success: true };
  }
}

export default new ApiService();