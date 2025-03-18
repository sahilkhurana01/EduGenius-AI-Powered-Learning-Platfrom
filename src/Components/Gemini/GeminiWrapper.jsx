import React, { useState, useEffect } from 'react';
import App from './App';
import ContextProvider from './context/context';
import './gemini-styles.css';
import { getProfilePictureUrl } from '../../utils/ProfilePictureManager';

const GeminiWrapper = ({ userRole }) => {
  // Get the user data including profile picture
  const [userData, setUserData] = useState({
    name: sessionStorage.getItem('userName') || 'User',
    role: userRole || sessionStorage.getItem('userRole') || 'student',
    photoURL: null // Initialize as null
  });

  useEffect(() => {
    // Set the user data including profile picture
    const userRole = sessionStorage.getItem('userRole') || 'student';
    const userName = sessionStorage.getItem('userName') || 'User';
    
    // First check for Google photo (highest priority)
    const googlePhotoURL = sessionStorage.getItem('googlePhotoURL');
    
    // Get the profile picture using our utility as fallback
    const photoURL = googlePhotoURL || getProfilePictureUrl(userRole);
    
    setUserData({
      name: userName,
      role: userRole,
      photoURL: photoURL
    });
    
    console.log('Profile picture set in GeminiWrapper:', photoURL);
  }, [userRole]);

  return (
    <div className="gemini-wrapper">
      <div className="gemini-container">
        <ContextProvider>
          <App />
        </ContextProvider>
      </div>
      <div className="user-profile">
        <img 
          src={userData.photoURL} 
          alt={`${userData.name}'s profile`} 
          className="profile-image"
          onError={(e) => {
            console.log('Profile image failed to load in GeminiWrapper, using fallback');
            e.target.onerror = null; // Prevent infinite loops
            // Fall back to a default image by role
            e.target.src = userData.role === 'teacher' 
              ? 'https://randomuser.me/api/portraits/women/45.jpg' 
              : 'https://randomuser.me/api/portraits/men/32.jpg';
          }}
        />
        <div className="user-info">
          <div className="user-name">{userData.name}</div>
          <div className="user-role">{userData.role}</div>
        </div>
      </div>
    </div>
  );
};

export default GeminiWrapper; 