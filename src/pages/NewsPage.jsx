import React from 'react';
import { useParams } from 'react-router-dom';
import { getTodaysNewspaper, getNewspapers } from '../utils/localStorage';
import NewspaperViewer from '../components/NewspaperViewer';

const NewsPage = () => {
  const { newspaperId } = useParams();
  const todaysNewspaper = getTodaysNewspaper();
  
  let newspaper;
  if (newspaperId) {
    const newspapers = getNewspapers();
    newspaper = newspapers.find(n => n.id === newspaperId);
  } else {
    newspaper = todaysNewspaper;
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