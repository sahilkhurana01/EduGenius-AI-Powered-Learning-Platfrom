import React from 'react';
import App from './App';
import ContextProvider from './context/context';
import './gemini-styles.css';

const GeminiWrapper = ({ userRole }) => {
  return (
    <div className="gemini-wrapper">
      <div className="gemini-container">
        <ContextProvider>
          <App />
        </ContextProvider>
      </div>
    </div>
  );
};

export default GeminiWrapper; 