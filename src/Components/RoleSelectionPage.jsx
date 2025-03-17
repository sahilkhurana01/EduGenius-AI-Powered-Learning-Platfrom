import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RoleSelectionPage = () => {
    const [hoveredRole, setHoveredRole] = useState(null);
    const [isTeacher, setIsTeacher] = useState(null);
    
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
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
            {/* Background animated shapes */}
            <motion.div
                className="absolute top-20 right-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                animate={{
                    x: [0, 30, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                }}
            />

            <motion.div
                className="absolute bottom-20 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                animate={{
                    x: [0, -30, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                }}
            />
            
            <div className="w-full max-w-4xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Choose Your Role</h1>
                    <p className="text-gray-600 text-lg max-w-xl mx-auto">
                        Tell us who you are so we can personalize your learning journey
                    </p>
                </motion.div>

                {/* Card layout */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full">
                    {/* Teacher Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white p-8 md:p-16 rounded-2xl shadow-lg w-full md:w-1/2 cursor-pointer transition-all duration-300 relative overflow-hidden"
                        onMouseEnter={() => setHoveredRole('teacher')}
                        onMouseLeave={() => setHoveredRole(null)}
                        onClick={() => handleRoleSelect('teacher')}
                    >
                        {/* Gradient border overlay */}
                        <div 
                            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                            style={{
                                opacity: hoveredRole === 'teacher' ? 1 : 0,
                                background: 'linear-gradient(to right, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1))'
                            }}
                        />
                        
                        <div className="flex flex-col items-center justify-center h-64">
                            <motion.div 
                                className="mb-6 p-4 rounded-full"
                                animate={hoveredRole === 'teacher' ? { 
                                    scale: [1, 1.1, 1],
                                    backgroundColor: ['rgba(79, 70, 229, 0.1)', 'rgba(124, 58, 237, 0.2)', 'rgba(79, 70, 229, 0.1)']
                                } : {}}
                                transition={{ duration: 2, repeat: hoveredRole === 'teacher' ? Infinity : 0 }}
                            >
                                <School
                                    size={80}
                                    className="transition-colors duration-300"
                                    color={hoveredRole === 'teacher' ? '#4F46E5' : '#6B7280'}
                                />
                            </motion.div>
                            
                            <h2 className="text-2xl font-bold mb-3 text-center">I'm a Teacher</h2>
                            
                            <p className="text-gray-600 text-center mb-6">
                                Create courses, manage classrooms, and track student progress
                            </p>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full inline-flex items-center transition-all shadow-lg"
                            >
                                Continue as Teacher
                                <ArrowRight className="ml-2" size={18} />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Student Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white p-8 md:p-16 rounded-2xl shadow-lg w-full md:w-1/2 cursor-pointer transition-all duration-300 relative overflow-hidden"
                        onMouseEnter={() => setHoveredRole('student')}
                        onMouseLeave={() => setHoveredRole(null)}
                        onClick={() => handleRoleSelect('student')}
                    >
                        {/* Gradient border overlay */}
                        <div 
                            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                            style={{
                                opacity: hoveredRole === 'student' ? 1 : 0,
                                background: 'linear-gradient(to right, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))'
                            }}
                        />
                        
                        <div className="flex flex-col items-center justify-center h-64">
                            <motion.div 
                                className="mb-6 p-4 rounded-full"
                                animate={hoveredRole === 'student' ? { 
                                    scale: [1, 1.1, 1],
                                    backgroundColor: ['rgba(245, 158, 11, 0.1)', 'rgba(251, 191, 36, 0.2)', 'rgba(245, 158, 11, 0.1)']
                                } : {}}
                                transition={{ duration: 2, repeat: hoveredRole === 'student' ? Infinity : 0 }}
                            >
                                <GraduationCap
                                    size={80}
                                    className="transition-colors duration-300"
                                    color={hoveredRole === 'student' ? '#F59E0B' : '#6B7280'}
                                />
                            </motion.div>
                            
                            <h2 className="text-2xl font-bold mb-3 text-center">I'm a Student</h2>
                            
                            <p className="text-gray-600 text-center mb-6">
                                Enroll in courses, access learning materials, and track your progress
                            </p>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-medium py-3 px-8 rounded-full inline-flex items-center transition-all shadow-lg"
                            >
                                Continue as Student
                                <ArrowRight className="ml-2" size={18} />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center mt-8"
                >
                    <p className="text-gray-500 text-sm">
                        You can change your role later in your profile settings
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;