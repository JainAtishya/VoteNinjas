'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8"
      >
        {/* 404 Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text"
        >
          404
        </motion.div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/landing">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </Link>
          
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </motion.button>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full opacity-50"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full opacity-50"
        />
      </motion.div>
    </div>
  );
}
