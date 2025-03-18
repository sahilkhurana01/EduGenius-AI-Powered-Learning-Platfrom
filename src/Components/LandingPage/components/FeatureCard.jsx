"use client"

import { motion } from "framer-motion"

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border border-gray-100 group"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-indigo-600 mb-5 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 ease-in-out">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

export default FeatureCard 