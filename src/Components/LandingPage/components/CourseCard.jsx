"use client"

import { motion } from "framer-motion"
import { Clock, Users, Star } from "lucide-react"

const CourseCard = ({ title, instructor, level, duration, image, rating, students, delay = 0 }) => {
  const levelColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" }, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
    >
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[level]}`}>{level}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">by {instructor}</p>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <Star size={16} className="text-yellow-400 mr-1" />
            <span className="font-medium">{rating}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Users size={16} className="mr-1" />
          <span>{students.toLocaleString()} students enrolled</span>
        </div>

        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-lg font-medium transition-all duration-300 ease-in-out">
          Enroll Now
        </button>
      </div>
    </motion.div>
  )
}

export default CourseCard 