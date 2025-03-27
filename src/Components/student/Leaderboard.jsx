import React, { useState, useEffect } from 'react';

const Leaderboard = ({ compact = true, userData }) => {
  const [activeClass] = useState('Class 10th'); // Fixed to Class 10th only
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localUserScore, setLocalUserScore] = useState(0);
  
  // Mock data for fallback
  const mockData = [
    { id: 1, name: 'Sarah Parker', score: 980, avatar: 'https://ui-avatars.com/api/?name=Sarah+Parker&background=ffdd00', class: 'Class 10th' },
    { id: 3, name: 'Michael Chen', score: 920, avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=6366f1', class: 'Class 10th' },
    { id: 4, name: 'Emma Wilson', score: 890, avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=ec4899', class: 'Class 10th' },
    { id: 5, name: 'David Kim', score: 875, avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=14b8a6', class: 'Class 10th' },
    { id: 6, name: 'Jessica Lee', score: 865, avatar: 'https://ui-avatars.com/api/?name=Jessica+Lee&background=8b5cf6', class: 'Class 10th' },
    { id: 7, name: 'Ryan Thompson', score: 855, avatar: 'https://ui-avatars.com/api/?name=Ryan+Thompson&background=f97316', class: 'Class 10th' },
    { id: 8, name: 'Olivia Martinez', score: 840, avatar: 'https://ui-avatars.com/api/?name=Olivia+Martinez&background=6366f1', class: 'Class 10th' },
    { id: 9, name: 'Ethan Brown', score: 830, avatar: 'https://ui-avatars.com/api/?name=Ethan+Brown&background=22c55e', class: 'Class 10th' },
    { id: 10, name: 'Sophia Davis', score: 820, avatar: 'https://ui-avatars.com/api/?name=Sophia+Davis&background=ec4899', class: 'Class 10th' },
  ];

  // Get saved quiz score from localStorage
  useEffect(() => {
    const checkLocalStorageScore = () => {
      try {
        // Get quiz score data
        const quizData = JSON.parse(localStorage.getItem('leaderboardData') || '{}');
        const localScore = quizData.score || 0;
        setLocalUserScore(localScore);
        
        // Update the score every time localStorage changes
        const handleStorageChange = () => {
          const updatedData = JSON.parse(localStorage.getItem('leaderboardData') || '{}');
          setLocalUserScore(updatedData.score || 0);
          fetchLeaderboardData(); // Refresh leaderboard with new scores
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
      } catch (err) {
        console.error('Error reading local storage data:', err);
      }
    };
    
    checkLocalStorageScore();
    
    // Check for changes every 5 seconds (as localStorage doesn't trigger events on the same page)
    const intervalId = setInterval(() => {
      try {
        const quizData = JSON.parse(localStorage.getItem('leaderboardData') || '{}');
        const localScore = quizData.score || 0;
        if (localScore !== localUserScore) {
          setLocalUserScore(localScore);
          fetchLeaderboardData(); // Refresh leaderboard
        }
      } catch (err) {
        console.error('Error checking score updates:', err);
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [localUserScore]);

  // Fetch leaderboard data
  const fetchLeaderboardData = () => {
    setIsLoading(true);
    try {
      // For now, we'll use mock data directly since the API isn't set up
      setTimeout(() => {
        arrangeLeaderboardWithCurrentUser(mockData);
        setError(null);
        setIsLoading(false);
      }, 500); // Simulate API delay
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError('Failed to load leaderboard data');
      arrangeLeaderboardWithCurrentUser(mockData);
      setIsLoading(false);
    }
  };

  // Arrange leaderboard to place current user at second position
  const arrangeLeaderboardWithCurrentUser = (data) => {
    try {
      // Get Google profile picture directly (highest priority)
      const googlePhotoURL = sessionStorage.getItem('googlePhotoURL');
      
      // Use quiz scores from localStorage if available
      const userScore = localUserScore > 0 ? 945 + localUserScore : 945;
      
      // Create current user object based on userData from StudentDashboard
      const currentUserData = {
        id: userData?.id || 'current-user',
        name: userData?.name || 'Alex Johnson',
        score: userScore, // Updated to include quiz points
        avatar: googlePhotoURL || userData?.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg', // Use Google photo first, then userData photoURL, then fallback
        class: 'Class 10th',
        isCurrentUser: true
      };
      
      console.log("Current user avatar set to:", currentUserData.avatar);
      console.log("Current user score set to:", currentUserData.score);
      
      if (!data || data.length === 0) {
        data = [...mockData]; // Ensure we have data
      }
      
      // Insert current user at second position
      const result = [data[0]]; // First position remains unchanged
      result.push(currentUserData); // Add current user at second position
      
      // Add remaining students (skipping any that might have same ID as current user)
      const remainingStudents = data.slice(1).filter(student => student.id !== currentUserData.id);
      result.push(...remainingStudents);
      
      setLeaderboardData(result);
    } catch (error) {
      console.error("Error arranging leaderboard data:", error);
      setLeaderboardData(mockData); // Fallback to mock data on error
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    // Only fetch once on mount, or when userData significantly changes
    if (isLoading || !leaderboardData.length) {
      fetchLeaderboardData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Filter students based on search term
  const filteredStudents = leaderboardData
    .filter(student => 
      searchTerm ? student.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );

  // For compact view, only show top 5 students
  const displayStudents = compact ? filteredStudents.slice(0, 5) : filteredStudents;

  // Get rank display based on position
  const getRankDisplay = (position) => {
    switch (position) {
      case 1:
        return (
          <div className="flex items-center justify-center w-10 h-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-xl font-bold text-yellow-800">1</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-10 h-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-300 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">2</span>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-10 h-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">3</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-10 h-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 flex items-center justify-center shadow-sm">
              <span className="text-lg font-bold text-indigo-800">{position}</span>
            </div>
          </div>
        );
    }
  };

  // Get score color based on position
  const getScoreColor = (position) => {
    switch (position) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-blue-500";
      case 3:
        return "text-amber-600";
      default:
        return "text-indigo-700";
    }
  };

  // Get background color based on position
  const getBgColor = (position, isCurrentUser) => {
    if (isCurrentUser) {
      return "bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 shadow-md";
    }
    
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200";
      default:
        return "hover:bg-blue-50 border border-transparent hover:border-blue-100";
    }
  };

  // Loading state
  if (isLoading && leaderboardData.length === 0) {
    return (
      <div className={`${compact ? 'bg-white rounded-lg shadow-sm p-4' : 'h-full'} flex items-center justify-center`}>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && leaderboardData.length === 0) {
    return (
      <div className={`${compact ? 'bg-white rounded-lg shadow-sm p-4' : 'h-full'} flex items-center justify-center`}>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-600 mb-2">Failed to load leaderboard data</p>
          <button 
            onClick={fetchLeaderboardData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'bg-white rounded-lg shadow-sm p-4' : 'h-full bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${compact ? 'mb-4' : 'mb-8 bg-white rounded-lg shadow-md p-5'}`}>
        <div>
          <h3 className={`${compact ? 'text-lg' : 'text-3xl'} font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600`}>
            {compact ? activeClass : 'Class 10th Champions'}
          </h3>
          {!compact && <p className="text-indigo-500 text-sm font-medium mt-1">Compete with your classmates and rise to the top!</p>}
        </div>
        
        {!compact && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-4 py-2 text-sm border border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm w-60"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2 text-indigo-400 hover:text-indigo-600"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>

      {/* Podium for top 3 students (only in full view) */}
      {!compact && displayStudents.length >= 3 && (
        <div className="relative flex justify-center items-end h-48 mb-12 px-8">
          {/* Second place - You */}
          <div className="w-1/4 z-10">
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg bg-blue-50 relative">
                  <img 
                    src={displayStudents[1]?.avatar} 
                    alt={displayStudents[1]?.name} 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayStudents[1]?.name || 'User')}&background=3b82f6&color=fff`;
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  2
                </div>
                <div className="absolute -top-1 -left-1 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full px-1.5 py-0.5 shadow-sm border border-indigo-200">
                  You
                </div>
              </div>
              <p className="text-sm font-semibold text-blue-700 mb-2 text-center">{displayStudents[1]?.name.split(' ')[0]}</p>
              <div className="h-20 w-full bg-gradient-to-t from-blue-400 to-blue-300 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-white">{displayStudents[1]?.score}</span>
              </div>
            </div>
          </div>
          
          {/* First place */}
          <div className="w-1/3 z-20 -mx-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-8 h-8 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 rotate-45"></div>
                <div className="w-8 h-8 absolute -top-8 left-1/2 transform -translate-x-1/2 rotate-45 border-t-4 border-l-4 border-yellow-400"></div>
              </div>
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg bg-yellow-50">
                  <img 
                    src={displayStudents[0]?.avatar} 
                    alt={displayStudents[0]?.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayStudents[0]?.name || 'First')}&background=f59e0b&color=fff`;
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-800 text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md">
                  1
                </div>
              </div>
              <p className="text-base font-bold text-yellow-700 mb-2 text-center">{displayStudents[0]?.name.split(' ')[0]}</p>
              <div className="h-32 w-full bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-yellow-800">{displayStudents[0]?.score}</span>
              </div>
            </div>
          </div>
          
          {/* Third place */}
          <div className="w-1/4 z-10">
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-amber-500 shadow-lg bg-amber-50">
                  <img 
                    src={displayStudents[2]?.avatar} 
                    alt={displayStudents[2]?.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayStudents[2]?.name || 'Third')}&background=d97706&color=fff`;
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  3
                </div>
              </div>
              <p className="text-sm font-semibold text-amber-700 mb-2 text-center">{displayStudents[2]?.name.split(' ')[0]}</p>
              <div className="h-16 w-full bg-gradient-to-t from-amber-600 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-white">{displayStudents[2]?.score}</span>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute w-full h-3 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bottom-0 rounded opacity-80"></div>
          
          {/* Sparkling effects */}
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
          <div className="absolute top-10 right-1/4 w-2 h-2 bg-indigo-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-10 left-1/5 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
        </div>
      )}
      
      {/* Leaderboard list */}
      <div className={`${compact ? 'space-y-3' : 'space-y-3 bg-white rounded-lg shadow-md p-6'} relative`}>
        {isLoading && displayStudents.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-lg">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Skip top 3 in full view since we have the podium */}
        {(compact ? displayStudents : displayStudents.slice(3)).map((student, index) => {
          const position = compact ? index + 1 : index + 4;
          const isCurrentUser = student.isCurrentUser;
          
          return (
            <div 
              key={student.id || index}
              className={`flex items-center ${compact ? 'p-2' : 'p-3'} rounded-lg ${getBgColor(position, isCurrentUser)} transition-all duration-200`}
            >
              <div className="flex items-center justify-center w-10 h-10 mr-2">
                {getRankDisplay(position)}
              </div>
              
              <div className={`h-10 w-10 rounded-full overflow-hidden relative ${compact ? 'ml-1' : 'ml-2'} ${isCurrentUser ? 'border-2 border-indigo-300' : ''} bg-indigo-50`}>
                <img 
                  src={student.avatar} 
                  alt={student.name} 
                  className="h-full w-full object-cover"
                  {...(isCurrentUser ? {
                    referrerPolicy: "no-referrer",
                    crossOrigin: "anonymous"
                  } : {})}
                  onError={(e) => {
                    // Generate a colored avatar based on name
                    const colors = ['3b82f6', '8b5cf6', 'ec4899', 'f97316', '22c55e', '14b8a6'];
                    const colorIndex = student.id % colors.length;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'User')}&background=${colors[colorIndex]}&color=fff`;
                  }}
                />
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <p className={`font-medium ${isCurrentUser ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {student.name}
                  </p>
                  {isCurrentUser && 
                    <span className="text-xs ml-2 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                      You
                    </span>
                  }
                </div>
                {!compact && (
                  <p className="text-xs text-indigo-500 mt-0.5">Completed 24 quizzes this month</p>
                )}
              </div>
              
              <div className="flex items-center">
                <div className={`flex items-center justify-center ${compact ? 'w-16' : 'w-20'} ${
                  isCurrentUser 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-blue-50'
                } rounded-full py-1 px-2`}>
                  <span className={`font-bold ${getScoreColor(position)}`}>
                    {student.score}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">pts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* View full rankings button - only in compact view */}
      {compact && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-sm font-medium w-full text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
            View Full Rankings
          </button>
        </div>
      )}
      
      {/* Pagination and filtering - only in full view */}
      {!compact && displayStudents.length > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-indigo-100 pt-4 bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-indigo-600">
            Showing <span className="font-medium">{displayStudents.length}</span> students
          </div>
          
          <div className="inline-flex items-center space-x-1 bg-indigo-100 border border-indigo-200 rounded-full px-4 py-1.5 shadow-sm">
            <span className="text-sm text-indigo-800">Your position:</span>
            <div className="flex items-center">
              <div className="text-green-500 text-xs mr-1">▲</div>
              <span className="font-bold text-indigo-700 ml-1">#2</span>
            </div>
            <span className="text-xs text-indigo-500">in {activeClass}</span>
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {!compact && displayStudents.length === 0 && !isLoading && (
        <div className="py-12 text-center bg-white rounded-lg shadow-sm">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-indigo-400">?</span>
          </div>
          <h3 className="text-lg font-medium text-indigo-900 mb-2">No results found</h3>
          <p className="text-indigo-500">Try adjusting your search to find students.</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 