import React, { useState, useEffect } from 'react';
import App from './App';
import ContextProvider from './context/context';
import './gemini-styles.css';
import { getProfilePictureUrl, handleProfilePictureError } from '../../utils/ProfilePictureManager';
import { initializeGoogleTranslate } from '../../utils/LanguageService';

const GeminiWrapper = ({ userRole }) => {
  // Get the user data including profile picture
  const [userData, setUserData] = useState({
    name: sessionStorage.getItem('userName') || 'User',
    role: userRole || sessionStorage.getItem('userRole') || 'student',
    photoURL: null // Initialize as null
  });
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // Set the user data including profile picture
    const userRole = sessionStorage.getItem('userRole') || 'student';
    const userName = sessionStorage.getItem('userName') || 'User';
    
    // First check for Google photo (highest priority)
    const googlePhotoURL = sessionStorage.getItem('googlePhotoURL');
    
    if (googlePhotoURL) {
      console.log('Using Google profile picture in GeminiWrapper:', googlePhotoURL);
      
      // Set the Google photo URL immediately to prevent UI flickering
      setUserData(prevData => ({
        ...prevData,
        name: userName,
        role: userRole,
        photoURL: googlePhotoURL
      }));
      
      // Still validate the image in the background, but don't delay showing the UI
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      
      img.onload = () => {
        console.log('Google profile image validated successfully in GeminiWrapper');
        setProfileLoading(false);
      };
      
      img.onerror = () => {
        console.warn('Google profile image failed to validate in GeminiWrapper');
        // Get fallback profile picture but don't wait for validation
        const fallbackURL = getProfilePictureUrl(userRole);
        setUserData(prevData => ({
          ...prevData,
          photoURL: fallbackURL
        }));
        setProfileLoading(false);
      };
      
      // Start loading the image
      img.src = googlePhotoURL;
    } else {
      // Get the profile picture using our utility as fallback
      const photoURL = getProfilePictureUrl(userRole);
      
      setUserData({
        name: userName,
        role: userRole,
        photoURL: photoURL
      });
      
      setProfileLoading(false);
      console.log('Profile picture set in GeminiWrapper:', photoURL);
    }
    
    // Initialize Google Translate
    initializeGoogleTranslate();
  }, [userRole]);

  return (
    <div className="gemini-wrapper">
      <div className="gemini-container">
        <ContextProvider>
          <App userData={userData} />
        </ContextProvider>
      </div>
      <div className="user-profile">
        {profileLoading ? (
          <div className="profile-image-loading"></div>
        ) : (
          <img 
            src={userData.photoURL} 
            alt={`${userData.name}'s profile`} 
            className="profile-image"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => {
              console.log('Profile image failed to load in GeminiWrapper, using fallback');
              // Use our centralized error handler
              e.target.src = handleProfilePictureError(e, userData.role);
            }}
          />
        )}
        <div className="user-info">
          <div className="user-name">{userData.name}</div>
          <div className="user-role">{userData.role}</div>
        </div>
      </div>
    </div>
  );
};

export default GeminiWrapper; 