import React, { useState } from 'react';

const Leaderboard = ({ compact = true }) => {
  const [activeClass] = useState('Class 10th'); // Fixed to Class 10th only
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for the leaderboard
  const allStudentsData = [
    { id: 1, name: 'Sarah Parker', score: 980, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', class: 'Class 10th' },
    { id: 2, name: 'Alex Johnson', score: 945, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isCurrentUser: true, class: 'Class 10th' },
    { id: 3, name: 'Michael Chen', score: 920, avatar: 'https://randomuser.me/api/portraits/men/67.jpg', class: 'Class 10th' },
    { id: 4, name: 'Emma Wilson', score: 890, avatar: 'https://randomuser.me/api/portraits/women/63.jpg', class: 'Class 10th' },
    { id: 5, name: 'David Kim', score: 875, avatar: 'https://randomuser.me/api/portraits/men/91.jpg', class: 'Class 10th' },
    { id: 6, name: 'Jessica Lee', score: 865, avatar: 'https://randomuser.me/api/portraits/women/33.jpg', class: 'Class 10th' },
    { id: 7, name: 'Ryan Thompson', score: 855, avatar: 'https://randomuser.me/api/portraits/men/41.jpg', class: 'Class 10th' },
    { id: 8, name: 'Olivia Martinez', score: 840, avatar: 'https://randomuser.me/api/portraits/women/19.jpg', class: 'Class 10th' },
    { id: 9, name: 'Ethan Brown', score: 830, avatar: 'https://randomuser.me/api/portraits/men/22.jpg', class: 'Class 10th' },
    { id: 10, name: 'Sophia Davis', score: 820, avatar: 'https://randomuser.me/api/portraits/women/28.jpg', class: 'Class 10th' },
  ];

  // Filter students based on active class and search term
  const filteredStudents = allStudentsData
    .filter(student => student.class === activeClass)
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
      {!compact && (
        <div className="relative flex justify-center items-end h-48 mb-12 px-8">
          {/* Second place */}
          <div className="w-1/4 z-10">
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg">
                  <img 
                    src={displayStudents[1]?.avatar} 
                    alt={displayStudents[1]?.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayStudents[1]?.name);
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  2
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
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg">
                  <img 
                    src={displayStudents[0]?.avatar} 
                    alt={displayStudents[0]?.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayStudents[0]?.name);
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
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-amber-500 shadow-lg">
                  <img 
                    src={displayStudents[2]?.avatar} 
                    alt={displayStudents[2]?.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayStudents[2]?.name);
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
      <div className={`${compact ? 'space-y-3' : 'space-y-3 bg-white rounded-lg shadow-md p-6'}`}>
        {/* Skip top 3 in full view since we have the podium */}
        {(compact ? displayStudents : displayStudents.slice(3)).map((student, index) => {
          const position = compact ? index + 1 : index + 4;
          const isCurrentUser = student.isCurrentUser;
          
          return (
            <div 
              key={student.id}
              className={`flex items-center ${compact ? 'p-2' : 'p-3'} rounded-lg ${getBgColor(position, isCurrentUser)} transition-all duration-200`}
            >
              <div className="flex items-center justify-center w-10 h-10 mr-2">
                {getRankDisplay(position)}
              </div>
              
              <div className={`h-10 w-10 rounded-full overflow-hidden ${compact ? 'ml-1' : 'ml-2'} ${isCurrentUser ? 'border-2 border-indigo-300' : ''}`}>
                <img 
                  src={student.avatar} 
                  alt={student.name} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.name);
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
      {!compact && displayStudents.length === 0 && (
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