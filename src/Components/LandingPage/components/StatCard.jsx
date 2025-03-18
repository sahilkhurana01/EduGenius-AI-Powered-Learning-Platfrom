"use client"

import { motion, useAnimation } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"

const StatCard = ({ value, label, icon, delay = 0 }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  // Extract the number from values like "98%" or "250+"
  const parseValue = () => {
    const numValue = parseInt(value.replace(/\D/g, ''))
    return numValue || 0
  }
  
  const numericValue = parseValue()
  const suffix = value.replace(/[0-9]/g, '') // Get any suffix like '%' or '+'
  
  useEffect(() => {
    if (isInView) {
      let startValue = 0
      const duration = 2000 // 2 seconds
      const increment = numericValue / (duration / 16) // 16ms is approx one frame
      
      const timer = setInterval(() => {
        startValue += increment
        if (startValue >= numericValue) {
          setCount(numericValue)
          clearInterval(timer)
        } else {
          setCount(Math.floor(startValue))
        }
      }, 16)
      
      return () => clearInterval(timer)
    }
  }, [isInView, numericValue])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 ease-in-out"
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
        {isInView ? `${count}${suffix}` : "0"}
      </motion.h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  )
}

export default StatCard 