// src/app/admin/layout.jsx
'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Users, Menu, X, Shield, Home, Vote, Trophy, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading admin panel...
          </span>
        </motion.div>
      </div>
    );
  }

  // If user is not authenticated or is not an admin, redirect them
  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    redirect('/events');
  }

  const adminSidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  const publicSidebarItems = [
    { name: 'Home', href: '/landing', icon: Home },
    { name: 'Events', href: '/events', icon: Vote },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  ];

  // If they are an admin, render the layout
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => {
                console.log('Hamburger clicked! Current state:', sidebarOpen); // Debug log
                setSidebarOpen(true);
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              console.log('Overlay clicked!'); // Debug log
              setSidebarOpen(false);
            }}
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: (sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : -300 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl lg:shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
          {/* Desktop Header */}
          <div className="hidden lg:block p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Voting System</p>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Voting System</p>
                </div>
              </div>
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Cross button clicked!'); // Debug log
                  setSidebarOpen(false);
                }}
                className="p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-gray-200 dark:border-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ zIndex: 1000 }}
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Public Navigation */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Public Pages
              </h3>
              <ul className="space-y-1">
                {publicSidebarItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      onClick={() => {
                        console.log('Link clicked:', item.name); // Debug log
                        setSidebarOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-gray-200 dark:border-gray-700"></div>

            {/* Admin Navigation */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Admin Functions
              </h3>
              <ul className="space-y-1">
                {adminSidebarItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      onClick={() => {
                        console.log('Admin link clicked:', item.name); // Debug log
                        setSidebarOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Info */}
            <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-0 min-w-0 transition-all duration-300 ease-in-out">
        {/* Mobile spacing for fixed header */}
        <div className="lg:hidden h-16"></div>
        
        <div className="p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
