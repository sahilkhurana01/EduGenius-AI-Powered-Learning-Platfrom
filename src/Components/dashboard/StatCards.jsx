import React, { useState, useEffect } from 'react';

const StatCards = ({ stats }) => {
  // Create a default empty stats object if stats is undefined
  const stats_ = stats || {
    students: 0,
    attendance: 0,
    completion: 0,
    avgTime: '0h'
  };

  // State for animated values
  const [animatedValues, setAnimatedValues] = useState({
    students: 0,
    attendance: 0,
    completion: 0
  });

  // Animation effect when component mounts
  useEffect(() => {
    // Set real target values (with fallbacks)
    const targetValues = {
      students: stats_?.students || 245,
      attendance: stats_?.attendance || 92,
      completion: stats_?.completion || 78
    };
    
    // Calculate animation step sizes
    const steps = 30; // total animation steps
    const animationDuration = 1500; // ms
    const interval = animationDuration / steps;
    
    const studentStep = targetValues.students / steps;
    const attendanceStep = targetValues.attendance / steps;
    const completionStep = targetValues.completion / steps;
    
    let currentStep = 0;
    const animationInterval = setInterval(() => {
      currentStep++;
      
      if (currentStep <= steps) {
        setAnimatedValues({
          students: Math.round(Math.min(studentStep * currentStep, targetValues.students)),
          attendance: Math.round(Math.min(attendanceStep * currentStep, targetValues.attendance)),
          completion: Math.round(Math.min(completionStep * currentStep, targetValues.completion))
        });
      } else {
        clearInterval(animationInterval);
      }
    }, interval);
    
    return () => clearInterval(animationInterval);
  }, [stats_]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {/* Total Students Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                <dd>
                  <div className="text-2xl font-semibold text-gray-900">{animatedValues.students}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-2">
          <div className="text-xs text-gray-500 flex items-center">
            <span className="inline-flex items-center text-green-500 mr-2">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
              4.2%
            </span>
            vs last month
          </div>
        </div>
      </div>

      {/* Attendance Rate Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-50">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Attendance Rate</dt>
                <dd>
                  <div className="text-2xl font-semibold text-gray-900">{animatedValues.attendance}%</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-2">
          <div className="text-xs text-gray-500 flex items-center">
            <span className="inline-flex items-center text-green-500 mr-2">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
              1.8%
            </span>
            vs last month
          </div>
        </div>
      </div>

      {/* Course Completion Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-50">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Course Completion</dt>
                <dd>
                  <div className="text-2xl font-semibold text-gray-900">{animatedValues.completion}%</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-2">
          <div className="text-xs text-gray-500 flex items-center">
            <span className="inline-flex items-center text-red-500 mr-2">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
              0.5%
            </span>
            vs last month
          </div>
        </div>
      </div>

      {/* Average Time Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-50">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg. Study Time</dt>
                <dd>
                  <div className="text-2xl font-semibold text-gray-900">{stats_?.avgTime || "4.5h"}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-2">
          <div className="text-xs text-gray-500 flex items-center">
            <span className="inline-flex items-center text-green-500 mr-2">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
              12.5%
            </span>
            vs last month
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards; 