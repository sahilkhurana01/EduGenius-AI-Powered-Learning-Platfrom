import React from 'react';

const LessonsTab = () => {
  // Mock data for lessons
  const lessons = [
    {
      id: 1,
      title: 'Introduction to Algebra',
      subject: 'Mathematics',
      level: 'Intermediate',
      duration: '45 min',
      status: 'Published',
      lastUpdated: '2 days ago'
    },
    {
      id: 2,
      title: 'The Cell Structure',
      subject: 'Biology',
      level: 'Beginner',
      duration: '60 min',
      status: 'Draft',
      lastUpdated: 'Today'
    },
    {
      id: 3,
      title: 'World War II Overview',
      subject: 'History',
      level: 'Advanced',
      duration: '90 min',
      status: 'Published',
      lastUpdated: '1 week ago'
    },
    {
      id: 4,
      title: 'Poetry Analysis',
      subject: 'English',
      level: 'Intermediate',
      duration: '50 min',
      status: 'Published',
      lastUpdated: '3 days ago'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Lessons</h2>
        <p className="text-sm text-gray-500">Create and manage your lesson plans</p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search lessons..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="history">History</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
            Create Lesson
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <h3 className="font-medium text-lg text-gray-800">{lesson.title}</h3>
                <span 
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    lesson.status === 'Published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {lesson.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">{lesson.subject}</div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {lesson.duration}
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  {lesson.level}
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Updated {lesson.lastUpdated}
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50">Edit</button>
                <button className="px-3 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonsTab; 