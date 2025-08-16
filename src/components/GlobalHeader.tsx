'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ModeToggle } from './theme-toggle';
import { User, LogIn, Settings, Trophy, LogOut, ChevronDown, LayoutDashboard, Home, Calendar, Award, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalHeader() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Home', link: '/landing', icon: <Home className="h-4 w-4" /> },
    { name: 'Events', link: '/events', icon: <Calendar className="h-4 w-4" /> },
    { name: 'Leaderboard', link: '/leaderboard', icon: <Trophy className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Fixed Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/landing" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                VoteNinjas
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* User Section */}
              {status === 'loading' ? (
                <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
              ) : status === 'authenticated' ? (
                <div className="hidden md:flex items-center gap-4">
                  {/* User Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <motion.button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-800/30 dark:hover:to-blue-800/30 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        {session.user.name}
                      </span>
                      <ChevronDown className={`h-3 w-3 text-purple-600 dark:text-purple-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                        >
                          <Link
                            href="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>

                          {session.user.role === 'admin' && (
                            <Link
                              href="/admin"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Settings className="h-4 w-4" />
                              Admin Panel
                            </Link>
                          )}

                          <hr className="my-2 border-gray-200 dark:border-gray-600" />

                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              signOut();
                            }}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  <button
                    onClick={() => signIn()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </button>
                </div>
              )}

              {/* Theme Toggle */}
              <div className="hidden md:block">
                <ModeToggle />
              </div>

              {/* Mobile Hamburger Button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-16 right-0 bottom-0 z-50 w-80 bg-white dark:bg-gray-900 shadow-2xl"
          >
            <div className="p-6 space-y-6">
              {/* Navigation Items */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Navigation
                </h3>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* User Section */}
              {status === 'authenticated' ? (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                    Account
                  </h3>
                  
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  {/* Account Links */}
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    {session.user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signIn();
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </button>
                </div>
              )}

              {/* Theme Toggle */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </span>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}