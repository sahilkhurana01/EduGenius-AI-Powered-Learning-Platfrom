import { useState, useEffect, useRef } from 'react';
import { Dropdown, Button, Input, Typography } from 'antd';
import { GlobalOutlined, SearchOutlined, TranslationOutlined } from '@ant-design/icons';
import { supportedLanguages, applyGoogleTranslate, getCurrentLanguage, removeTranslateBar } from '../utils/LanguageService';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function LanguageDropdown({ placement = 'bottomRight', buttonStyle = {} }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [visible, setVisible] = useState(false);
  const [translateBlocked, setTranslateBlocked] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    // Check if Google Translate is blocked
    const isBlocked = sessionStorage.getItem('google_translate_blocked') === 'true';
    setTranslateBlocked(isBlocked);
    
    // Get current language
    const savedLanguage = getCurrentLanguage();
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
    
    // Try to get the current language from Google Translate if available
    const checkCurrentLanguage = () => {
      try {
        if (window.google && window.google.translate) {
          const selectElement = document.querySelector('.goog-te-combo');
          if (selectElement && selectElement.value) {
            setCurrentLanguage(selectElement.value);
          }
        }
      } catch (error) {
        console.error('Error checking current language:', error);
      }
    };
    
    checkCurrentLanguage();
    
    // Also check after a delay to ensure Google Translate has loaded
    const timer = setTimeout(checkCurrentLanguage, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Get the current language details
  const currentLanguageDetails = supportedLanguages.find(lang => lang.code === currentLanguage) || 
                                { name: 'English', code: 'en' };
  
  const handleLanguageSelect = (langCode) => {
    applyGoogleTranslate(langCode);
    setCurrentLanguage(langCode);
    setVisible(false);
    
    // Use the imported removeTranslateBar function
    removeTranslateBar();
  };
  
  const handleResetToEnglish = (e) => {
    e.stopPropagation();
    handleLanguageSelect('en');
    // No need to call removeTranslateBar again as it's already called in handleLanguageSelect
  };
  
  const handleTryLoadGoogleTranslate = (e) => {
    e.stopPropagation();
    setTranslateBlocked(false);
    sessionStorage.removeItem('google_translate_blocked');
    
    if (window.loadGoogleTranslate) {
      window.loadGoogleTranslate();
      
      // Check if it worked after a delay
      setTimeout(() => {
        const isStillBlocked = !window.google || !window.google.translate;
        if (isStillBlocked) {
          setTranslateBlocked(true);
          sessionStorage.setItem('google_translate_blocked', 'true');
        } else {
          // Try to apply the language again
          handleLanguageSelect(currentLanguage);
        }
      }, 2000);
    }
  };
  
  // Filter languages based on search
  const filteredLanguages = supportedLanguages.filter(lang => 
    searchQuery === '' || 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group languages into sections alphabetically to make long list more manageable
  const groupedLanguages = {};
  if (filteredLanguages.length > 0) {
    filteredLanguages.forEach(lang => {
      const firstLetter = lang.name.charAt(0).toUpperCase();
      if (!groupedLanguages[firstLetter]) {
        groupedLanguages[firstLetter] = [];
      }
      groupedLanguages[firstLetter].push(lang);
    });
  }
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const renderLanguageDropdownContent = () => (
    <div style={{ padding: '8px', width: '300px', maxHeight: '400px', overflow: 'auto' }}>
      {translateBlocked ? (
        <div style={{ padding: '10px', backgroundColor: '#fff2e8', borderRadius: '4px', marginBottom: '8px' }}>
          <Typography.Text style={{ color: '#d4380d', display: 'block', marginBottom: '4px' }}>
            <TranslationOutlined /> Google Translate unavailable
          </Typography.Text>
          <Typography.Text style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
            Language preferences will be saved but not applied
          </Typography.Text>
          <Button 
            size="small" 
            type="primary" 
            danger
            onClick={handleTryLoadGoogleTranslate}
            icon={<TranslationOutlined />}
          >
            Try Again
          </Button>
        </div>
      ) : null}
      
      <Input
        placeholder="Search languages"
        prefix={<SearchOutlined />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        style={{ marginBottom: '10px' }}
      />
      
      {currentLanguage !== 'en' && (
        <Button 
          type="link" 
          style={{ padding: 0, marginBottom: '10px', display: 'block' }}
          onClick={handleResetToEnglish}
        >
          Reset to English
        </Button>
      )}
      
      {filteredLanguages.length === 0 ? (
        <div style={{ padding: '10px', textAlign: 'center' }}>
          <Typography.Text type="secondary">No languages match your search.</Typography.Text>
        </div>
      ) : (
        Object.keys(groupedLanguages).sort().map(letter => (
          <div key={letter} style={{ marginBottom: '10px' }}>
            <Typography.Text strong style={{ color: '#1890ff', display: 'block', borderBottom: '1px solid #f0f0f0', paddingBottom: '3px' }}>
              {letter}
            </Typography.Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
              {groupedLanguages[letter].map(lang => (
                <Button
                  key={lang.code}
                  size="small"
                  type={currentLanguage === lang.code ? 'primary' : 'default'}
                  onClick={(e) => { e.stopPropagation(); handleLanguageSelect(lang.code); }}
                  style={{ margin: '2px' }}
                  title={lang.nativeName || lang.name}
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
      >
        <span className="mr-1 text-sm">{currentLanguageDetails.name}</span>
        <ChevronDownIcon className={`h-4 w-4 transform transition-transform duration-200 ${visible ? 'rotate-180' : ''}`} />
      </button>
      
      {visible && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md py-1 z-30 max-h-96 overflow-y-auto border border-gray-200">
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search languages..."
                className="pl-8 pr-4 py-1.5 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="px-3 py-2 border-b border-gray-100">
            <button
              onClick={(e) => { e.stopPropagation(); handleResetToEnglish(e); }}
              className="w-full text-left py-1.5 px-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
            >
              Reset to English
            </button>
          </div>
          
          {filteredLanguages.map((language) => (
            <button
              key={language.code}
              onClick={(e) => { e.stopPropagation(); handleLanguageSelect(language.code); }}
              className={`w-full text-left py-1.5 px-3 text-sm hover:bg-indigo-50 ${
                currentLanguage === language.code ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700'
              }`}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 