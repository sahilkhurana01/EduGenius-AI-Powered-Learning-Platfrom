/**
 * Enterprise-grade Profile Picture Manager
 * Handles storage, validation, caching and fallback for profile pictures
 * Similar to systems used by Netflix, Google, and Microsoft
 */

import { clearLanguagePreference } from './LanguageService';

// Store profile data in localStorage with versioning
const STORAGE_KEY = 'edugenius_profile_data';
const VERSION = '1.0';

// Cache timeout (24 hours in milliseconds)
const CACHE_TIMEOUT = 24 * 60 * 60 * 1000;

/**
 * Prepares a Google profile picture URL to avoid CORS and size issues
 * @param {string} url - Original Google profile picture URL
 * @returns {string} - Modified URL for better compatibility
 */
const prepareGooglePhotoUrl = (url) => {
  if (!url) return url;
  
  try {
    // Google profile URLs often end with =s96-c or similar size constraints
    // Remove the size constraint to get full resolution
    if (url.includes('googleusercontent.com')) {
      // For newer Google photo URLs (lh3.googleusercontent.com format)
      if (url.includes('=s')) {
        // Replace size restriction with a larger one
        return url.replace(/=s\d+-c$/, '=s400-c');
      }
      
      // For other Google photo URLs, ensure we're using https
      if (url.startsWith('http:')) {
        return url.replace('http:', 'https:');
      }
    }
    
    return url;
  } catch (error) {
    console.error('Error preparing Google photo URL:', error);
    return url;
  }
};

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
    // If this is a Google photo, ensure we mark it as such and optimize the URL
    if (url.includes('googleusercontent.com') || isGooglePhoto) {
      console.log('Detected Google profile picture, prioritizing it');
      
      // Prepare the URL for better compatibility
      const optimizedUrl = prepareGooglePhotoUrl(url);
      console.log('Original URL:', url);
      console.log('Optimized URL:', optimizedUrl);
      
      // Store both the original and optimized URLs
      sessionStorage.setItem('googlePhotoURL', optimizedUrl);
      sessionStorage.setItem('originalGooglePhotoURL', url);
      isGooglePhoto = true;
      
      // Also store it as the primary photo URL
      sessionStorage.setItem('userPhotoURL', optimizedUrl);
      
      // Update the URL for storage
      url = optimizedUrl;
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
    
    // Also save to session storage for immediate access if not already saved
    if (!sessionStorage.getItem('userPhotoURL')) {
      sessionStorage.setItem('userPhotoURL', url);
    }
    
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
  try {
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
  } catch (error) {
    console.error('Error in preloadProfilePicture:', error);
    return getDefaultProfilePicture(userRole);
  }
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
  
  // Try role-specific defaults without external dependencies
  // Avoid UI Avatars due to CORS issues
  const fallbackOptions = [
    // Role-specific defaults that won't have CORS issues
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
  // Base64 encoded simple avatar for all users
  // This is a simple gray avatar to avoid external dependencies and CORS issues
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyMCIgZmlsbD0iI2U5ZWJlZSIgLz48cGF0aCBkPSJNMTI4LDEzNmM1My4wMiwwIDk2LDQyLjk4LDk2LDk2djEySDMyVjIzMmMwLTUzLjAyLDQyLjk4LTk2LDk2LTk2Wm0wLTExMmMxOS44OCwwLDM2LDE2LjEyLDM2LDM2czAtNzIsLTM2LTcyLTM2LDUyLjEyLTM2LDcyLDE2LjEyLDM2LDM2LDM2WiIgZmlsbD0iI2U2ZTZlNiIgLz48L3N2Zz4=';
  
  // Return the same default avatar for all roles
  // This is more reliable than trying to use external files
  return defaultAvatar;
};

/**
 * Clears profile picture data on logout
 */
export const clearProfilePictureData = () => {
  try {
    // Clear session storage items
    sessionStorage.removeItem('userPhotoURL');
    sessionStorage.removeItem('googlePhotoURL');
    sessionStorage.removeItem('originalGooglePhotoURL');
    
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
export const handleLogout = async (navigate) => {
  try {
    // Import the auth module dynamically to avoid circular dependencies
    const { auth } = await import('../Components/Firebase');
    const { signOut } = await import('firebase/auth');
    
    // Sign out from Firebase
    await signOut(auth);
    
    // Clear all storage
    sessionStorage.clear();
    localStorage.removeItem('userAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('googlePhotoURL');
    
    // Clear profile picture cache
    clearProfilePictureData();
    
    // Reset language to default (English)
    clearLanguagePreference();
    
    // Redirect to login page
    if (navigate) {
      navigate('/login', { replace: true });
    } else {
      window.location.href = import.meta.env.BASE_URL + 'login';
    }
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
    // Fallback to basic logout if something fails
    sessionStorage.clear();
    localStorage.clear();
    if (navigate) {
      navigate('/login', { replace: true });
    } else {
      window.location.href = import.meta.env.BASE_URL + 'login';
    }
  }
}; 