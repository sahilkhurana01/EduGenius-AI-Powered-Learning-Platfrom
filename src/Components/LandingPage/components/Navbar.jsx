"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, Menu, X, ChevronDown } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(dropdown)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center"
          >
            <a href="#" className="flex items-center group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-full p-1">
                  <GraduationCap className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                EduGenius
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative group">
              <button
                onClick={() => toggleDropdown("features")}
                className="px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors rounded-md flex items-center"
              >
                Features
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === "features" ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {activeDropdown === "features" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100"
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      For Students
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      For Teachers
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      For Schools
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative group">
              <button
                onClick={() => toggleDropdown("courses")}
                className="px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors rounded-md flex items-center"
              >
                Courses
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === "courses" ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {activeDropdown === "courses" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100"
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Mathematics
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Science
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Language Arts
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      History
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#"
              className="px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors rounded-md"
            >
              Testimonials
            </a>
            <a
              href="#"
              className="px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors rounded-md"
            >
              Pricing
            </a>
            <a
              href="#"
              className="px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors rounded-md"
            >
              Contact
            </a>

            <div className="ml-4 flex items-center space-x-3">
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Log In
              </a>
              <a
                href="#"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Sign Up Free
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("mobileFeatures")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                >
                  <span>Features</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${activeDropdown === "mobileFeatures" ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === "mobileFeatures" && (
                  <div className="pl-4 py-2 space-y-1">
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    >
                      For Students
                    </a>
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    >
                      For Teachers
                    </a>
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    >
                      For Schools
                    </a>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("mobileCourses")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                >
                  <span>Courses</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${activeDropdown === "mobileCourses" ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === "mobileCourses" && (
                  <div className="pl-4 py-2 space-y-1">
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    >
                      Mathematics
                    </a>
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    >
                      Science
                    </a>
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    >
                      Language Arts
                    </a>
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    >
                      History
                    </a>
                  </div>
                )}
              </div>

              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                Testimonials
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                Pricing
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                Contact
              </a>

              <div className="pt-4 pb-3 border-t border-gray-200">
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Log In
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 text-center mt-2"
                >
                  Sign Up Free
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar 