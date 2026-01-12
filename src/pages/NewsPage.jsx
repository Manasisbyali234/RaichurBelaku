import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/api';
import NewspaperViewer from '../components/NewspaperViewer';

const NewsPage = () => {
  const { newspaperId } = useParams();
  const [newspaper, setNewspaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewspaper = async () => {
      try {
        let loadedNewspaper;
        if (newspaperId) {
          console.log('Loading newspaper by ID:', newspaperId);
          loadedNewspaper = await apiService.getNewspaper(newspaperId);
          console.log('Loaded newspaper result:', loadedNewspaper);
        } else {
          console.log('Loading today\'s newspaper...');
          loadedNewspaper = await apiService.getTodayNewspaper();
          console.log('Today\'s newspaper result:', loadedNewspaper);
          
          // If no today's newspaper is set, get the latest newspaper
          if (!loadedNewspaper) {
            console.log('No today\'s newspaper found, getting latest...');
            const allNewspapers = await apiService.getNewspapers();
            if (allNewspapers.length > 0) {
              loadedNewspaper = allNewspapers.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
              console.log('Using latest newspaper:', loadedNewspaper?.name);
            }
          }
        }
        console.log('Final loaded newspaper:', loadedNewspaper);
        if (!loadedNewspaper) {
          console.error('No newspaper could be loaded!');
        }
        setNewspaper(loadedNewspaper);
      } catch (error) {
        console.error('Error loading newspaper:', error);
        setNewspaper(null);
      } finally {
        setLoading(false);
      }
    };

    loadNewspaper();
  }, [newspaperId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-newspaper-blue mx-auto mb-4"></div>
          <p className="text-gray-600">ಪತ್ರಿಕೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <NewspaperViewer newspaper={newspaper} />
      </div>
    </div>
  );
};

export default NewsPage;