'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-black px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8 max-w-2xl mx-auto"
          >
            {/* Error Icon */}
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
              className="mx-auto w-24 h-24 flex items-center justify-center bg-red-100 dark:bg-red-900/20 rounded-full"
            >
              <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </motion.div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                Something went wrong!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                We&apos;re sorry, but something unexpected happened. Our team has been notified and is working on a fix.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-sm text-red-600 dark:text-red-400 overflow-auto">
                    {error.message}
                    {error.digest && `\nDigest: ${error.digest}`}
                  </pre>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={reset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </motion.button>
              
              <Link href="/landing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </motion.button>
              </Link>
            </div>

            {/* Contact Support */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If this problem persists, please{' '}
              <a 
                href="mailto:support@votingapp.com"
                className="text-red-600 dark:text-red-400 underline hover:no-underline"
              >
                contact support
              </a>
            </p>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
