'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-black">
      <div className="text-center space-y-8">
        {/* Loading Animation */}
        <motion.div
          className="relative w-32 h-32 mx-auto"
        >
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 border-4 border-purple-200 dark:border-purple-800 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Ring */}
          <motion.div
            className="absolute inset-2 border-4 border-transparent border-t-purple-600 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center Dot */}
          <motion.div
            className="absolute inset-1/2 w-4 h-4 -ml-2 -mt-2 bg-purple-600 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Loading...
          </h2>
          <motion.div
            className="flex justify-center space-x-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-600 rounded-full"
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [1, 0.5, 1]
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="w-64 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mx-auto"
          initial={{ width: 0 }}
          animate={{ width: 256 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
