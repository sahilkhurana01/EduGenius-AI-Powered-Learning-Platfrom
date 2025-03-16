import React from 'react';

const StudentsTab = () => {
  // Mock data for students
  const students = [
    {
      id: 1,
      name: 'Alex Johnson',
      avatar: '👨‍🎓',
      email: 'alex.johnson@example.com',
      grade: 'A',
      attendance: '95%',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'Samantha Brown',
      avatar: '👩‍🎓',
      email: 'samantha.brown@example.com',
      grade: 'B+',
      attendance: '90%',
      lastActivity: 'Yesterday'
    },
    {
      id: 3,
      name: 'Michael Lee',
      avatar: '👨‍🎓',
      email: 'michael.lee@example.com',
      grade: 'A-',
      attendance: '98%',
      lastActivity: '3 hours ago'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      avatar: '👩‍🎓',
      email: 'emma.wilson@example.com',
      grade: 'B',
      attendance: '85%',
      lastActivity: '1 day ago'
    },
    {
      id: 5,
      name: 'Ryan Thomas',
      avatar: '👨‍🎓',
      email: 'ryan.thomas@example.com',
      grade: 'A+',
      attendance: '100%',
      lastActivity: 'Just now'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Students</h2>
        <p className="text-sm text-gray-500">View and manage your students</p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search students..."
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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ml-4 text-sm">
            Add Student
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {student.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {student.grade}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{student.attendance}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{student.lastActivity}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">View</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsTab; 