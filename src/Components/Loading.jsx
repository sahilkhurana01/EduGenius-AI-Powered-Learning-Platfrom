import { motion } from 'framer-motion'
import React, { useEffect } from 'react'

function Loading() {
  const text = ["The", "Hyper-Local", "AI-Driven", "Learning", "Universe"];

  const containerVariants = {
    initial: {
      opacity: 0,
      scale: 1.1
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 1.5,
      transition: {
        duration: 0.3,
        ease: [0.25, 1, 0.5, 1],
        when: "beforeChildren"
      }
    }
  };

  const wordVariants = {
    initial: {
      y: 40,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)"
    },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: [0.76, 0, 0.24, 1]
      }
    }),
    exit: (i) => ({
      scale: 1.2,
      filter: "blur(15px)",
      transition: {
        duration: 0.15,
        delay: i * 0.01,
        ease: [0.25, 1, 0.5, 1]
      }
    })
  };

  return (
    <motion.div 
      className='fixed top-0 left-0 w-full h-screen bg-black z-[999] flex items-center justify-center overflow-hidden'
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className='px-10 max-w-7xl'>
        <div className='flex flex-wrap items-center justify-center gap-x-5 gap-y-2'>
          {text.map((word, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={wordVariants}
              className='text-[4vw] md:text-[3vw] font-bold text-white tracking-tighter'
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Loading 