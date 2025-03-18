import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  Trophy,
  Rocket,
  ArrowRight,
  Users,
  BarChart3,
  Gamepad2,
  Brain,
  Sparkles,
  Zap,
  Award,
  Star,
  Lightbulb,
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import "./landing-page.css"
import Navbar from "./components/Navbar"
import FeatureCard from "./components/FeatureCard"
import TestimonialCard from "./components/TestimonialCard"
import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import StatCard from "./components/StatCard"
import GameCard from "./components/GameCard"
import CourseCard from "./components/CourseCard"

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all")
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  const features = [
    {
      icon: <Gamepad2 size={24} />,
      title: "Gamified Learning",
      description: "Learn through interactive games, quests, and challenges that make education fun and engaging.",
      category: "students",
    },
    {
      icon: <Trophy size={24} />,
      title: "Achievement System",
      description: "Earn badges, points, and rewards as you complete courses and master new skills.",
      category: "students",
    },
    {
      icon: <Brain size={24} />,
      title: "AI-Powered Paths",
      description: "Personalized learning paths tailored to your unique learning style and goals.",
      category: "students",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Advanced Analytics",
      description: "Detailed insights into student performance with actionable recommendations.",
      category: "teachers",
    },
    {
      icon: <Users size={24} />,
      title: "Collaborative Learning",
      description: "Connect with peers for group projects, discussions, and friendly competitions.",
      category: "students",
    },
    {
      icon: <BookOpen size={24} />,
      title: "Resource Management",
      description: "Easily upload, organize, and share learning materials with your students.",
      category: "teachers",
    },
  ]

  const stats = [
    { value: "98%", label: "Student Satisfaction", icon: <Star className="text-yellow-400" /> },
    { value: "87%", label: "Improved Grades", icon: <Award className="text-indigo-500" /> },
    { value: "250+", label: "Interactive Lessons", icon: <Zap className="text-purple-500" /> },
    { value: "45min", label: "Daily Avg. Engagement", icon: <Lightbulb className="text-amber-500" /> },
  ]

  const games = [
    {
      title: "Math Quest",
      category: "Mathematics",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=800&h=500&auto=format&fit=crop",
      players: 2345,
      rating: 4.8,
    },
    {
      title: "Science Explorer",
      category: "Science",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&h=500&auto=format&fit=crop",
      players: 1987,
      rating: 4.7,
    },
    {
      title: "History Adventure",
      category: "History",
      level: "Advanced",
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&h=500&auto=format&fit=crop",
      players: 1456,
      rating: 4.9,
    },
  ]

  const courses = [
    {
      title: "Introduction to Algebra",
      instructor: "Prof. Sarah Johnson",
      level: "Beginner",
      duration: "8 weeks",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&h=500&auto=format&fit=crop",
      rating: 4.8,
      students: 1245,
    },
    {
      title: "Advanced Physics",
      instructor: "Dr. Michael Chen",
      level: "Advanced",
      duration: "12 weeks",
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=800&h=500&auto=format&fit=crop",
      rating: 4.9,
      students: 876,
    },
    {
      title: "Creative Writing",
      instructor: "Emma Williams",
      level: "Intermediate",
      duration: "6 weeks",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&h=500&auto=format&fit=crop",
      rating: 4.7,
      students: 1532,
    },
  ]

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "High School Student",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&h=150&auto=format&fit=crop&crop=faces",
      content:
        "EduGenius transformed how I study. The gamification makes learning actually fun, and I've improved my grades significantly!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "College Freshman",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&auto=format&fit=crop&crop=faces",
      content:
        "The personalized learning paths helped me catch up on subjects I was struggling with. The achievement system keeps me motivated!",
      rating: 5,
    },
    {
      name: "Marcus Chen",
      role: "Middle School Student",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop&crop=faces",
      content: "I love competing with my friends on the leaderboards. Learning has never been this exciting before!",
      rating: 4,
    },
  ]

  const filteredFeatures = activeTab === "all" ? features : features.filter((feature) => feature.category === activeTab)

  const handleGetStarted = () => {
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <Navbar />

      <main>
        <HeroSection />

        {/* Stats Section */}
        <section ref={statsRef} className="py-16 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-70"></div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto relative z-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, index) => (
                <StatCard key={index} value={stat.value} label={stat.label} icon={stat.icon} delay={index * 0.1} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-3">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge Your Learning Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              EduGenius combines cutting-edge AI with gamification to create a learning experience that's both effective
              and enjoyable.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Features
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "students" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                For Students
              </button>
              <button
                onClick={() => setActiveTab("teachers")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "teachers" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                For Teachers
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </section>

        {/* Popular Games Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-indigo-50 to-purple-50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium text-sm mb-3">
                Learn Through Play
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Learning Games</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Dive into our interactive educational games designed to make learning fun and effective
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {games.map((game, index) => (
                <GameCard
                  key={index}
                  title={game.title}
                  category={game.category}
                  level={game.level}
                  image={game.image}
                  players={game.players}
                  rating={game.rating}
                  delay={index * 0.1}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={handleGetStarted}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full inline-flex items-center transition-all duration-300 ease-in-out"
              >
                Explore All Games
                <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium text-sm mb-3">
                Simple Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How EduGenius Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform makes learning an adventure with these simple steps
              </p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 transform -translate-y-1/2 z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-md text-center relative"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
                  <p className="text-gray-600">
                    Set up your learning profile and tell us about your interests and goals.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-md text-center relative"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Explore Quests</h3>
                  <p className="text-gray-600">
                    Discover learning quests and challenges tailored to your educational needs.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-md text-center relative"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Level Up</h3>
                  <p className="text-gray-600">
                    Complete challenges, earn rewards, and watch your knowledge and skills grow.
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full inline-flex items-center transition-all shadow-lg"
              >
                Start Your Learning Adventure
                <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Featured Courses */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-3">
                Top Rated
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our most popular courses taught by expert instructors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <CourseCard
                  key={index}
                  title={course.title}
                  instructor={course.instructor}
                  level={course.level}
                  duration={course.duration}
                  image={course.image}
                  rating={course.rating}
                  students={course.students}
                  delay={index * 0.1}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full inline-flex items-center transition-all shadow-lg duration-300 ease-in-out"
              >
                Browse All Courses
                <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-indigo-50 to-purple-50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-3">
                Success Stories
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from students who have transformed their learning experience with EduGenius
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  name={testimonial.name}
                  role={testimonial.role}
                  image={testimonial.image}
                  content={testimonial.content}
                  rating={testimonial.rating}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <Sparkles className="text-yellow-400 mr-2" size={24} />
              <span className="text-yellow-400 font-semibold">Limited Time Offer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
              Join thousands of students who are already experiencing the future of education with EduGenius.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-indigo-900 font-bold py-4 px-10 rounded-full inline-flex items-center justify-center transition-all shadow-lg"
              >
                Get Started for Free
                <Rocket className="ml-2" size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent hover:bg-indigo-800 border-2 border-white text-white font-bold py-4 px-10 rounded-full inline-flex items-center justify-center transition-all"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage; 