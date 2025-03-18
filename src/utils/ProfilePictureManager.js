/**
 * Enterprise-grade Profile Picture Manager
 * Handles storage, validation, caching and fallback for profile pictures
 * Similar to systems used by Netflix, Google, and Microsoft
 */

// Store profile data in localStorage with versioning
const STORAGE_KEY = 'edugenius_profile_data';
const VERSION = '1.0';

// Cache timeout (24 hours in milliseconds)
const CACHE_TIMEOUT = 24 * 60 * 60 * 1000;

/**
 * Saves a profile picture URL to localStorage with metadata
 * @param {string} url - The profile picture URL
 * @param {string} userRole - The user role (teacher, student, admin)
 * @param {boolean} isGooglePhoto - Whether this is a Google photo URL
 * @returns {boolean} - Success state
 */
export const saveProfilePicture = (url, userRole = sessionStorage.getItem('userRole') || 'student', isGooglePhoto = false) => {
  if (!url || typeof url !== 'string') {
    console.error('Invalid profile picture URL');
    return false;
  }

  try {
    // If this is a Google photo, ensure we mark it as such
    if (url.includes('googleusercontent.com') || isGooglePhoto) {
      console.log('Detected Google profile picture, prioritizing it');
      sessionStorage.setItem('googlePhotoURL', url);
      isGooglePhoto = true;
    }

    const timestamp = Date.now();
    const profileData = getProfileData();
    
    // Update profile data with new URL and metadata
    profileData.pictures[userRole] = {
      url,
      timestamp,
      version: VERSION,
      isGooglePhoto
    };
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    
    // Also save to session storage for immediate access
    sessionStorage.setItem('userPhotoURL', url);
    
    console.log(`Profile picture saved for ${userRole}${isGooglePhoto ? ' (Google photo)' : ''}`);
    return true;
  } catch (error) {
    console.error('Error saving profile picture:', error);
    return false;
  }
};

/**
 * Gets profile picture URL for the specified user role
 * @param {string} userRole - The user role (teacher, student, admin)
 * @returns {string|null} - The profile picture URL or null
 */
export const getProfilePictureUrl = (userRole) => {
  try {
    // First check if we have a Google photo URL (highest priority)
    const googlePhotoURL = sessionStorage.getItem('googlePhotoURL');
    if (googlePhotoURL) {
      console.log('Using Google profile picture');
      return googlePhotoURL;
    }
    
    // If no Google photo, check session storage for any photo URL
    const sessionPhotoUrl = sessionStorage.getItem('userPhotoURL');
    if (sessionPhotoUrl) {
      return sessionPhotoUrl;
    }
    
    // If still no photo, check our localStorage cache
    const profileData = getProfileData();
    const pictureData = profileData.pictures[userRole];
    
    // Check if picture exists and is not expired
    if (pictureData && pictureData.url) {
      const timestamp = pictureData.timestamp;
      const now = Date.now();
      
      // Check if cache is expired
      if (now - timestamp > CACHE_TIMEOUT) {
        console.log('Profile picture cache expired, should refresh');
        // Still return the URL but mark for refresh
        profileData.pictures[userRole].needsRefresh = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
      }
      
      return pictureData.url;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting profile picture URL:', error);
    return null;
  }
};

/**
 * Gets the complete profile data object or initializes a new one
 * @returns {Object} - The profile data object
 */
const getProfileData = () => {
  try {
    const dataString = localStorage.getItem(STORAGE_KEY);
    if (dataString) {
      return JSON.parse(dataString);
    }
  } catch (error) {
    console.error('Error parsing profile data:', error);
  }
  
  // Return fresh data structure if not found or error
  return {
    version: VERSION,
    pictures: {},
    settings: {
      useDefaultOnError: true
    }
  };
};

/**
 * Preloads and validates profile picture for a user role
 * @param {string} userRole - The user role (teacher, student, admin)
 * @returns {string} - The profile picture URL (cached or new)
 */
export const preloadProfilePicture = (userRole) => {
  // First check if we have a Google photo URL (highest priority)
  const googlePhotoURL = sessionStorage.getItem('googlePhotoURL');
  if (googlePhotoURL) {
    // If we have a Google photo URL, use it and also update our cache
    console.log('Using Google profile picture for', userRole);
    saveProfilePicture(googlePhotoURL, userRole, true);
    return googlePhotoURL;
  }
  
  // Next try to get from session storage
  const sessionPhotoUrl = sessionStorage.getItem('userPhotoURL');
  
  // Then check our localStorage cache
  const cachedUrl = getProfilePictureUrl(userRole);
  
  // Determine which URL to use
  let photoUrl = sessionPhotoUrl;
  
  // If session has no photo but we have a cached one, use cached
  if (!photoUrl && cachedUrl) {
    photoUrl = cachedUrl;
    // Store in session for faster access
    sessionStorage.setItem('userPhotoURL', photoUrl);
    console.log('Using cached profile picture');
  }
  
  // If we have a new session photo different from cache, update cache
  if (photoUrl && (!cachedUrl || photoUrl !== cachedUrl)) {
    saveProfilePicture(photoUrl, userRole);
    console.log('Updated cached profile picture');
  }
  
  return photoUrl || getDefaultProfilePicture(userRole);
};

/**
 * Handles profile picture loading errors with smart fallback
 * @param {Event} event - The error event from the img element
 * @param {string} userRole - The user role (teacher, student, admin)
 * @returns {string} - The fallback URL to use
 */
export const handleProfilePictureError = (event, userRole) => {
  console.log('Profile image failed to load, using fallback');
  
  // Prevent infinite loops
  if (event) {
    event.target.onerror = null;
  }
  
  const userName = sessionStorage.getItem('userName') || 'User';
  
  // Try multiple fallback options in sequence
  const fallbackOptions = [
    // First try a generated avatar based on user name
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4f46e5&color=ffffff`,
    // Then try role-specific defaults
    getDefaultProfilePicture(userRole),
    // Final fallback is a static image
    '/assets/default-avatar.png'
  ];
  
  // If localStorage setting indicates to remember this failure
  const profileData = getProfileData();
  if (profileData.settings.useDefaultOnError) {
    // Mark that the current URL failed
    const currentUrl = event?.target?.src;
    if (currentUrl) {
      const errorData = profileData.errors || {};
      errorData[currentUrl] = Date.now();
      profileData.errors = errorData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    }
  }
  
  // Return the first working option
  return fallbackOptions[0];
};

/**
 * Gets default profile picture based on user role
 * @param {string} userRole - The user role
 * @returns {string} - The default profile picture URL
 */
const getDefaultProfilePicture = (userRole) => {
  // Role-specific defaults that won't have CORS issues
  switch (userRole) {
    case 'teacher':
      return 'https://randomuser.me/api/portraits/women/44.jpg';
    case 'student':
      return 'https://randomuser.me/api/portraits/men/32.jpg';
    case 'admin':
      return 'https://randomuser.me/api/portraits/men/68.jpg';
    default:
      return 'https://randomuser.me/api/portraits/lego/1.jpg';
  }
};

/**
 * Clears profile picture data on logout
 */
export const clearProfilePictureData = () => {
  try {
    // Clear session storage items
    sessionStorage.removeItem('userPhotoURL');
    sessionStorage.removeItem('googlePhotoURL');
    
    // Keep the data structure but clear URLs
    const profileData = getProfileData();
    Object.keys(profileData.pictures).forEach(role => {
      profileData.pictures[role] = { timestamp: Date.now(), needsRefresh: true };
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    console.log('Profile picture data cleared');
  } catch (error) {
    console.error('Error clearing profile picture data:', error);
  }
};

/**
 * Handle logout by clearing session data
 * @param {function} navigate - React Router navigate function
 */
export const handleLogout = (navigate) => {
  // Clear session storage
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('userName');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('userPhotoURL');
  sessionStorage.removeItem('googlePhotoURL');
  
  // Clear profile picture cache
  clearProfilePictureData();
  
  // Redirect to login page
  if (navigate) {
    navigate('/login');
  } else {
    window.location.href = '/login';
  }
  console.log('User logged out successfully');
}; 