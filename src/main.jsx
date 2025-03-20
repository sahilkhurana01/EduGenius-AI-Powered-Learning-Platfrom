import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize Google Translate function
window.googleTranslateElementInit = function() {
  // We'll initialize Google Translate through our LanguageService
  // This is just a placeholder for the callback
};

// import Login from './Components/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <App />
    
  </StrictMode>,
)
