import React, { useState } from 'react';

const CourseSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  // Mock course data
  const courseData = {
    name: 'Advanced Mathematics',
    description: 'A comprehensive course covering algebra, calculus, and trigonometry for high school students.',
    startDate: '2023-09-01',
    endDate: '2024-06-15',
    enrollmentStatus: 'Open',
    visibility: 'Public',
    passingGrade: 70,
    maxStudents: 30,
    allowLateSubmissions: true,
    enableDiscussions: true,
    enablePeerReviews: false,
    notifyOnSubmission: true
  };

  // Mock completion settings
  const completionSettings = [
    { id: 1, name: 'Assignments', required: true, minCount: 8, minScore: 70 },
    { id: 2, name: 'Quizzes', required: true, minCount: 5, minScore: 75 },
    { id: 3, name: 'Final Exam', required: true, minCount: 1, minScore: 65 },
    { id: 4, name: 'Discussion Participation', required: false, minCount: 10, minScore: 0 }
  ];

  const renderSettings = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                    <input 
                      type="text" 
                      value={courseData.name} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      value={courseData.startDate} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Status</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Open</option>
                      <option>Closed</option>
                      <option>Invite Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Students</label>
                    <input 
                      type="number" 
                      value={courseData.maxStudents} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
                    <textarea 
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >{courseData.description}</textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input 
                      type="date" 
                      value={courseData.endDate} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passing Grade (%)</label>
                    <input 
                      type="number" 
                      value={courseData.passingGrade} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Course Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox" 
                      checked={courseData.allowLateSubmissions} 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">Allow Late Submissions</label>
                    <p className="text-gray-500">Students can submit assignments after the due date</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox" 
                      checked={courseData.enableDiscussions} 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">Enable Discussions</label>
                    <p className="text-gray-500">Students can participate in course discussions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox" 
                      checked={courseData.enablePeerReviews} 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">Enable Peer Reviews</label>
                    <p className="text-gray-500">Students can review each other's submissions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox" 
                      checked={courseData.notifyOnSubmission} 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">Notify on Submission</label>
                    <p className="text-gray-500">Receive notifications when students submit assignments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'completion':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Course Completion Requirements</h3>
            <p className="text-sm text-gray-500 mb-6">
              Define what students need to complete in order to finish the course.
            </p>
            
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum Count</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum Score (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completionSettings.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center h-5">
                          <input 
                            type="checkbox" 
                            checked={item.required} 
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input 
                          type="number" 
                          value={item.minCount} 
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input 
                          type="number" 
                          value={item.minScore} 
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex items-center">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Requirement
              </button>
              <p className="ml-4 text-sm text-gray-500">
                Students must complete all required items to finish the course.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="border-b border-gray-100">
        <div className="flex items-center px-1 py-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-5 py-3 text-sm font-medium rounded-lg ${
              activeTab === 'general'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('completion')}
            className={`px-5 py-3 text-sm font-medium rounded-lg ${
              activeTab === 'completion'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Completion Requirements
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {renderSettings()}
      </div>
      
      <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancel
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CourseSettings; 