import React from 'react';

const StudentProgress = () => {
  // Mock students data with progress
  const studentsProgress = [
    { id: 1, name: 'Emma Wilson', progress: 86, subject: 'Mathematics', change: 8 },
    { id: 2, name: 'Liam Thompson', progress: 92, subject: 'Science', change: 5 },
    { id: 3, name: 'Olivia Martinez', progress: 78, subject: 'History', change: -3 },
    { id: 4, name: 'Noah Johnson', progress: 65, subject: 'English', change: 12 },
    { id: 5, name: 'Ava Williams', progress: 90, subject: 'Physics', change: 2 }
  ];

  // Function to render progress bar color
  const getProgressColor = (progress) => {
    if (progress >= 85) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Function to render change indicator
  const renderChangeIndicator = (change) => {
    if (change > 0) {
      return (
        <span className="flex items-center text-green-600 text-xs">
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
          {change}%
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="flex items-center text-red-600 text-xs">
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          {Math.abs(change)}%
        </span>
      );
    }
    return (
      <span className="text-gray-500 text-xs">No change</span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Student Progress</h2>
        <div className="space-x-2">
          <select className="py-1 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="all">All Classes</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="english">English</option>
            <option value="history">History</option>
          </select>
          <select className="py-1 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {studentsProgress.map((student) => (
          <div key={student.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.subject}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-lg font-semibold">{student.progress}%</div>
                {renderChangeIndicator(student.change)}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getProgressColor(student.progress)}`}
                style={{ width: `${student.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-500">Showing 5 of 32 students</span>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All Students</button>
      </div>
    </div>
  );
};

export default StudentProgress; 