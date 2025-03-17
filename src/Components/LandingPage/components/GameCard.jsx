"use client"

import { motion } from "framer-motion"
import { Users, Star } from "lucide-react"

const GameCard = ({ title, category, level, image, players, rating, delay = 0 }) => {
  const levelColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
    >
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[level]}`}>{level}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="text-sm font-medium text-indigo-600 mb-1">{category}</div>
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

        <button className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-lg font-medium transition-colors">
          Play Now
        </button>
      </div>
    </motion.div>
  )
}

export default GameCard 