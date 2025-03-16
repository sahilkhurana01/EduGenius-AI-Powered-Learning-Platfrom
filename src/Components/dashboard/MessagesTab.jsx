import React from 'react';

const MessagesTab = () => {
  // Mock data for messages
  const messages = [
    {
      id: 1,
      sender: 'John Smith',
      avatar: '👤',
      message: 'Hello! I have a question about the upcoming math test.',
      time: '10:30 AM',
      unread: true,
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      avatar: '👤',
      message: 'Can we reschedule the parent-teacher meeting?',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 3,
      sender: 'Mike Thompson',
      avatar: '👤',
      message: 'I\'ve submitted my science project report.',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 4,
      sender: 'Emily Clark',
      avatar: '👤',
      message: 'Thank you for the feedback on my essay!',
      time: 'Mar 14',
      unread: false,
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        <p className="text-sm text-gray-500">Stay connected with students and parents</p>
      </div>
      
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search messages..."
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
            New Message
          </button>
        </div>
        
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start p-3 rounded-lg transition-colors ${
                message.unread ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0 bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center">
                {message.avatar}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{message.sender}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{message.message}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">{message.time}</span>
                    {message.unread && (
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-600 mt-1"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Messages
        </button>
      </div>
    </div>
  );
};

export default MessagesTab; 