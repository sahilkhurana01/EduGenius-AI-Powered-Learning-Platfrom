import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, GraduationCap } from 'lucide-react';




const RoleSelectionPage = () => {
    const [hoveredRole, setHoveredRole] = useState(null);
    const [isTeacher, setIsTeacher] = useState(null); // State to store the selected role
    
    const navigate = useNavigate();
    const handleRoleSelect = (role) => {
        console.log(`Selected role: ${role}`);

        // Save the selected role
        if (role === 'teacher') {
            setIsTeacher(true);
        } else if (role === 'student') {
            setIsTeacher(false);
        }

        // Store the role
        sessionStorage.setItem('userRole', role);

        // Redirect to login page using React Router
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 md:p-8">
            <div className="w-full max-w-4xl">
                {/* Responsive header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">Welcome to EduGenius</h1>
                    <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto px-2">
                        Tell us who you are so we can personalize your experience
                    </p>
                </div>

                {/* Responsive card layout */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 w-full">
                    {/* Teacher Card - mobile friendly */}
                    <div
                        className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full md:w-80 cursor-pointer 
                        transition-all duration-300 ease-out relative
                        hover:shadow-xl active:shadow-inner active:scale-[0.98]
                        touch-action-manipulation"
                        style={{
                            transform: hoveredRole === 'teacher' ? 'scale(1.05)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setHoveredRole('teacher')}
                        onMouseLeave={() => setHoveredRole(null)}
                        onClick={() => handleRoleSelect('teacher')}
                    >
                        {/* Border overlay that doesn't affect layout */}
                        <div
                            className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
                            style={{
                                border: '2px solid black',
                                opacity: hoveredRole === 'teacher' ? 1 : 0,
                                boxShadow: hoveredRole === 'teacher' ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none'
                            }}
                        />

                        <div className="flex flex-col items-center justify-center h-48 md:h-64">
                            <div className="mb-4 md:mb-6 transition-transform duration-300"
                                style={{
                                    transform: hoveredRole === 'teacher' ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                <School
                                    size={hoveredRole === 'teacher' ? (window.innerWidth < 768 ? 70 : 100) : (window.innerWidth < 768 ? 60 : 80)}
                                    className="transition-colors duration-300"
                                    color={hoveredRole === 'teacher' ? '#000000' : '#4B5563'}
                                />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">I'm a Teacher</h2>
                            <p className="text-gray-600 text-center text-sm md:text-base transition-opacity duration-300"
                                style={{
                                    opacity: hoveredRole === 'teacher' ? 1 : 0.7
                                }}
                            >
                                Create courses, manage classrooms, and track student progress
                            </p>
                            <button
                                className="mt-4 md:mt-6 py-1.5 md:py-2 px-4 md:px-6 rounded-md text-white text-sm md:text-base font-medium transition-all duration-300 
                                active:scale-95 touch-action-manipulation"
                                style={{
                                    backgroundColor: hoveredRole === 'teacher' ? '#000000' : '#374151',
                                    opacity: hoveredRole === 'teacher' ? 1 : 0,
                                    transform: hoveredRole === 'teacher' ? 'translateY(0)' : 'translateY(8px)'
                                }}
                            >
                                Continue as Teacher
                            </button>
                        </div>
                    </div>

                    {/* Student Card - mobile friendly */}
                    <div
                        className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full md:w-80 cursor-pointer 
                        transition-all duration-300 ease-out relative
                        hover:shadow-xl active:shadow-inner active:scale-[0.98]
                        touch-action-manipulation"
                        style={{
                            transform: hoveredRole === 'student' ? 'scale(1.05)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setHoveredRole('student')}
                        onMouseLeave={() => setHoveredRole(null)}
                        onClick={() => handleRoleSelect('student')}
                    >
                        {/* Border overlay that doesn't affect layout */}
                        <div
                            className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
                            style={{
                                border: '2px solid black',
                                opacity: hoveredRole === 'student' ? 1 : 0,
                                boxShadow: hoveredRole === 'student' ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none'
                            }}
                        />

                        <div className="flex flex-col items-center justify-center h-48 md:h-64">
                            <div className="mb-4 md:mb-6 transition-transform duration-300"
                                style={{
                                    transform: hoveredRole === 'student' ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                <GraduationCap
                                    size={hoveredRole === 'student' ? (window.innerWidth < 768 ? 70 : 100) : (window.innerWidth < 768 ? 60 : 80)}
                                    className="transition-colors duration-300"
                                    color={hoveredRole === 'student' ? '#000000' : '#4B5563'}
                                />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">I'm a Student</h2>
                            <p className="text-gray-600 text-center text-sm md:text-base transition-opacity duration-300"
                                style={{
                                    opacity: hoveredRole === 'student' ? 1 : 0.7
                                }}
                            >
                                Enroll in courses, access learning materials, and track your progress
                            </p>
                            <button
                                className="mt-4 md:mt-6 py-1.5 md:py-2 px-4 md:px-6 rounded-md text-white text-sm md:text-base font-medium transition-all duration-300
                                active:scale-95 touch-action-manipulation"
                                style={{
                                    backgroundColor: hoveredRole === 'student' ? '#000000' : '#374151',
                                    opacity: hoveredRole === 'student' ? 1 : 0,
                                    transform: hoveredRole === 'student' ? 'translateY(0)' : 'translateY(8px)'
                                }}
                            >
                                Continue as Student
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8 md:mt-12">
                    <p className="text-gray-500 text-xs md:text-sm">
                        You can change your role later in your profile settings
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;