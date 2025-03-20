/**
 * Language Service Utility
 * Handles language preference management and Google Translate integration
 */

// Constants
export const STORAGE_KEY = 'language_preference';
export const DEFAULT_LANGUAGE = 'en';

// Supported languages - these are just common languages supported by Google Translate
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
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
 * Initialize Google Translate
 * This function should be called when components mount to ensure proper translation
 */
export const initializeGoogleTranslate = () => {
  try {
    const currentLang = getCurrentLanguage();
    console.log('Initializing Google Translate with language:', currentLang);
    
    // If Google Translate is already loaded and initialized, just apply the saved language
    if (window.google && window.google.translate && document.querySelector('.goog-te-combo')) {
      console.log('Google Translate already loaded, applying saved language');
      applyGoogleTranslate(currentLang);
      return;
    }
    
    // Check if Google Translate is blocked
    if (sessionStorage.getItem('google_translate_blocked') === 'true') {
      console.warn('Google Translate appears to be blocked - using manual translations only');
      return;
    }
    
    // If loadGoogleTranslate function exists, we can call it directly
    if (typeof window.loadGoogleTranslate === 'function') {
      window.loadGoogleTranslate();
      return;
    }
    
    // Fallback: Define loadGoogleTranslate if it doesn't exist yet
    // This is for components that might initialize before the script in index.html loads
    if (typeof window.loadGoogleTranslate !== 'function') {
      window.loadGoogleTranslate = function() {
        try {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: supportedLanguages.map(lang => lang.code).join(','),
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            }, 'google_element');
            
            // Apply the saved language preference
            if (currentLang && currentLang !== DEFAULT_LANGUAGE) {
              setTimeout(() => applyGoogleTranslate(currentLang), 1000);
            }
          }
        } catch (e) {
          console.warn('Google Translate initialization error:', e);
          sessionStorage.setItem('google_translate_blocked', 'true');
        }
      };
    }
    
    // Check for necessary elements
    if (!document.getElementById('google_element')) {
      console.warn('Google element container not found, creating one');
      const translateElement = document.createElement('div');
      translateElement.id = 'google_element';
      translateElement.style.display = 'none';
      document.body.appendChild(translateElement);
    }
  } catch (error) {
    console.error('Error initializing Google Translate:', error);
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
      if (window.google && window.google.translate) {
        // Try to find the "No translation" or "Show original" button to reset
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
          selectElement.value = DEFAULT_LANGUAGE;
          selectElement.dispatchEvent(new Event('change'));
          return;
        }
        
        // Alternative method to reset translation
        try {
          const frame = document.querySelector('.goog-te-menu-frame');
          if (frame) {
            const innerDoc = frame.contentDocument || frame.contentWindow.document;
            const element = innerDoc.querySelector('.goog-te-menu2-item:first-child');
            if (element) {
              element.click();
            }
          }
        } catch (e) {
          console.warn('Could not reset translation:', e);
        }
      }
      return;
    }
    
    // Check if Google Translate is loaded
    if (!window.google || !window.google.translate) {
      console.warn('Google Translate not loaded yet, attempting to initialize');
      
      // If loadGoogleTranslate function exists, we can call it directly
      if (typeof window.loadGoogleTranslate === 'function') {
        window.loadGoogleTranslate();
        
        // Set a timeout to try applying the language after initialization
        setTimeout(() => {
          const selectElement = document.querySelector('.goog-te-combo');
          if (selectElement) {
            selectElement.value = langCode;
            selectElement.dispatchEvent(new Event('change'));
            console.log(`Applied language change to ${langCode} after initialization`);
          }
        }, 1500);
      }
      return;
    }
    
    // Find the language selector dropdown
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
      console.log(`Applied language change to ${langCode}`);
      return;
    }
    
    console.warn('Google Translate dropdown not found - language preference saved but not applied');
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