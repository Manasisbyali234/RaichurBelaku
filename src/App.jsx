import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewsPage from './pages/NewsPage';
import Archive from './pages/Archive';
import AdminDashboard from './pages/AdminDashboard';
import NewsTab from './components/NewsTab';

function App() {
  return (
    <Router>
      <div className="App font-kannada">
        <Routes>
          {/* News article route (opens in new tab) */}
          <Route path="/news/:newspaperId/:areaId" element={<NewsTab />} />
          
          {/* Main application routes with navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/today" element={<NewsPage />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/newspaper/:newspaperId" element={<NewsPage />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;