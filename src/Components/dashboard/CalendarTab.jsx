import React, { useState } from 'react';

const CalendarTab = () => {
  const [currentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Get the current month and year
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthName = monthNames[currentMonth.getMonth()];
  const currentYear = currentMonth.getFullYear();

  // Mock calendar events
  const events = [
    { id: 1, title: 'Math Test - Grade 10', date: '2024-03-15', time: '9:00 AM - 10:30 AM', type: 'exam' },
    { id: 2, title: 'Parent-Teacher Meeting', date: '2024-03-18', time: '3:00 PM - 6:00 PM', type: 'meeting' },
    { id: 3, title: 'Science Lab Session', date: '2024-03-21', time: '11:00 AM - 12:30 PM', type: 'class' },
    { id: 4, title: 'Field Trip to Museum', date: '2024-03-25', time: 'All Day', type: 'event' },
    { id: 5, title: 'Staff Development Day', date: '2024-03-28', time: '9:00 AM - 4:00 PM', type: 'training' }
  ];

  // Function to handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // Function to close the event details
  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Card */}
      <div className="bg-white rounded-lg shadow-md lg:col-span-2">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{currentMonthName} {currentYear}</h2>
          <p className="text-sm text-gray-500">View your schedule and planned activities</p>
        </div>
        
        <div className="p-6">
          {/* Calendar Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-50">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h3 className="text-lg font-medium text-gray-800">{currentMonthName} {currentYear}</h3>
            <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-50">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {/* Generate calendar days (just a simple example, not a real calendar) */}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 3; // Offset to start the month on the correct day
              return (
                <div 
                  key={i} 
                  className={`p-2 text-center rounded-md ${
                    day > 0 && day <= 31 
                      ? 'hover:bg-gray-100 cursor-pointer' 
                      : 'text-gray-300'
                  } ${
                    day === 15 || day === 18 || day === 21 || day === 25 || day === 28
                      ? 'border-2 border-blue-500'
                      : ''
                  }`}
                  onClick={() => {
                    const eventForDay = events.find(e => parseInt(e.date.split('-')[2]) === day);
                    if (eventForDay && day > 0 && day <= 31) {
                      handleEventClick(eventForDay);
                    }
                  }}
                >
                  {day > 0 && day <= 31 ? day : ''}
                  {day === 15 && <div className="h-1 w-1 bg-blue-500 rounded-full mx-auto mt-1"></div>}
                  {day === 18 && <div className="h-1 w-1 bg-green-500 rounded-full mx-auto mt-1"></div>}
                  {day === 21 && <div className="h-1 w-1 bg-purple-500 rounded-full mx-auto mt-1"></div>}
                  {day === 25 && <div className="h-1 w-1 bg-yellow-500 rounded-full mx-auto mt-1"></div>}
                  {day === 28 && <div className="h-1 w-1 bg-red-500 rounded-full mx-auto mt-1"></div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Events List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
          <p className="text-sm text-gray-500">Your scheduled activities</p>
        </div>
        
        <div className="p-4">
          <div className="flex flex-col space-y-3">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    event.type === 'exam' ? 'bg-blue-100 text-blue-800' : 
                    event.type === 'meeting' ? 'bg-green-100 text-green-800' :
                    event.type === 'class' ? 'bg-purple-100 text-purple-800' :
                    event.type === 'event' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="text-xs text-gray-500">{event.time}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              Add New Event
            </button>
          </div>
        </div>
      </div>
      
      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
              <button 
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedEvent.type === 'exam' ? 'bg-blue-100 text-blue-800' : 
                  selectedEvent.type === 'meeting' ? 'bg-green-100 text-green-800' :
                  selectedEvent.type === 'class' ? 'bg-purple-100 text-purple-800' :
                  selectedEvent.type === 'event' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="text-gray-700">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-700">{selectedEvent.time}</span>
              </div>
              
              <p className="text-gray-600 border-t border-gray-200 pt-4">
                Additional details about this event would appear here. This includes information about the location, participants, and any special instructions.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={handleCloseDetails}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                Edit Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarTab; 