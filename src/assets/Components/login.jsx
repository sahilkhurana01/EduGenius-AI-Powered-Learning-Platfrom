import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
const [isLogin, setIsLogin] = useState(true);
const [showPassword, setShowPassword] = useState(false);
const [loginData, setLoginData] = useState({ email: '', password: '' });
const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

const handleLoginChange = (e) => {
setLoginData({ ...loginData, [e.target.name]: e.target.value });
};

const handleSignupChange = (e) => {
setSignupData({ ...signupData, [e.target.name]: e.target.value });
};

const handleSubmit = (e) => {
e.preventDefault();
console.log(isLogin ? 'Login with:' : 'Signup with:', isLogin ? loginData : signupData);
};

const handleGoogleSignIn = () => {
console.log('Sign in with Google');
// Implement Google sign-in logic here
};

return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden flex relative h-[500px]">
        {/* Sliding information panel */}
        <div className={`w-1/2 bg-black text-white p-10 flex flex-col justify-center transition-all duration-700
            ease-in-out absolute h-full ${isLogin ? 'left-0' : 'left-1/2' }`} style={{ zIndex: 10 }}>
            <div className="mb-8">
                <img src="/api/placeholder/100/40" alt="EduGenius Logo" className="h-8 mb-6" />
                <h2 className="text-2xl font-bold mb-2">
                    {isLogin ? 'Welcome Back!' : 'Join EduGenius'}
                </h2>
                <p className="text-gray-300 text-sm">
                    {isLogin
                    ? 'Sign in to access your account and continue your learning journey.'
                    : 'Create an account to start your educational journey with us.'}
                </p>
            </div>

            <button onClick={()=> setIsLogin(!isLogin)}
                className="mt-6 py-2 px-4 border border-white rounded-md text-sm font-medium transition-colors
                duration-200 hover:bg-white hover:text-black"
                >
                {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
        </div>

        {/* Form containers - now positioned on both sides */}
        <div className="w-1/2 p-10 absolute left-0 transition-all duration-700 ease-in-out" style={{ opacity: isLogin ?
            0 : 1, visibility: isLogin ? 'hidden' : 'visible' , transform: isLogin ? 'translateX(-30px)'
            : 'translateX(0)' , zIndex: isLogin ? 0 : 5 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input id="signup-name" name="name" type="text" required value={signupData.name}
                            onChange={handleSignupChange}
                            className="focus:ring-black focus:border-black block w-full pl-10 py-2 border border-gray-300 rounded-md"
                            placeholder="John Doe" />
                    </div>
                </div>

                <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input id="signup-email" name="email" type="email" required value={signupData.email}
                            onChange={handleSignupChange}
                            className="focus:ring-black focus:border-black block w-full pl-10 py-2 border border-gray-300 rounded-md"
                            placeholder="you@example.com" />
                    </div>
                </div>

                <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input id="signup-password" name="password" type={showPassword ? "text" : "password" } required
                            value={signupData.password} onChange={handleSignupChange}
                            className="focus:ring-black focus:border-black block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md"
                            placeholder="••••••••" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button type="button" onClick={()=> setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-500"
                                >
                                {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                                ) : (
                                <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <button type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                        Sign Up
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div>
                    <button type="button" onClick={handleGoogleSignIn}
                        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                        <svg width="20" height="20" viewBox="0 0 24 24">
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

        <div className="w-1/2 p-10 absolute right-0 transition-all duration-700 ease-in-out" style={{ opacity: isLogin ?
            1 : 0, visibility: isLogin ? 'visible' : 'hidden' , transform: isLogin ? 'translateX(0)'
            : 'translateX(30px)' , zIndex: isLogin ? 5 : 0 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input id="login-email" name="email" type="email" required value={loginData.email}
                            onChange={handleLoginChange}
                            className="focus:ring-black focus:border-black block w-full pl-10 py-2 border border-gray-300 rounded-md"
                            placeholder="you@example.com" />
                    </div>
                </div>

                <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input id="login-password" name="password" type={showPassword ? "text" : "password" } required
                            value={loginData.password} onChange={handleLoginChange}
                            className="focus:ring-black focus:border-black block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md"
                            placeholder="••••••••" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button type="button" onClick={()=> setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-500"
                                >
                                {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                                ) : (
                                <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox"
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-black hover:text-gray-700">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <div>
                    <button type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                        Sign In
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div>
                    <button type="button" onClick={handleGoogleSignIn}
                        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                        <svg width="20" height="20" viewBox="0 0 24 24">
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