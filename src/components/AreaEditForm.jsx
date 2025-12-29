import React, { useState, useEffect } from 'react';

const AreaEditForm = ({ area, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (area) {
      setFormData({
        title: area.title || '',
        content: area.content || '',
        imageUrl: area.imageUrl || ''
      });
    }
  }, [area]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...area, ...formData });
  };

  if (!area) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-newspaper-blue text-white">
          <h3 className="text-lg font-semibold">ಪ್ರದೇಶ ವಿಷಯ ಸಂಪಾದನೆ</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-blue-700"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ಸುದ್ದಿ ಶೀರ್ಷಿಕೆ *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
              placeholder="ಸುದ್ದಿ ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ಸುದ್ದಿ ವಿಷಯ *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
              placeholder="ಸುದ್ದಿ ವಿಷಯ ನಮೂದಿಸಿ..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ಚಿತ್ರ URL (ಐಚ್ಛಿಕ)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              ರದ್ದುಮಾಡಿ
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-newspaper-blue text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              ಉಳಿಸಿ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AreaEditForm;