import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { auth } from './Firebase'; // Make sure this path is correct
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "firebase/auth";


const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    // Get user role from session storage
    const userRole = sessionStorage.getItem('userRole') || 'student';

    // Check if device is mobile on mount and window resize
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        
        // Check initially
        checkIfMobile();
        
        // Add event listener for window resize
        window.addEventListener('resize', checkIfMobile);
        
        // Clean up
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSignupChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    // Reset form fields
    const resetFormFields = () => {
        if (isLogin) {
            setLoginData({ email: '', password: '' });
        } else {
            setSignupData({ name: '', email: '', password: '' });
        }
    };

    // Handle back button click - redirects to previous page
    const handleGoBack = () => {
        window.history.back();
    };

    // Handle transition animation
    const toggleAuthMode = () => {
        setAnimating(true);
        setTimeout(() => {
            setIsLogin(!isLogin);
            setTimeout(() => {
                setAnimating(false);
            }, 700);
        }, 100);
        resetFormFields();
    };

    // Handle navigation after successful login
    const navigateAfterLogin = (user) => {
        // Store user information in session storage
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userEmail', user.email);
        
        // Set user name with preference for display name, fallback to email prefix
        const userName = user.displayName || user.email.split('@')[0];
        sessionStorage.setItem('userName', userName);
        
        sessionStorage.setItem('userId', user.uid);
        
        // Store the user's profile picture if available
        if (user.photoURL) {
            console.log('Storing user profile photo URL:', user.photoURL);
            sessionStorage.setItem('googlePhotoURL', user.photoURL);
        }
        
        console.log('All session storage data set:', {
            isAuthenticated: true,
            userEmail: user.email,
            userName,
            userId: user.uid,
            photoURL: user.photoURL
        });
        
        // Get the user role that was set in the role selection page
        const userRole = sessionStorage.getItem('userRole');
        
        // If no role is set, default to student and go to role selection
        if (!userRole) {
            console.log('No user role found, redirecting to role selection');
            navigate('/');
            return;
        }
        
        console.log(`User authenticated with role: ${userRole}`);
        
        // Navigate based on user role
        if (userRole === 'teacher') {
            navigate('/teacher-dashboard');
        } else if (userRole === 'student') {
            navigate('/student-dashboard');
        } else {
            // Unknown role, redirect to role selection
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Handle Login
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    loginData.email,
                    loginData.password
                );
                console.log('User logged in successfully');
                // Reset login form fields
                setLoginData({ email: '', password: '' });
                
                // Navigate to appropriate dashboard
                navigateAfterLogin(userCredential.user);
            } else {
                // Handle Signup
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    signupData.email,
                    signupData.password
                );

                // Update user profile with name
                await updateProfile(userCredential.user, {
                    displayName: signupData.name
                });

                console.log('User created successfully');
                // Reset signup form fields
                setSignupData({ name: '', email: '', password: '' });
                
                // Navigate to appropriate dashboard
                navigateAfterLogin(userCredential.user);
            }
        } catch (error) {
            setError(error.message);
            console.error('Authentication error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log('Google login successful');
            console.log('Google user data:', result.user);
            
            // Reset both form fields after Google login
            setLoginData({ email: '', password: '' });
            setSignupData({ name: '', email: '', password: '' });
            
            // Store profile photo URL in session storage
            if (result.user?.photoURL) {
                console.log('Storing Google profile picture URL:', result.user.photoURL);
                sessionStorage.setItem('googlePhotoURL', result.user.photoURL);
                
                // Log to see if the URL is correctly stored
                const storedURL = sessionStorage.getItem('googlePhotoURL');
                console.log('Verified stored Google photo URL:', storedURL);
            } else {
                console.warn('No profile picture URL found in Google login result');
            }
            
            // Set user role from previously selected role
            const userRole = sessionStorage.getItem('userRole') || 'student';
            console.log('User role for navigation:', userRole);
            
            // Navigate to appropriate dashboard
            navigateAfterLogin(result.user);
        } catch (error) {
            setError(error.message);
            console.error('Google login error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Simulate Google login for demonstration (if used)
    const simulateGoogleLogin = () => {
        // Simulate delay of API call
        setTimeout(() => {
            // Get the user role that was set in the role selection page
            const userRole = sessionStorage.getItem('userRole');
            
            // Mock Google user data with the appropriate details
            const mockGoogleUser = {
                displayName: userRole === 'teacher' ? 'Sahil Khurana' : 'Student User',
                email: userRole === 'teacher' ? 'sahil.khurana@gmail.com' : 'student@example.com',
                uid: Math.random().toString(36).substring(2),
                // Use a real Google profile picture URL format
                photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocLkYAVjp-R_6hQj_2oOYG_Oq8dTfK71q1kZJYZ_mpFC=s96-c'
            };
            
            console.log('Google login successful with data:', mockGoogleUser);
            
            // Save to session storage
            sessionStorage.setItem('isAuthenticated', 'true');
            // Do NOT override the role here, we want to keep the user's selection
            sessionStorage.setItem('userName', mockGoogleUser.displayName);
            sessionStorage.setItem('userEmail', mockGoogleUser.email);
            sessionStorage.setItem('userId', mockGoogleUser.uid);
            sessionStorage.setItem('googlePhotoURL', mockGoogleUser.photoURL);
            
            console.log('Stored in session storage:', {
                userName: mockGoogleUser.displayName,
                userEmail: mockGoogleUser.email,
                googlePhotoURL: mockGoogleUser.photoURL,
                userRole
            });
            
            // Navigate to the appropriate dashboard based on role
            if (userRole === 'teacher') {
                navigate('/teacher-dashboard');
            } else if (userRole === 'student') {
                navigate('/student-dashboard');
            } else {
                // If no valid role, go to role selection
                navigate('/');
            }
            
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {/* Enhanced back button with increased spacing */}
            <button 
                onClick={handleGoBack}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="absolute top-4 sm:top-6 left-6 sm:left-8 flex items-center justify-center gap-1 sm:gap-2 
                  py-2.5 sm:py-2 px-2.5 sm:px-4 
                  rounded-full sm:rounded-md 
                  shadow-md hover:shadow-lg 
                  text-xs sm:text-sm font-medium 
                  active:scale-95
                  transition-all duration-300 ease-in-out 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                  dark:focus:ring-offset-gray-800
                  z-10"
                style={{
                    backgroundColor: isHovered ? 'black' : 'white',
                    color: isHovered ? 'white' : 'black',
                    borderColor: 'black',
                    borderWidth: '1px',
                    transform: isHovered ? 'translateX(-5px)' : 'translateX(0)'
                }}
            >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Back</span>
            </button>
            
            {/* Main container with responsive design and increased top margin */}
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row relative min-h-[550px] sm:h-[550px] mt-16 sm:mt-12">
                {/* Sliding information panel - mobile first approach with reversed animation */}
                <div 
                    className={`w-full sm:w-1/2 bg-black text-white p-6 sm:p-10 flex flex-col justify-center 
                          ${isLogin ? 'order-1 sm:order-none' : 'order-2 sm:order-none'}
                          ${isLogin ? '' : 'sm:absolute sm:h-full'}`} 
                    style={{ 
                        zIndex: 10,
                        transition: 'all 0.7s cubic-bezier(0.645, 0.045, 0.355, 1.000)',
                        transform: `translateX(${isLogin ? 0 : (!isMobile ? '100%' : 0)})`
                    }}>
                    <div className="mb-6 sm:mb-8">
                        <img src=".\public/edugenius logo.png" alt="EduGenius Logo" className="h-6 sm:h-8 mb-4 sm:mb-6 invert" />
                        <h2 className="text-xl sm:text-2xl font-bold mb-2">
                            {isLogin ? 'Welcome Back!' : 'Join EduGenius'}
                        </h2>
                        <p className="text-gray-300 text-xs sm:text-sm">
                            {isLogin
                                ? 'Sign in to access your account and continue your learning journey.'
                                : 'Create an account to start your educational journey with us.'}
                        </p>
                    </div>

                    <button 
                        onClick={toggleAuthMode}
                        disabled={animating}
                        className={`mt-4 sm:mt-6 py-1.5 sm:py-2 px-3 sm:px-4 border border-white rounded-md text-xs sm:text-sm font-medium 
                            transition-colors duration-200 hover:bg-white hover:text-black
                            ${animating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>

                {/* Form containers - responsive layouts for both forms with reversed animation */}
                <div 
                    className={`w-full sm:w-1/2 p-5 sm:p-7 order-2 sm:order-none
                        ${isLogin ? 'hidden sm:block' : 'block'}`}
                    style={{
                        position: !isMobile ? 'absolute' : 'relative',
                        left: !isMobile ? 0 : 'auto',
                        opacity: isLogin ? 0 : 1,
                        visibility: isLogin ? 'hidden' : 'visible',
                        transform: `translateX(${isLogin ? -30 : 0}px)`,
                        transition: 'all 0.7s cubic-bezier(0.645, 0.045, 0.355, 1.000)',
                        zIndex: isLogin ? 0 : 5
                    }}>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Create Account</h2>
                    {error && !isLogin && <p className="text-red-500 text-xs sm:text-sm mb-3 sm:mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Name input */}
                        <div>
                            <label htmlFor="signup-name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input id="signup-name" name="name" type="text" required value={signupData.name}
                                    onChange={handleSignupChange}
                                    className="focus:ring-black focus:border-black block w-full pl-9 sm:pl-10 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md"
                                    placeholder="John Doe" />
                            </div>
                        </div>

                        {/* Email input */}
                        <div>
                            <label htmlFor="signup-email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input id="signup-email" name="email" type="email" required value={signupData.email}
                                    onChange={handleSignupChange}
                                    className="focus:ring-black focus:border-black block w-full pl-9 sm:pl-10 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md"
                                    placeholder="you@example.com" />
                            </div>
                        </div>

                        {/* Password input */}
                        <div>
                            <label htmlFor="signup-password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input id="signup-password" name="password" type={showPassword ? "text" : "password"} required
                                    value={signupData.password} onChange={handleSignupChange}
                                    className="focus:ring-black focus:border-black block w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md"
                                    placeholder="••••••••" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                        ) : (
                                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Button */}
                        <div>
                            <button type="submit"
                                className="w-full flex justify-center py-1.5 sm:py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                disabled={loading}>
                                {loading ? 'Processing...' : 'Sign Up'}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google button */}
                        <div>
                            <button type="button" onClick={googleLogin}
                                className="w-full flex justify-center items-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                disabled={loading}>
                                <svg width="16" height="16" viewBox="0 0 24 24" className="sm:w-[20px] sm:h-[20px]">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4" />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853" />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05" />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335" />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sign in form with reversed animation */}
                <div 
                    className={`w-full sm:w-1/2 p-5 sm:p-10 order-2 sm:order-none
                        ${isLogin ? 'block' : 'hidden sm:block'}`}
                    style={{
                        position: !isMobile ? 'absolute' : 'relative',
                        right: !isMobile ? 0 : 'auto',
                        opacity: isLogin ? 1 : 0,
                        visibility: isLogin ? 'visible' : 'hidden',
                        transform: `translateX(${isLogin ? 0 : 30}px)`,
                        transition: 'all 0.7s cubic-bezier(0.645, 0.045, 0.355, 1.000)',
                        zIndex: isLogin ? 5 : 0
                    }}>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Sign In</h2>
                    {error && isLogin && <p className="text-red-500 text-xs sm:text-sm mb-3 sm:mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Email input */}
                        <div>
                            <label htmlFor="login-email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input id="login-email" name="email" type="email" required value={loginData.email}
                                    onChange={handleLoginChange}
                                    className="focus:ring-black focus:border-black block w-full pl-9 sm:pl-10 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md"
                                    placeholder="you@example.com" />
                            </div>
                        </div>

                        {/* Password input */}
                        <div>
                            <label htmlFor="login-password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input id="login-password" name="password" type={showPassword ? "text" : "password"} required
                                    value={loginData.password} onChange={handleLoginChange}
                                    className="focus:ring-black focus:border-black block w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md"
                                    placeholder="••••••••" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                        ) : (
                                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox"
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-black focus:ring-black border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-xs sm:text-sm">
                                <a href="#" className="font-medium text-black hover:text-gray-700">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {/* Button */}
                        <div>
                            <button type="submit"
                                className="w-full flex justify-center py-1.5 sm:py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                disabled={loading}>
                                {loading ? 'Processing...' : 'Sign In'}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google button */}
                        <div>
                            <button type="button" onClick={googleLogin}
                                className="w-full flex justify-center items-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                disabled={loading}>
                                <svg width="16" height="16" viewBox="0 0 24 24" className="sm:w-[20px] sm:h-[20px]">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4" />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853" />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05" />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335" />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;