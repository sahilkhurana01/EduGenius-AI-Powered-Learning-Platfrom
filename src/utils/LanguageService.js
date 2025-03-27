/**
 * Language Service Utility
 * Handles language preference management and Google Translate integration
 */

// Global Google Translate state tracking
let isGoogleTranslateLoading = false;
let isGoogleTranslateLoadAttempts = 0;
const MAX_LOAD_ATTEMPTS = 3;

// Constants
export const STORAGE_KEY = 'language_preference';
export const DEFAULT_LANGUAGE = 'en';

// Helper function to check if Google Translate is fully loaded
export const isGoogleTranslateReady = () => {
  return window.google && 
         window.google.translate && 
         window.google.translate.TranslateElement &&
         typeof window.google.translate.TranslateElement === 'function';
};

// Function to wait for Google Translate to load
const waitForGoogleTranslate = (timeoutMs = 3000) => {
  return new Promise((resolve) => {
    if (isGoogleTranslateReady()) {
      return resolve(true);
    }
    
    const checkInterval = setInterval(() => {
      if (isGoogleTranslateReady()) {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        return resolve(true);
      }
    }, 100);
    
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      resolve(false);
    }, timeoutMs);
  });
};

// Expanded list of 50+ languages supported by Google Translate
export const supportedLanguages = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'eu', name: 'Basque' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'co', name: 'Corsican' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'fy', name: 'Frisian' },
  { code: 'gl', name: 'Galician' },
  { code: 'ka', name: 'Georgian' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ha', name: 'Hausa' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hmn', name: 'Hmong' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ig', name: 'Igbo' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'jv', name: 'Javanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'ko', name: 'Korean' },
  { code: 'ku', name: 'Kurdish' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'lo', name: 'Lao' },
  { code: 'la', name: 'Latin' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mt', name: 'Maltese' },
  { code: 'mi', name: 'Maori' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'my', name: 'Myanmar (Burmese)' },
  { code: 'ne', name: 'Nepali' },
  { code: 'no', name: 'Norwegian' },
  { code: 'ny', name: 'Nyanja (Chichewa)' },
  { code: 'ps', name: 'Pashto' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sm', name: 'Samoan' },
  { code: 'gd', name: 'Scots Gaelic' },
  { code: 'sr', name: 'Serbian' },
  { code: 'st', name: 'Sesotho' },
  { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'si', name: 'Sinhala' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'so', name: 'Somali' },
  { code: 'es', name: 'Spanish' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tl', name: 'Tagalog (Filipino)' },
  { code: 'tg', name: 'Tajik' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'zu', name: 'Zulu' }
];

/**
 * Get current language preference from session storage
 * @returns {string} The language code (defaults to 'en')
 */
export const getCurrentLanguage = () => {
  try {
    const savedLanguage = sessionStorage.getItem(STORAGE_KEY);
    return savedLanguage || DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('Error getting language preference:', error);
    return DEFAULT_LANGUAGE;
  }
};

/**
 * Alias for getCurrentLanguage for compatibility with existing imports
 * @returns {string} The language code (defaults to 'en')
 */
export const getInitialLanguagePreference = () => {
  return getCurrentLanguage();
};

/**
 * Set language preference
 * @param {string} langCode - The language code to set as preference
 * @param {boolean} resetOnLogout - Whether to reset language to default on logout
 */
export const setLanguagePreference = (langCode, resetOnLogout = true) => {
  try {
    if (!langCode) {
      console.error('Invalid language code');
      return;
    }
    
    // Store the language preference
    sessionStorage.setItem(STORAGE_KEY, langCode);
    
    // Store the reset preference
    sessionStorage.setItem(`${STORAGE_KEY}_reset`, resetOnLogout.toString());
    
    console.log(`Language preference set to ${langCode} (reset on logout: ${resetOnLogout})`);
  } catch (error) {
    console.error('Error setting language preference:', error);
  }
};

/**
 * Clear language preference on logout
 * Reset to default language if configured to do so
 */
export const clearLanguagePreference = () => {
  try {
    // Check if we should reset the language on logout
    const shouldReset = sessionStorage.getItem(`${STORAGE_KEY}_reset`) !== 'false';
    
    if (shouldReset) {
      // Reset to default language
      sessionStorage.setItem(STORAGE_KEY, DEFAULT_LANGUAGE);
      
      // Apply the default language
      applyGoogleTranslate(DEFAULT_LANGUAGE);
      
      console.log('Language preference reset to default');
    } else {
      console.log('Language preference preserved across logout (user preference)');
    }
    
    // Clean up the reset preference
    sessionStorage.removeItem(`${STORAGE_KEY}_reset`);
  } catch (error) {
    console.error('Error clearing language preference:', error);
  }
};

/**
 * Show a notification to the user about translation status
 * @param {string} message - The message to show
 * @param {string} type - The type of notification (error, warning, success)
 */
export const showTranslationNotification = (message, type = 'warning') => {
  try {
    // Don't show too many notifications
    if (sessionStorage.getItem('translation_notification_shown') === 'true') {
      return;
    }
    
    // Mark that we've shown a notification
    sessionStorage.setItem('translation_notification_shown', 'true');
    
    // Determine styling based on type
    let bgColor, textColor, borderColor;
    switch (type) {
      case 'error':
        bgColor = '#f8d7da';
        textColor = '#721c24';
        borderColor = '#f5c6cb';
        break;
      case 'warning':
        bgColor = '#fff3cd';
        textColor = '#856404';
        borderColor = '#ffeeba';
        break;
      case 'success':
        bgColor = '#d4edda';
        textColor = '#155724';
        borderColor = '#c3e6cb';
        break;
      default:
        bgColor = '#f8f9fa';
        textColor = '#212529';
        borderColor = '#dae0e5';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${bgColor};
      color: ${textColor};
      border: 1px solid ${borderColor};
      padding: 12px 15px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 9999;
      max-width: 320px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;
    
    notification.innerHTML = `
      <div style="margin-bottom: 5px; font-weight: bold;">Translation Status</div>
      <p style="margin: 0 0 10px 0; line-height: 1.4;">${message}</p>
      <button style="background: ${textColor}; color: white; border: none; padding: 5px 10px; border-radius: 3px; float: right; cursor: pointer;" 
              onclick="this.parentNode.remove()">OK</button>
      <div style="clear: both;"></div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 8 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.remove();
      }
    }, 8000);
    
    return true;
  } catch (error) {
    console.error('Error showing translation notification:', error);
    return false;
  }
};

// Add detection and notification for Google Translate blocking
const checkTranslateBlockedStatus = () => {
  // Already detected as blocked
  if (sessionStorage.getItem('google_translate_blocked') === 'true') {
    return true;
  }
  
  // Check for typical ad blocker behavior
  try {
    // Create an invisible element to test
    const testElement = document.createElement('div');
    testElement.id = 'google_translate_element';
    testElement.style.display = 'none';
    document.body.appendChild(testElement);
    
    // Try to detect if translate elements are being blocked
    setTimeout(() => {
      const hasTranslateElements = 
        document.querySelector('.goog-te-combo') || 
        document.querySelector('.goog-te-gadget') ||
        document.querySelector('.goog-te-menu-frame');
        
      if (!hasTranslateElements) {
        console.warn('Google Translate appears to be blocked by an ad blocker');
        sessionStorage.setItem('google_translate_blocked', 'true');
        
        // Notify the user if this is the first detection
        if (!sessionStorage.getItem('translate_block_notified')) {
          sessionStorage.setItem('translate_block_notified', 'true');
          showTranslationNotification(
            'Google Translate appears to be blocked by an ad blocker. Your language preference will be saved, but automatic translation is unavailable.',
            'warning'
          );
        }
      }
      
      // Clean up test element
      if (document.body.contains(testElement)) {
        testElement.remove();
      }
    }, 2000); // Check after 2 seconds to give Google Translate a chance to initialize
    
    return false;
  } catch (e) {
    console.error('Error checking for Google Translate blocking:', e);
    return false;
  }
};

/**
 * Initialize Google Translate Element
 * Safely creates the Google Translate Element with error handling
 * @returns {Promise<boolean>} Whether initialization was successful
 */
export const initializeGoogleTranslate = async () => {
  try {
    console.log('Initializing Google Translate Element');
    
    // If already loading, wait for it
    if (isGoogleTranslateLoading) {
      console.log('Google Translate already loading, waiting...');
      const ready = await waitForGoogleTranslate(5000);
      return ready;
    }
    
    // Safety check - only proceed if Google Translate is loaded
    if (!isGoogleTranslateReady()) {
      console.log('Google Translate not ready, attempting to load...');
      
      // Increment load attempts counter
      isGoogleTranslateLoadAttempts++;
      
      // Prevent too many attempts
      if (isGoogleTranslateLoadAttempts > MAX_LOAD_ATTEMPTS) {
        console.warn(`Exceeded max load attempts (${MAX_LOAD_ATTEMPTS})`);
        sessionStorage.setItem('google_translate_blocked', 'true');
        return false;
      }
      
      // Set loading flag
      isGoogleTranslateLoading = true;
      
      // Try to load Google Translate
      if (typeof window.loadGoogleTranslate === 'function') {
        window.loadGoogleTranslate();
        
        // Wait for it to load
        const loaded = await waitForGoogleTranslate(5000);
        isGoogleTranslateLoading = false;
        
        if (!loaded) {
          console.warn('Google Translate API failed to load within timeout');
          return false;
        }
      } else {
        console.warn('Google Translate loadGoogleTranslate function not available');
        isGoogleTranslateLoading = false;
        return false;
      }
    }
    
    // Get the container element
    const container = document.getElementById('google_translate_element');
    if (!container) {
      console.warn('Google Translate container not found');
      return false;
    }
    
    // Clear any existing content
    container.innerHTML = '';
    
    try {
      // Create with minimal options to reduce errors
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
      
      console.log('Google Translate Element initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Google Translate Element:', error);
      sessionStorage.setItem('google_translate_blocked', 'true');
      return false;
    }
  } catch (error) {
    console.error('Error in initializeGoogleTranslate:', error);
    sessionStorage.setItem('google_translate_blocked', 'true');
    isGoogleTranslateLoading = false;
    return false;
  }
};

/**
 * Apply Google Translate to change the page language
 * @param {string} langCode - The language code to switch to
 */
export const applyGoogleTranslate = (langCode) => {
  try {
    // Always store the preference regardless of whether Google Translate is available
    sessionStorage.setItem(STORAGE_KEY, langCode);
    console.log(`Language preference set to ${langCode}`);
    
    // If Google Translate is blocked, just save the preference
    if (sessionStorage.getItem('google_translate_blocked') === 'true') {
      console.log('Google Translate is blocked - language preference saved but translation not applied');
      return;
    }
    
    // If it's the default language (English), no translation needed
    if (langCode === DEFAULT_LANGUAGE) {
      try {
        // Try to find the "No translation" or "Show original" button to reset
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
          selectElement.value = DEFAULT_LANGUAGE;
          selectElement.dispatchEvent(new Event('change'));
          
          // Remove translate bar
          setTimeout(removeTranslateBar, 500);
          return;
        }
        
        // Alternative: try to reset via URL method
        if (document.location.href.includes('&tl=')) {
          const url = document.location.href.replace(/&tl=[^&]*/, '');
          window.history.replaceState({}, document.title, url);
          window.location.reload();
          return;
        }
      } catch (e) {
        console.warn('Could not reset translation:', e);
      }
      return;
    }
    
    // Check if Google Translate is loaded
    if (!window.google || !window.google.translate) {
      console.warn('Google Translate not loaded yet, attempting to load');
      
      // Make sure the script is loaded
      if (typeof window.loadGoogleTranslate === 'function') {
        window.loadGoogleTranslate();
        
        // Set a timeout to try again after the script loads
        setTimeout(() => {
          applyGoogleTranslate(langCode);
        }, 2000);
      }
      return;
    }
    
    // Safely try to find and use the dropdown
    try {
      // First try: Find the language selector dropdown
      const selectElement = document.querySelector('.goog-te-combo');
      
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change'));
        
        // Remove translate bar after translation is applied
        setTimeout(removeTranslateBar, 1000);
        return;
      }
      
      // Second try: Look for Google Translate directly in iframes or other elements
      try {
        const frame = document.querySelector('.goog-te-menu-frame');
        if (frame) {
          const innerDoc = frame.contentDocument || frame.contentWindow.document;
          const items = innerDoc.querySelectorAll('.goog-te-menu2-item');
          for (let i = 0; i < items.length; i++) {
            if (items[i].textContent.includes(supportedLanguages.find(l => l.code === langCode)?.name)) {
              items[i].click();
              
              // Remove translate bar
              setTimeout(removeTranslateBar, 1000);
              return;
            }
          }
        }
      } catch (e) {
        console.warn('Could not find translation in frame:', e);
      }
      
      // Third try: If no dropdown found but API is available, do a full re-initialization
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        console.log('Reinitializing Google Translate Element for language:', langCode);
        
        const container = document.getElementById('google_translate_element');
        if (container) {
          // Clear and create a new translation element with specific language target
          container.innerHTML = '';
          try {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: langCode,
                autoDisplay: true,
                multilanguagePage: false,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
              },
              'google_translate_element'
            );
            
            // Remove translate bar after new element is initialized
            setTimeout(removeTranslateBar, 1500);
            
            // Last effort - try direct URL method
            // This injects a special script that forces translation
            const script = document.createElement('script');
            script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&tl=${langCode}`;
            script.async = true;
            document.body.appendChild(script);
            
            // Final attempt to remove translate bar
            setTimeout(removeTranslateBar, 2500);
            return;
          } catch (err) {
            console.error('Error reinitializing Google Translate:', err);
          }
        }
      }
      
      console.warn('All Google Translate methods failed - language preference saved but not applied');
    } catch (error) {
      console.error('Error applying language change:', error);
    }
  } catch (error) {
    console.error('Error applying Google Translate:', error);
  }
};

/**
 * Enhance logout function to reset language preferences
 * @param {Function} originalLogoutFn - The original logout function to enhance
 * @returns {Function} - Enhanced logout function
 */
export const enhanceLogoutWithLanguageReset = (originalLogoutFn) => {
  return (...args) => {
    // Clear language preference first
    clearLanguagePreference();
    
    // Call the original logout function
    return originalLogoutFn(...args);
  };
};

/**
 * Translation dictionary for key UI elements when Google Translate is blocked
 * This is a fallback when the automatic translation service is unavailable
 */
const manualTranslations = {
  'en': {
    'Save Changes': 'Save Changes',
    'Language Settings': 'Language Settings',
    'Select Interface Language': 'Select Interface Language',
    'This will change the language': 'This will change the language of the entire interface using Google Translate.',
    'Reset to English': 'Reset to English on logout',
    'When you log out': 'When you log out, the language will be reset to English for the next user.',
    'Settings saved': 'Settings saved successfully!',
    'Failed to save': 'Failed to save settings. Please try again.'
  },
  'es': {
    'Save Changes': 'Guardar Cambios',
    'Language Settings': 'Configuración de Idioma',
    'Select Interface Language': 'Seleccionar Idioma de Interfaz',
    'This will change the language': 'Esto cambiará el idioma de toda la interfaz usando Google Translate.',
    'Reset to English': 'Restablecer a Inglés al cerrar sesión',
    'When you log out': 'Cuando cierre sesión, el idioma se restablecerá a Inglés para el próximo usuario.',
    'Settings saved': '¡Configuración guardada correctamente!',
    'Failed to save': 'Error al guardar la configuración. Inténtalo de nuevo.'
  },
  'fr': {
    'Save Changes': 'Enregistrer les Modifications',
    'Language Settings': 'Paramètres de Langue',
    'Select Interface Language': 'Sélectionner la Langue de l\'Interface',
    'This will change the language': 'Cela changera la langue de toute l\'interface en utilisant Google Translate.',
    'Reset to English': 'Réinitialiser en Anglais à la déconnexion',
    'When you log out': 'Lorsque vous vous déconnectez, la langue sera réinitialisée en Anglais pour l\'utilisateur suivant.',
    'Settings saved': 'Paramètres enregistrés avec succès!',
    'Failed to save': 'Échec de l\'enregistrement des paramètres. Veuillez réessayer.'
  }
};

/**
 * Manually translate a string using our dictionary when Google Translate is blocked
 * @param {string} text - Text to translate
 * @param {string} langCode - Target language code
 * @returns {string} - Translated text or original if translation not found
 */
export const manualTranslate = (text, langCode = getCurrentLanguage()) => {
  try {
    // If Google Translate is not blocked or language is English, return original
    if (
      sessionStorage.getItem('google_translate_blocked') !== 'true' || 
      langCode === DEFAULT_LANGUAGE || 
      !text
    ) {
      return text;
    }
    
    // Check if we have translations for this language
    if (manualTranslations[langCode]) {
      // Check if we have this specific text translated
      const translated = manualTranslations[langCode][text];
      if (translated) {
        return translated;
      }
      
      // If not exact match, try to find partial matches for longer texts
      for (const [key, value] of Object.entries(manualTranslations[langCode])) {
        if (text.includes(key)) {
          return text.replace(key, value);
        }
      }
    }
    
    // Return original if no translation found
    return text;
  } catch (error) {
    console.error('Error in manual translation:', error);
    return text;
  }
};

/**
 * Remove Google Translate bar from the page
 * This function hides the Google Translate bar/notification and restores the page layout
 */
export const removeTranslateBar = () => {
  try {
    // Find and remove Google Translate banner/bar
    const translateBanner = document.querySelector('.skiptranslate');
    if (translateBanner) {
      translateBanner.style.display = 'none';
      console.log('Google Translate bar hidden');
    }
    
    // Restore body padding that Google Translate adds
    if (document.body.style.top) {
      const scrollPosition = Math.abs(parseInt(document.body.style.top, 10));
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollPosition);
    }
    
    // Set html back to default
    const htmlElement = document.querySelector('html');
    if (htmlElement && htmlElement.classList.contains('translated-ltr')) {
      htmlElement.classList.remove('translated-ltr');
    }
    
    console.log('Google Translate bar removed');
    return true;
  } catch (err) {
    console.error('Error removing translate bar:', err);
    return false;
  }
};