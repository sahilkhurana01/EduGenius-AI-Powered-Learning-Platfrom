"use client"

import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, Award, Zap } from "lucide-react"

const HeroSection = () => {
  const navigate = useNavigate()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const handleStartLearning = () => {
    navigate('/role-selection')
  }

  const handleExploreFeatures = () => {
    // Scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={ref} className="pt-32 pb-20 px-4 md:px-8 relative overflow-hidden min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>

      {/* Animated Shapes */}
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
        style={{ y }}
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
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
      />

      <motion.div
        className="absolute top-40 left-1/3 w-48 h-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 150]) }}
      />

      <div className="max-w-7xl mx-auto relative z-10" style={{ opacity }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left"
          >
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
              <Sparkles className="text-yellow-500 mr-2" size={16} />
              <span className="text-sm font-medium text-gray-800">The Future of Education is Here</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="block mb-2">THE HYPER-LOCAL</span>
              <div className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-yellow-400 to-amber-500 px-2 py-1 mb-2">
                  AI DRIVEN
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 blur opacity-30"></div>
              </div>
              <span className="block mt-2">LEARNING UNIVERSE</span>
            </h1>

            <p className="text-lg text-gray-700 mb-8 max-w-xl">
              Transform your educational journey with our AI-powered platform that adapts to your learning style and
              makes education fun through gamification.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 mb-12">
              <div className="flex items-center text-gray-600 mb-2 sm:mb-0 sm:mr-8">
                <Award className="text-indigo-600 mr-2" size={20} />
                <span>For every students and teachers</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Zap className="text-yellow-500 mr-2" size={20} />
                <span>For the smarter tomorrow</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={handleStartLearning}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full inline-flex items-center transition-all shadow-lg duration-300 ease-in-out"
              >
                Start Learning
                <ArrowRight className="ml-2" size={18} />
              </motion.button>
              <motion.button
                onClick={handleStartLearning}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white hover:bg-gray-100 border-2 border-indigo-600 text-indigo-600 font-medium py-3 px-8 rounded-full transition-all duration-300 ease-in-out"
              >
                Explore Features
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30"></div>
                <img
                  src="/kid.jpg"
                  alt="Teenagers learning with EduGenius AI platform"
                  className="relative rounded-2xl shadow-xl object-cover h-[380px] w-[600px]"
                />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-400 rounded-full opacity-30"></div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute top-10 -left-5 z-20 bg-white p-3 rounded-lg shadow-lg flex items-center"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-2">
                  A+
                </div>
              </motion.div>
              <span className="font-medium">Top Grades</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute bottom-10 right-110 z-20 bg-white p-3 rounded-lg shadow-lg flex items-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-2">
                  🏆
                </div>
              </motion.div>
              <span className="font-medium">Level Up!</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 z-20 bg-white p-3 rounded-lg shadow-lg flex items-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-2">
                  🚀
                </div>
              </motion.div>
              <span className="font-medium">Progress!</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}

export default HeroSection 