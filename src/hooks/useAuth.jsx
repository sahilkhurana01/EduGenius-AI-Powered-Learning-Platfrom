import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../Components/Firebase';
import { useNavigate } from 'react-router-dom';

// Create the auth context
const AuthContext = createContext();

// Hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component for auth context
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to log out user
  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      // Clear session storage
      sessionStorage.clear();
      localStorage.removeItem('userAuthenticated');
      // The onAuthStateChanged listener will handle the state update
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  };

  useEffect(() => {
    console.log('Setting up auth persistence...');
    
    // Try to set persistence to LOCAL (persist even after browser closed)
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Firebase auth persistence set to LOCAL successfully');
      })
      .catch(error => {
        console.error('Error setting auth persistence:', error);
        // Fallback to manual persistence via localStorage if Firebase persistence fails
        const userAuthenticated = localStorage.getItem('userAuthenticated');
        if (userAuthenticated === 'true') {
          console.log('Using fallback persistence mechanism');
        }
      });
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User ${user.email} logged in` : 'No user');
      
      if (user) {
        // User is signed in
        setCurrentUser(user);
        
        // Store authentication flag in localStorage for persistence across sessions
        localStorage.setItem('userAuthenticated', 'true');
        
        // Make sure we have all user data in session storage
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userEmail', user.email);
        sessionStorage.setItem('userName', user.displayName || user.email.split('@')[0]);
        sessionStorage.setItem('userId', user.uid);
        
        // Also store in localStorage for backup persistence
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.displayName || user.email.split('@')[0]);
        localStorage.setItem('userId', user.uid);
        
        if (user.photoURL) {
          sessionStorage.setItem('googlePhotoURL', user.photoURL);
          localStorage.setItem('googlePhotoURL', user.photoURL);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        
        // Check if we have a persisted user in localStorage as a fallback
        const persistedAuth = localStorage.getItem('userAuthenticated');
        if (persistedAuth === 'true') {
          console.log('Found persisted authentication in localStorage');
          // Don't clear localStorage here to maintain persistence
          // We'll rely on explicit logout
        } else {
          localStorage.removeItem('userAuthenticated');
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser || localStorage.getItem('userAuthenticated') === 'true',
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to handle authentication redirects
export function useAuthRedirect() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      // If user is not authenticated, redirect to login
      navigate('/login', { replace: true });
    } else {
      // If user is authenticated, get their role
      const userRole = sessionStorage.getItem('userRole');
      
      // Redirect to dashboard based on role
      if (userRole === 'teacher') {
        navigate('/teacher-dashboard', { replace: true });
      } else if (userRole === 'student') {
        navigate('/student-dashboard', { replace: true });
      } else {
        // If no role is set, redirect to role selection
        navigate('/role-selection', { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);
} 