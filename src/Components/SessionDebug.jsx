import React, { useState, useEffect } from 'react';
import { clearProfilePictureData } from '../utils/ProfilePictureManager';

const SessionDebug = () => {
  const [sessionData, setSessionData] = useState({});
  const [newPhotoURL, setNewPhotoURL] = useState('');

  useEffect(() => {
    // Get all session storage data
    const data = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      data[key] = sessionStorage.getItem(key);
    }
    setSessionData(data);
  }, []);

  const updateSessionValue = (key, value) => {
    sessionStorage.setItem(key, value);
    setSessionData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const removeSessionValue = (key) => {
    sessionStorage.removeItem(key);
    setSessionData(prev => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  const handlePhotoUpdate = () => {
    if (newPhotoURL.trim()) {
      updateSessionValue('googlePhotoURL', newPhotoURL);
      setNewPhotoURL('');
    }
  };

  const clearSession = () => {
    // Use our utility to clear profile picture data properly
    clearProfilePictureData();
    
    // Clear other session data
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    
    // Force refresh the page to show updated state
    window.location.reload();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Current Session Data:</h2>
        <pre className="bg-white p-2 rounded">
          {JSON.stringify(sessionData, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Profile Picture:</h2>
        {sessionData.userPhotoURL ? (
          <div>
            <img 
              src={sessionData.userPhotoURL} 
              alt="User Profile" 
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://ui-avatars.com/api/?name=User&background=4f46e5&color=ffffff";
              }}
            />
            <p className="mt-2 text-sm">URL: {sessionData.userPhotoURL}</p>
          </div>
        ) : (
          <p>No profile picture URL stored</p>
        )}
      </div>
      
      <button
        onClick={clearSession}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Clear Session Data
      </button>
    </div>
  );
};

export default SessionDebug; 