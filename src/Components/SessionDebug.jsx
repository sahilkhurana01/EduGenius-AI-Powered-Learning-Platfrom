import React, { useState, useEffect } from 'react';

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

  const clearAllSession = () => {
    sessionStorage.clear();
    setSessionData({});
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Session Storage Debug</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Update Profile Photo URL</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter new photo URL"
            value={newPhotoURL}
            onChange={(e) => setNewPhotoURL(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handlePhotoUpdate}
          >
            Update
          </button>
        </div>
        <div className="mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={() => removeSessionValue('googlePhotoURL')}
          >
            Remove Photo URL
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={clearAllSession}
          >
            Clear All Session Data
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Current Session Storage Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Key</th>
                <th className="py-2 px-4 border-b text-left">Value</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(sessionData).length > 0 ? (
                Object.entries(sessionData).map(([key, value]) => (
                  <tr key={key} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{key}</td>
                    <td className="py-2 px-4 overflow-hidden text-ellipsis max-w-xs">
                      {key === 'googlePhotoURL' || key === 'userPhoto' ? (
                        <div className="flex items-center gap-2">
                          <img 
                            src={value} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.target.src = 'https://randomuser.me/api/portraits/women/45.jpg';
                              e.target.classList.add('border', 'border-red-500');
                            }}
                          />
                          <span className="text-xs truncate">{value}</span>
                        </div>
                      ) : (
                        value
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeSessionValue(key)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    No session storage data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Set Common Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              updateSessionValue('isAuthenticated', 'true');
              updateSessionValue('userRole', 'teacher');
              updateSessionValue('userName', 'Sahil Khurana');
              updateSessionValue('userEmail', 'sahil.khurana@example.com');
              updateSessionValue('googlePhotoURL', 'https://lh3.googleusercontent.com/a/ACg8ocLkYAVjp-R_6hQj_2oOYG_Oq8dTfK71q1kZJYZ_mpFC=s96-c');
            }}
          >
            Set Test User (Sahil)
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDebug; 