import React, { useState, useEffect } from 'react';
import { 
  getCurrentLanguage,
  setLanguagePreference,
  supportedLanguages,
  applyGoogleTranslate,
  manualTranslate,
  showTranslationNotification
} from '../../utils/LanguageService';

const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(getCurrentLanguage());
  const [resetOnLogout, setResetOnLogout] = useState(true);
  const [savedSettings, setSavedSettings] = useState({ 
    language: selectedLanguage, 
    resetOnLogout: true 
  });
  const [saveStatus, setSaveStatus] = useState('');
  // Track if Google Translate is blocked
  const [isTranslateBlocked, setIsTranslateBlocked] = useState(
    sessionStorage.getItem('google_translate_blocked') === 'true'
  );

  // Load saved settings on component mount
  useEffect(() => {
    const currentLang = getCurrentLanguage();
    const resetPref = sessionStorage.getItem('language_preference_reset') !== 'false';
    
    setSelectedLanguage(currentLang);
    setResetOnLogout(resetPref);
    setSavedSettings({ language: currentLang, resetOnLogout: resetPref });
    
    // Check if Google Translate is blocked
    setIsTranslateBlocked(sessionStorage.getItem('google_translate_blocked') === 'true');
    
    // Show appropriate notification if blocked
    if (sessionStorage.getItem('google_translate_blocked') === 'true' && 
        !sessionStorage.getItem('language_settings_notification_shown')) {
      sessionStorage.setItem('language_settings_notification_shown', 'true');
      showTranslationNotification(
        'Google Translate is currently blocked. Language preferences will be saved, but only key UI elements will be translated.',
        'warning'
      );
    }
  }, []);

  // Handle language change in dropdown (just updates the UI, doesn't apply yet)
  const handleLanguageChange = (event) => {
    const langCode = event.target.value;
    setSelectedLanguage(langCode);
  };

  // Toggle reset on logout setting (just updates the UI, doesn't apply yet)
  const handleResetToggle = () => {
    setResetOnLogout(!resetOnLogout);
  };

  // Save settings and apply them
  const handleSaveChanges = () => {
    try {
      // Apply language preference with reset setting
      setLanguagePreference(selectedLanguage, resetOnLogout);
      
      // Apply the language change immediately
      applyGoogleTranslate(selectedLanguage);
      
      // If Google Translate is blocked, manually update page UI elements
      if (isTranslateBlocked) {
        document.querySelectorAll('[data-translatable]').forEach(element => {
          const key = element.getAttribute('data-translatable');
          if (key) {
            element.textContent = manualTranslate(key, selectedLanguage);
          }
        });
      }
      
      // Update saved settings
      setSavedSettings({ language: selectedLanguage, resetOnLogout });
      
      // Show success message - use manual translation if Google Translate is blocked
      const successMessage = isTranslateBlocked 
        ? manualTranslate('Settings saved successfully!', selectedLanguage)
        : 'Settings saved successfully!';
        
      setSaveStatus(successMessage);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Failed to save language settings:', error);
      
      // Show error message - use manual translation if Google Translate is blocked
      const errorMessage = isTranslateBlocked 
        ? manualTranslate('Failed to save settings. Please try again.', selectedLanguage)
        : 'Failed to save settings. Please try again.';
        
      setSaveStatus(errorMessage);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Check if settings have changed
  const hasChanges = selectedLanguage !== savedSettings.language || 
                     resetOnLogout !== savedSettings.resetOnLogout;

  // Get translations for UI elements
  const getTranslatedText = (text) => {
    return isTranslateBlocked ? manualTranslate(text, selectedLanguage) : text;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4" data-translatable="Language Settings">
          {getTranslatedText('Language Settings')}
        </h2>
        
        {isTranslateBlocked && (
          <div className="p-3 mb-4 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">
            <p className="text-sm">
              <strong>Note:</strong> Google Translate appears to be blocked. 
              Language preferences will be saved and basic translations applied,
              but full page translation is not available.
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2" data-translatable="Select Interface Language">
            {getTranslatedText('Select Interface Language')}
          </label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {supportedLanguages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500" data-translatable="This will change the language">
            {getTranslatedText('This will change the language of the entire interface using Google Translate.')}
          </p>
        </div>
        
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="reset-on-logout"
              name="reset-on-logout"
              type="checkbox"
              checked={resetOnLogout}
              onChange={handleResetToggle}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="reset-on-logout" className="font-medium text-gray-700" data-translatable="Reset to English">
              {getTranslatedText('Reset to English on logout')}
            </label>
            <p className="text-gray-500" data-translatable="When you log out">
              {getTranslatedText('When you log out, the language will be reset to English for the next user.')}
            </p>
          </div>
        </div>

        {saveStatus && (
          <div className={`p-3 mb-4 rounded ${saveStatus.includes('success') || saveStatus.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {saveStatus}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
        <button
          onClick={handleSaveChanges}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            hasChanges
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          data-translatable="Save Changes"
        >
          {getTranslatedText('Save Changes')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSettings;