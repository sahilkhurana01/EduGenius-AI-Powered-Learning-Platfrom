/**
 * Helper functions for auth persistence across browser sessions
 */

// Restore session data from localStorage if needed
export const restoreSessionFromLocalStorage = () => {
  // Check if we need to restore (session storage empty but localStorage has data)
  const isAuthenticatedSession = sessionStorage.getItem('isAuthenticated');
  const isAuthenticatedLocal = localStorage.getItem('userAuthenticated');
  
  if (!isAuthenticatedSession && isAuthenticatedLocal === 'true') {
    console.log('Restoring session data from localStorage');
    
    // Restore basic auth data
    sessionStorage.setItem('isAuthenticated', 'true');
    
    // Restore user info
    if (localStorage.getItem('userEmail')) {
      sessionStorage.setItem('userEmail', localStorage.getItem('userEmail'));
    }
    
    if (localStorage.getItem('userName')) {
      sessionStorage.setItem('userName', localStorage.getItem('userName'));
    }
    
    if (localStorage.getItem('userId')) {
      sessionStorage.setItem('userId', localStorage.getItem('userId'));
    }
    
    if (localStorage.getItem('userRole')) {
      sessionStorage.setItem('userRole', localStorage.getItem('userRole'));
    }
    
    if (localStorage.getItem('googlePhotoURL')) {
      sessionStorage.setItem('googlePhotoURL', localStorage.getItem('googlePhotoURL'));
    }
    
    return true;
  }
  
  return false;
};

// Save current session to localStorage for persistence
export const saveSessionToLocalStorage = () => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');
  
  if (isAuthenticated === 'true') {
    localStorage.setItem('userAuthenticated', 'true');
    
    // Save user info
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    }
    
    const userName = sessionStorage.getItem('userName');
    if (userName) {
      localStorage.setItem('userName', userName);
    }
    
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      localStorage.setItem('userId', userId);
    }
    
    const userRole = sessionStorage.getItem('userRole');
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    }
    
    const googlePhotoURL = sessionStorage.getItem('googlePhotoURL');
    if (googlePhotoURL) {
      localStorage.setItem('googlePhotoURL', googlePhotoURL);
    }
    
    return true;
  }
  
  return false;
}; 