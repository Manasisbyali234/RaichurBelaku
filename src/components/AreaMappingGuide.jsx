import React, { useState } from 'react';

const AreaMappingGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "PDF ಅಪ್ಲೋಡ್ ಮಾಡಿ",
      description: "ಮೊದಲು 'PDF ಅಪ್ಲೋಡ್' ಟ್ಯಾಬ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಪತ್ರಿಕೆಯ PDF ಫೈಲ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
      icon: "📄",
      details: [
        "PDF ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ",
        "ಪತ್ರಿಕೆಯ ಹೆಸರು ನಮೂದಿಸಿ",
        "ದಿನಾಂಕ ಆಯ್ಕೆ ಮಾಡಿ",
        "'ಅಪ್ಲೋಡ್' ಬಟನ್ ಒತ್ತಿ"
      ]
    },
    {
      title: "ಪ್ರದೇಶ ಮ್ಯಾಪಿಂಗ್‌ಗೆ ಹೋಗಿ",
      description: "ಅಪ್ಲೋಡ್ ಯಶಸ್ವಿಯಾದ ನಂತರ 'ಪ್ರದೇಶ ಮ್ಯಾಪಿಂಗ್' ಟ್ಯಾಬ್‌ಗೆ ಹೋಗಿ",
      icon: "🗺️",
      details: [
        "ಪತ್ರಿಕೆಯ ಚಿತ್ರ ಕಾಣಿಸುತ್ತದೆ",
        "ಮೌಸ್ ಕರ್ಸರ್ ಕ್ರಾಸ್‌ಹೇರ್ ಆಗುತ್ತದೆ",
        "ಈಗ ಪ್ರದೇಶಗಳನ್ನು ಸೆಳೆಯಲು ಸಿದ್ಧ"
      ]
    },
    {
      title: "ಕ್ಲಿಕ್ ಮಾಡಬಹುದಾದ ಪ್ರದೇಶಗಳನ್ನು ಸೆಳೆಯಿರಿ",
      description: "ಮೌಸ್ ಡ್ರ್ಯಾಗ್ ಮಾಡಿ ಸುದ್ದಿ ಪ್ರದೇಶಗಳ ಮೇಲೆ ಆಯತಗಳನ್ನು ಸೆಳೆಯಿರಿ",
      icon: "✏️",
      details: [
        "ಸುದ್ದಿ ಪ್ರದೇಶದ ಮೇಲೆ ಮೌಸ್ ಒತ್ತಿ ಹಿಡಿಯಿರಿ",
        "ಡ್ರ್ಯಾಗ್ ಮಾಡಿ ಆಯತ ರೂಪಿಸಿ",
        "ಮೌಸ್ ಬಿಡಿ",
        "ಕನಿಷ್ಠ 10x10 ಪಿಕ್ಸೆಲ್ ಗಾತ್ರ ಬೇಕು"
      ]
    },
    {
      title: "ವಿಷಯ ಸೇರಿಸಿ",
      description: "ಪ್ರತಿ ಪ್ರದೇಶಕ್ಕೆ ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿಷಯ ಸೇರಿಸಿ",
      icon: "📝",
      details: [
        "ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ (ಅಗತ್ಯ)",
        "ಸಂಪೂರ್ಣ ಸುದ್ದಿ ವಿಷಯ ಬರೆಯಿರಿ (ಅಗತ್ಯ)",
        "ಚಿತ್ರದ URL ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)",
        "'ಸೇರಿಸಿ' ಬಟನ್ ಒತ್ತಿ"
      ]
    },
    {
      title: "ಉಳಿಸಿ ಮತ್ತು ಪ್ರಕಟಿಸಿ",
      description: "ಎಲ್ಲಾ ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಿ ಮತ್ತು ಇಂದಿನ ಪತ್ರಿಕೆಯಾಗಿ ಪ್ರಕಟಿಸಿ",
      icon: "🚀",
      details: [
        "'ಎಲ್ಲಾ ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಿ' ಒತ್ತಿ",
        "'ಪತ್ರಿಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ' ಟ್ಯಾಬ್‌ಗೆ ಹೋಗಿ",
        "'ಪ್ರಕಟಿಸಿ' ಬಟನ್ ಒತ್ತಿ",
        "ಈಗ ಬಳಕೆದಾರರು ಕ್ಲಿಕ್ ಮಾಡಬಹುದು!"
      ]
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-newspaper-blue mb-4">
        ಪ್ರದೇಶ ಮ್ಯಾಪಿಂಗ್ ಮಾರ್ಗದರ್ಶಿ
      </h2>
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            ಹಂತ {currentStep + 1} / {steps.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% ಪೂರ್ಣ
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-newspaper-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current step */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="text-4xl mr-4">{steps[currentStep].icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-newspaper-blue mb-2">ವಿವರವಾದ ಹಂತಗಳು:</h4>
          <ul className="space-y-1">
            {steps[currentStep].details.map((detail, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <span className="w-2 h-2 bg-newspaper-blue rounded-full mr-2 flex-shrink-0"></span>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          ಹಿಂದಿನ ಹಂತ
        </button>
        
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep 
                  ? 'bg-newspaper-blue' 
                  : index < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-newspaper-blue rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ಮುಂದಿನ ಹಂತ
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-800 mb-2">💡 ಸಲಹೆಗಳು:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• ಸುದ್ದಿ ಪ್ರದೇಶಗಳನ್ನು ನಿಖರವಾಗಿ ಸೆಳೆಯಿರಿ</li>
          <li>• ಪ್ರತಿ ಪ್ರದೇಶಕ್ಕೆ ಸ್ಪಷ್ಟ ಶೀರ್ಷಿಕೆ ಕೊಡಿ</li>
          <li>• ಸಂಪೂರ್ಣ ಸುದ್ದಿ ವಿಷಯ ಬರೆಯಿರಿ</li>
          <li>• ಪರೀಕ್ಷೆಗಾಗಿ 'PDF ಟೆಸ್ಟ್' ಟ್ಯಾಬ್ ಬಳಸಿ</li>
        </ul>
      </div>
    </div>
  );
};

export default AreaMappingGuide;