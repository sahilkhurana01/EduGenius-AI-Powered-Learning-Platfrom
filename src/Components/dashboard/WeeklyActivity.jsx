import React, { useState } from 'react';

const WeeklyActivity = () => {
  const [selectedView, setSelectedView] = useState('overview');

  // Mock data for weekly activity
  const activityData = {
    monday: 85,
    tuesday: 92,
    wednesday: 78,
    thursday: 95,
    friday: 65,
    saturday: 40,
    sunday: 30
  };

  const courses = [
    { id: 1, name: "Mathematics", progress: 85, color: "bg-blue-500" },
    { id: 2, name: "Science", progress: 72, color: "bg-green-500" },
    { id: 3, name: "English", progress: 65, color: "bg-purple-500" },
    { id: 4, name: "History", progress: 90, color: "bg-yellow-500" },
  ];

  // Helper function to get the highest activity day
  const getHighestActivityDay = () => {
    const maxDay = Object.entries(activityData).reduce((max, [day, value]) => 
      value > max.value ? {day, value} : max, {day: '', value: 0});
    
    return maxDay.day.charAt(0).toUpperCase() + maxDay.day.slice(1);
  };

  // Helper function to get activity progress
  const getWeeklyProgress = () => {
    const total = Object.values(activityData).reduce((sum, val) => sum + val, 0);
    const max = 7 * 100; // 7 days * 100% max per day
    return Math.round((total / max) * 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100">
        <div className="px-6 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-900 text-lg">Weekly Activity</h3>
              <p className="text-sm text-gray-500 mt-1">Student engagement across the week</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setSelectedView('overview')}
                className={`px-3 py-1 text-sm rounded-md ${selectedView === 'overview' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setSelectedView('courses')}
                className={`px-3 py-1 text-sm rounded-md ${selectedView === 'courses' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'}`}
              >
                Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {selectedView === 'overview' ? (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Highest Activity</h4>
                <p className="text-lg font-semibold text-gray-900">{getHighestActivityDay()}</p>
                <p className="text-sm text-blue-600 mt-1">Most active day of the week</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Weekly Progress</h4>
                <p className="text-lg font-semibold text-gray-900">{getWeeklyProgress()}%</p>
                <p className="text-sm text-green-600 mt-1">Overall weekly engagement</p>
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-700 mb-3">Daily Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(activityData).map(([day, value]) => (
                <div key={day} className="flex items-center">
                  <div className="w-20 text-sm capitalize text-gray-500">{day}</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right text-sm text-gray-700">{value}%</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Course Activity</h4>
            <div className="space-y-4">
              {courses.map(course => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-medium text-gray-700">{course.name}</h5>
                    <span className="text-sm text-gray-500">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${course.color} rounded-full`} 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                <span>View detailed reports</span>
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyActivity; 