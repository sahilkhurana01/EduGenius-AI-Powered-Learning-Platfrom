import { useState, useEffect } from 'react';
import { Card, Typography, Button, Input, message } from 'antd';
import { SearchOutlined, TranslationOutlined, GlobalOutlined } from '@ant-design/icons';
import { supportedLanguages, applyGoogleTranslate, getInitialLanguagePreference } from '../../utils/LanguageService';

export default function LanguageSettings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [translateBlocked, setTranslateBlocked] = useState(false);
  
  useEffect(() => {
    // Check if Google Translate is blocked
    const isBlocked = sessionStorage.getItem('google_translate_blocked') === 'true';
    setTranslateBlocked(isBlocked);
    
    // Get current language preference
    const savedLanguage = getInitialLanguagePreference();
    setCurrentLanguage(savedLanguage || 'en');
    
    // Try to get the current language from Google Translate if available
    const checkCurrentLanguage = () => {
      if (window.google && window.google.translate) {
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement && selectElement.value) {
          setCurrentLanguage(selectElement.value);
        }
      }
    };
    
    checkCurrentLanguage();
    
    // Also check after a delay to ensure Google Translate has loaded
    const timer = setTimeout(checkCurrentLanguage, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Filter languages based on search query
  const filteredLanguages = supportedLanguages.filter(lang => 
    searchQuery === '' || 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleLanguageChange = (langCode) => {
    setLoading(true);
    
    try {
      // Apply the language change
      applyGoogleTranslate(langCode);
      
      // Update the state
      setCurrentLanguage(langCode);
      
      // Show success message
      if (translateBlocked) {
        message.info('Language preference saved, but Google Translate is not available.');
      } else {
        message.success(`Language changed to ${supportedLanguages.find(l => l.code === langCode)?.name || langCode}`);
      }
    } catch (error) {
      console.error('Error changing language:', error);
      message.error('Failed to change language');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetLanguage = () => {
    handleLanguageChange('en');
  };
  
  const triggerGoogleTranslateLoad = () => {
    setTranslateBlocked(false);
    sessionStorage.removeItem('google_translate_blocked');
    
    if (window.loadGoogleTranslate) {
      window.loadGoogleTranslate();
      message.info('Attempting to load Google Translate...');
      
      // Check if successful after a delay
      setTimeout(() => {
        if (!window.google || !window.google.translate) {
          setTranslateBlocked(true);
          sessionStorage.setItem('google_translate_blocked', 'true');
          message.error('Google Translate still unavailable. Check your connection or browser settings.');
        } else {
          message.success('Google Translate loaded successfully!');
          // Apply current language
          handleLanguageChange(currentLanguage);
        }
      }, 3000);
    }
  };
  
  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <GlobalOutlined style={{ marginRight: 8 }} />
          <Typography.Title level={4} style={{ margin: 0 }}>Language Settings</Typography.Title>
        </div>
      }
      style={{ maxWidth: 900, margin: '0 auto', marginBottom: 20 }}
    >
      {translateBlocked && (
        <Card type="inner" style={{ marginBottom: 20, backgroundColor: '#fff2e8', borderColor: '#ffccc7' }}>
          <Typography.Title level={5} style={{ color: '#d4380d' }}>
            <TranslationOutlined style={{ marginRight: 8 }} /> Google Translate Unavailable
          </Typography.Title>
          <Typography.Paragraph>
            Google Translate appears to be blocked or unavailable. Your language preferences will still be saved,
            but translations won't be applied until Google Translate becomes available.
          </Typography.Paragraph>
          <Button 
            type="primary" 
            danger 
            onClick={triggerGoogleTranslateLoad}
            icon={<TranslationOutlined />}
          >
            Try Again
          </Button>
        </Card>
      )}
      
      <div style={{ marginBottom: 16 }}>
        <Typography.Paragraph>
          Select your preferred language from the list below. All text in the application will be translated using Google Translate.
        </Typography.Paragraph>
        
        <Input
          placeholder="Search languages..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>Current language: </Typography.Text>
          <Typography.Text>
            {supportedLanguages.find(l => l.code === currentLanguage)?.name || 'English'} 
            {currentLanguage !== 'en' && (
              <Button 
                type="link" 
                size="small" 
                onClick={handleResetLanguage}
                style={{ marginLeft: 8 }}
              >
                Reset to English
              </Button>
            )}
          </Typography.Text>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {filteredLanguages.map(language => (
            <Button
              key={language.code}
              type={currentLanguage === language.code ? 'primary' : 'default'}
              onClick={() => handleLanguageChange(language.code)}
              style={{ marginBottom: 8, minWidth: 120 }}
              loading={loading && currentLanguage === language.code}
              title={language.nativeName || language.name}
            >
              {language.name}
            </Button>
          ))}
        </div>
        
        {filteredLanguages.length === 0 && (
          <Typography.Paragraph italic>
            No languages match your search criteria.
          </Typography.Paragraph>
        )}
      </div>
    </Card>
  );
} 