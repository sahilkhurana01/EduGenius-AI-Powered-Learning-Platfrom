import React from 'react';
import { useNavigate } from 'react-router-dom';

const GeminiWrapper = ({ userRole }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (userRole === 'student') {
      navigate('/student-dashboard');
    } else if (userRole === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="gemini-wrapper">
      <div className="back-button-container" style={{ 
        position: 'fixed', 
        top: '10px', 
        left: '10px', 
        zIndex: 1000, 
        backgroundColor: '#f0f9ff',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={handleBack}
          className="back-button flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>
      
      {/* Load the Gemini app in an iframe - using the correct path */}
      <iframe 
        src={`${window.location.origin}/Gemini/edu-gemini/index.html`}
        style={{ 
          width: '100%', 
          height: '100vh', 
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        title="EduGenius AI"
      />
    </div>
  );
};

export default GeminiWrapper; 