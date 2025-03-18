"use client"

import { motion } from "framer-motion"
import { Users, Star, Play } from "lucide-react"
import { useNavigate } from "react-router-dom"

const GameCard = ({ title, category, level, image, players, rating, delay = 0 }) => {
  const navigate = useNavigate()
  
  const handlePlayGame = () => {
    navigate('/role-selection')
  }

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
      <div className="relative overflow-hidden group">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />

        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[level]}`}>{level}</span>
        </div>

        <div className="absolute inset-0 bg-indigo-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={handlePlayGame}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white h-14 w-14 rounded-full flex items-center justify-center"
          >
            <Play size={24} className="text-indigo-600 ml-1" />
          </motion.button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">{category}</span>
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-1" />
            <span>{players.toLocaleString()} players</span>
          </div>
          <div className="flex items-center">
            <Star size={16} className="text-yellow-400 mr-1" />
            <span className="font-medium">{rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GameCard 