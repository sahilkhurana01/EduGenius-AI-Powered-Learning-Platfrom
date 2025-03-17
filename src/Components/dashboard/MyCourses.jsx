import React from 'react';

const MyCourses = () => {
  // Sample courses data
  const courses = [
    {
      id: 1,
      title: 'Mathematics: Algebra',
      instructor: 'Dr. Sarah Johnson',
      progress: 85,
      nextLesson: 'Quadratic Equations',
      lastAccessed: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 2,
      title: 'Physics: Mechanics',
      instructor: 'Prof. Michael Chen',
      progress: 62,
      nextLesson: 'Newton\'s Laws of Motion',
      lastAccessed: 'Yesterday',
      image: 'https://images.unsplash.com/photo-1646617747566-ba3cb42aad60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 3,
      title: 'Literature: Modern Fiction',
      instructor: 'Dr. Emily Watson',
      progress: 78,
      nextLesson: 'Post-modernism and Contemporary Works',
      lastAccessed: '3 days ago',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    }
  ];

  return (
    <div className="space-y-4">
      {courses.map(course => (
        <div key={course.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 h-32 sm:h-auto overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${course.title.replace(/ /g, '+')}&background=6366f1&color=fff`;
                }}
              />
            </div>
            <div className="p-4 sm:w-2/3 flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-indigo-900">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <span>Next: {course.nextLesson}</span>
                  <span className="mx-2">•</span>
                  <span>Last accessed {course.lastAccessed}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-indigo-600 font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600" 
                    style={{ width: `${course.progress}%` }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-2 flex justify-between">
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Continue Learning
            </button>
            <div className="flex space-x-4">
              <button className="text-sm text-gray-500 hover:text-indigo-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
              </button>
              <button className="text-sm text-gray-500 hover:text-indigo-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex justify-center mt-4">
        <button className="flex items-center text-indigo-600 hover:text-indigo-800">
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Browse More Courses</span>
        </button>
      </div>
    </div>
  );
};

export default MyCourses; 