import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecentActivity from './dashboard/RecentActivity';
import ResourceLibrary from './dashboard/ResourceLibrary';
import MyCourses from './dashboard/MyCourses';
import StatCards from './dashboard/StatCards';
import MessagesTab from './dashboard/MessagesTab';
import CalendarTab from './dashboard/CalendarTab';
import LessonsTab from './dashboard/LessonsTab';
import WeeklyActivity from './dashboard/WeeklyActivity';
import HelpSupport from './dashboard/HelpSupport';
import CourseSettings from './dashboard/CourseSettings';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'alex.johnson@example.com'
  });
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated and is a student
  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated || userRole !== 'student') {
      navigate('/login');
    } else {
      // Fetch user data from session storage if available
      const userName = sessionStorage.getItem('userName');
      const userPhoto = sessionStorage.getItem('userPhoto');
      const userEmail = sessionStorage.getItem('userEmail');
      const googlePhotoURL = sessionStorage.getItem('googlePhotoURL');
      
      console.log('Available user data:', { 
        userName, 
        userPhoto, 
        userEmail, 
        googlePhotoURL 
      });
      
      // Update user data from session storage - prioritize Google photo if available
      setUserData({
        name: userName || userData.name,
        photoURL: googlePhotoURL || userPhoto || userData.photoURL,
        email: userEmail || userData.email
      });
      
      console.log('Updated user data:', { 
        name: userName || userData.name,
        photoURL: googlePhotoURL || userPhoto || userData.photoURL,
        email: userEmail || userData.email
      });
    }
  }, [navigate]);

  // Default stats for student dashboard
  const dashboardStats = {
    coursesCompleted: 5,
    progress: 68,
    quizAvg: 87,
    nextExam: "May 15",
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to handle Google login for profile picture
  const fetchGoogleProfilePicture = async () => {
    setProfilePictureLoading(true);
    try {
      // Get the Google photo URL directly from session storage
      const googlePhotoURL = sessionStorage.getItem('googlePhotoURL');
      
      if (googlePhotoURL) {
        console.log('Found Google profile picture URL:', googlePhotoURL);
        
        // Check if the image URL is valid
        const img = new Image();
        img.onload = () => {
          console.log('Google profile image loaded successfully:', googlePhotoURL);
          setUserData(prevData => ({
            ...prevData,
            photoURL: googlePhotoURL
          }));
        };
        img.onerror = () => {
          console.error('Failed to load Google profile image URL:', googlePhotoURL);
          // Keep the current photo URL or fallback to default
        };
        img.src = googlePhotoURL;
      } else {
        console.warn('No Google profile picture URL found in session storage');
      }
    } catch (error) {
      console.error('Error fetching Google profile picture:', error);
    } finally {
      setProfilePictureLoading(false);
    }
  };

  // Fetch Google profile picture on component mount
  useEffect(() => {
    // Check if we already have the user's photo
    const googlePhotoURL = sessionStorage.getItem('googlePhotoURL');
    
    if (googlePhotoURL) {
      console.log('Google photo URL found in session storage:', googlePhotoURL);
      
      // Set the photo URL immediately
      setUserData(prevData => ({
        ...prevData,
        photoURL: googlePhotoURL
      }));
      
      // Also verify the image can be loaded
      const img = new Image();
      img.onload = () => {
        console.log('Google profile image loaded successfully');
      };
      img.onerror = () => {
        console.error('Failed to load Google profile image, falling back to default');
      };
      img.src = googlePhotoURL;
    } else {
      console.log('No Google photo URL found in session storage');
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-md ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 fixed h-full z-10`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen ? (
              <a href="#" className="flex items-center group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-white rounded-full p-1">
                    <svg className="h-7 w-7 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  EduGenius
                </span>
              </a>
            ) : (
              <div className="w-8 h-8 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md flex items-center justify-center text-white font-bold">
                E
              </div>
            )}
            <button onClick={toggleSidebar} className="text-gray-500 hover:text-indigo-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}></path>
              </svg>
            </button>
          </div>
          
          <div className="space-y-2">
            <NavItem icon="dashboard" label="Dashboard" active={activeTab === 'dashboard'} collapsed={!sidebarOpen} onClick={() => setActiveTab('dashboard')} />
            <NavItem icon="courses" label="My Courses" active={activeTab === 'courses'} collapsed={!sidebarOpen} onClick={() => setActiveTab('courses')} />
            <NavItem icon="ai" label="Ask from AI" active={activeTab === 'ai'} collapsed={!sidebarOpen} onClick={() => {
              sessionStorage.setItem('userRole', 'student');
              navigate('/ask-ai');
            }} />
            <NavItem icon="resources" label="Resources" active={activeTab === 'resources'} collapsed={!sidebarOpen} onClick={() => setActiveTab('resources')} />
            <NavItem icon="calendar" label="Calendar" active={activeTab === 'calendar'} collapsed={!sidebarOpen} onClick={() => setActiveTab('calendar')} />
            <NavItem icon="messages" label="Messages" active={activeTab === 'messages'} collapsed={!sidebarOpen} onClick={() => setActiveTab('messages')} />
            <NavItem icon="help" label="Help & Support" active={activeTab === 'help'} collapsed={!sidebarOpen} onClick={() => setActiveTab('help')} />
          </div>
          
          <div className="mt-auto">
            <div className={`border-t pt-4 ${sidebarOpen ? '' : 'flex justify-center'}`}>
              <button 
                className={`flex items-center ${sidebarOpen ? 'text-yellow-500 space-x-2' : 'justify-center text-yellow-500'} hover:text-yellow-600`}
                onClick={() => {
                  sessionStorage.removeItem('isAuthenticated');
                  sessionStorage.removeItem('userRole');
                  sessionStorage.removeItem('userName');
                  sessionStorage.removeItem('userPhoto');
                  sessionStorage.removeItem('userEmail');
                  sessionStorage.removeItem('googlePhotoURL');
                  navigate('/login');
                }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <button className="text-indigo-600 hover:text-indigo-800 relative transition-colors duration-150">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer group relative">
              <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-transparent group-hover:border-indigo-500 transition-all duration-200 relative">
                {profilePictureLoading ? (
                  <div className="h-full w-full flex items-center justify-center bg-gray-200">
                    <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <img 
                    src={userData.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback to default image if the profile picture fails to load
                      console.error('Profile image failed to load, falling back to default', userData.photoURL);
                      e.target.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                    }}
                  />
                )}
              </div>
              <span className="text-sm font-medium text-indigo-800 group-hover:text-indigo-600 transition-colors duration-200">{userData.name}</span>
              
              {/* User dropdown (hidden by default) */}
              <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                </div>
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">Profile Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">Preferences</a>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-indigo-900">Student Dashboard</h1>
            <p className="text-gray-500">Welcome back, {userData.name}. Here's what's happening with your courses today.</p>
          </div>
          
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <StatCards stats={dashboardStats} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-medium text-indigo-800 mb-4">My Learning Progress</h2>
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Mathematics - Algebra</span>
                      <span className="text-sm font-medium text-indigo-600">85%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Physics - Mechanics</span>
                      <span className="text-sm font-medium text-indigo-600">62%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                    
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Literature - Modern Fiction</span>
                      <span className="text-sm font-medium text-indigo-600">78%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-medium text-indigo-800 mb-4">Recent Activity</h2>
                  <RecentActivity />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-medium text-indigo-800 mb-4">My Courses</h2>
                  <MyCourses />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-medium text-indigo-800 mb-4">Resource Library</h2>
                  <ResourceLibrary />
                </div>
              </div>
            </div>
          )}

          {/* Lessons Tab */}
          {activeTab === 'courses' && (
            <div className="transition-opacity duration-300">
              <MyCourses />
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="transition-opacity duration-300">
              <ResourceLibrary />
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="transition-opacity duration-300">
              <CalendarTab />
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="transition-opacity duration-300">
              <MessagesTab />
            </div>
          )}

          {/* Help & Support Tab */}
          {activeTab === 'help' && (
            <div className="transition-opacity duration-300">
              <HelpSupport />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon, label, active, collapsed, onClick }) => {
  // Return the appropriate icon based on the label
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'dashboard':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
        );
      case 'courses':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        );
      case 'resources':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        );
      case 'calendar':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        );
      case 'messages':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        );
      case 'help':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'ai':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-2 rounded-lg transition-colors duration-150 ${
        active 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
          : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <div className={active ? 'text-white' : 'text-gray-500'}>
        {getIcon(icon)}
      </div>
      {!collapsed && <span className={`ml-3 ${active ? 'font-medium' : ''}`}>{label}</span>}
    </button>
  );
};

export default StudentDashboard; 