import React, { useState } from 'react';
import { Menu, X, ChevronDown, User, Search } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            {/* Logo with proper sizing */}
                            <img
                                src="/api/placeholder/150/40"
                                alt="EduGenius"
                                className="h-8 w-auto"
                            />
                        </div>

                        {/* Tagline - visible only on larger screens */}
                        <div className="hidden lg:block ml-3 text-sm text-gray-600 italic">
                            Empowering Teachers. Elevating Students. Simplifying Learning.
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-6 md:flex md:space-x-6">
                            <a href="#" className="border-orange-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Home
                            </a>
                            <a href="#" className="border-transparent text-gray-500 hover:border-orange-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Courses
                            </a>
                            <a href="#" className="border-transparent text-gray-500 hover:border-orange-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Resources
                            </a>
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="border-transparent text-gray-500 hover:border-orange-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Services
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                                                Corporate Training
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                                                Student Mentoring
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                                                Certification Programs
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <a href="#" className="border-transparent text-gray-500 hover:border-orange-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                About
                            </a>
                        </div>
                    </div>

                    {/* Right Side - Search and Login */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                className="block w-full pl-8 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="Search..."
                                type="search"
                            />
                        </div>
                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600">
                            <User className="h-4 w-4 mr-1" />
                            Login
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            {isMenuOpen && (
                <div className="md:hidden">
                    {/* Show tagline on mobile */}
                    <div className="px-4 pt-2 pb-1 text-sm text-gray-600 italic border-b border-gray-200">
                        Empowering Teachers. Elevating Students. Simplifying Learning.
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <a href="#" className="bg-orange-50 border-orange-500 text-orange-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                            Home
                        </a>
                        <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-orange-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                            Courses
                        </a>
                        <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-orange-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                            Resources
                        </a>
                        <button
                            onClick={() => { }}
                            className="w-full text-left border-transparent text-gray-600 hover:bg-gray-50 hover:border-orange-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            Services
                        </button>
                        <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-orange-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                            About
                        </a>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                                    <User className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">Account</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <a href="#" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;