"use client"

import { motion } from "framer-motion"

const StatCard = ({ value, label, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all"
    >
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">{icon}</div>
      </div>
      <motion.h3
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="text-3xl font-bold mb-1"
      >
        {value}
      </motion.h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  )
}

export default StatCard 