import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { auth } from './Components/Firebase.jsx'

// Import auth persistence utility
import { restoreSessionFromLocalStorage } from './utils/AuthPersistence'
import { initializeGoogleTranslate, getInitialLanguagePreference, supportedLanguages } from './utils/LanguageService'

// Get base URL from Vite environment
const BASE_URL = import.meta.env.BASE_URL || '/';

// Initialize Firebase
// Note: Firebase is already initialized in the Components/Firebase.jsx file

// Initialize Google Translate
window.googleTranslateElementInit = function() {
  try {
    // Don't proceed if Google API is not fully loaded
    if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
      console.warn('Google Translate API not fully loaded');
      return;
    }
  
    // Get the container element
    const container = document.getElementById('google_translate_element');
    if (!container) {
      console.warn('Google Translate container element not found');
      return;
    }
    
    // Clear the container first
    container.innerHTML = '';
    
    // Initialize with options for full page translation
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: supportedLanguages.map(lang => lang.code).join(','),
        autoDisplay: false,
        multilanguagePage: false,
        gaTrack: false,
        layout: window.google.translate.TranslateElement.InlineLayout.NO_IFRAME,
        floatPosition: 0,
        disableTruncation: true
      },
      'google_translate_element'
    );
    
    console.log('Google Translate initialized successfully');
    
    // Apply saved language with a delay to let the widget fully initialize
    setTimeout(() => {
      try {
        const savedLang = getInitialLanguagePreference();
        if (savedLang && savedLang !== 'en') {
          console.log(`Attempting to apply saved language: ${savedLang}`);
          const selectElement = document.querySelector('.goog-te-combo');
          if (selectElement) {
            selectElement.value = savedLang;
            selectElement.dispatchEvent(new Event('change'));
            console.log(`Applied saved language: ${savedLang}`);
          } else {
            console.warn('Google Translate dropdown not found after initialization');
            // Try direct translation method as fallback
            if (window.google && window.google.translate && window.google.translate.TranslateElement) {
              container.innerHTML = '';
              new window.google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  includedLanguages: savedLang,
                  autoDisplay: true,
                  gaTrack: false,
                },
                'google_translate_element'
              );
            }
          }
        }
      } catch (err) {
        console.error('Error applying saved language preference:', err);
      }
    }, 2000);
  } catch (error) {
    console.error('Failed to initialize Google Translate:', error);
    sessionStorage.setItem('google_translate_blocked', 'true');
  }
};

// Load Google Translate script
const loadGoogleTranslate = () => {
  // If script already exists, don't create another one
  if (document.getElementById('google-translate-script')) {
    console.log('Google Translate script already exists, not reloading');
    return;
  }
  
  console.log('Loading Google Translate script...');
  
  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  
  // Add load event listener
  script.onload = () => {
    console.log('Google Translate script loaded successfully');
    
    // Create a custom event that components can listen for
    const event = new CustomEvent('google-translate-loaded');
    document.dispatchEvent(event);
  };
  
  script.onerror = (error) => {
    console.error('Google Translate script failed to load:', error);
    sessionStorage.setItem('google_translate_blocked', 'true');
  };
  
  document.head.appendChild(script);
};

// Expose the function globally
window.loadGoogleTranslate = loadGoogleTranslate;

// Call it immediately
loadGoogleTranslate();

// Restore session from localStorage if needed
restoreSessionFromLocalStorage();

// For debugging purposes - to check if user is persisted correctly
const checkAuthState = () => {
  const userAuthenticated = localStorage.getItem('userAuthenticated');
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');
  const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
  console.log('Auth check on app start:');
  console.log('localStorage userAuthenticated:', userAuthenticated);
  console.log('sessionStorage isAuthenticated:', isAuthenticated);
  console.log('userRole:', userRole);
};

// Call the check function
checkAuthState();

// import Login from './Components/Login.jsx'

// Render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
