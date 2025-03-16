import React from 'react';

const RecentActivity = () => {
  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      action: "Assignment Submitted",
      student: "Emma Thompson",
      subject: "Mathematics",
      time: "2 hours ago",
      status: "submitted"
    },
    {
      id: 2,
      action: "Quiz Completed",
      student: "Michael Brooks",
      subject: "Science",
      time: "4 hours ago",
      status: "completed"
    },
    {
      id: 3,
      action: "Course Enrollment",
      student: "Sophia Chen",
      subject: "History",
      time: "Yesterday",
      status: "enrolled"
    },
    {
      id: 4,
      action: "Assignment Pending",
      student: "Alex Johnson",
      subject: "English",
      time: "Yesterday",
      status: "pending"
    },
    {
      id: 5,
      action: "Assignment Reviewed",
      student: "James Wilson",
      subject: "Computer Science",
      time: "2 days ago",
      status: "reviewed"
    }
  ];

  // Function to render different icons based on status
  const getActivityIcon = (status) => {
    switch (status) {
      case 'submitted':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
      case 'completed':
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      case 'enrolled':
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0 4-4m-4 4-4-4"></path>
            </svg>
          </div>
        );
      case 'pending':
        return (
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8V4m0 4v12m0-4h8"></path>
            </svg>
          </div>
        );
      case 'reviewed':
        return (
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
          </div>
        );
      case 'progress':
        return (
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="font-medium text-gray-900 text-lg">Recent Activity</h3>
        <p className="text-sm text-gray-500 mt-1">Latest student activities</p>
      </div>
      <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center">
              {getActivityIcon(activity.status)}
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-700 truncate">{activity.student}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-500 truncate">{activity.subject}</span>
                </div>
              </div>
              <button className="ml-4 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity; 