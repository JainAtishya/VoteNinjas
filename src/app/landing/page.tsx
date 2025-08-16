"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Trophy, 
  Vote, 
  Users, 
  Award,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Star,
  Play
} from "lucide-react";
import { useSession } from 'next-auth/react';

// Modern Responsive Navigation Component
const ResponsiveNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navLinks = [
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Results', href: '/results', icon: Award },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              VoteNinjas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            
            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                    Dashboard
                  </button>
                </Link>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <Link href="/auth/signin">
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {session ? (
                  <div className="space-y-3">
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium">
                        Dashboard
                      </button>
                    </Link>
                    <div className="flex items-center gap-3 px-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {session.user.name?.charAt(0).toUpperCase()}
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
                  </div>
                ) : (
                  <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium">
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function LandingPage() {
  const { data: session } = useSession();
  
  const features = [
    {
      icon: Vote,
      title: "Democratic Voting",
      description: "Every member&apos;s voice matters. Cast your vote and shape the future of our club."
    },
    {
      icon: Trophy,
      title: "Celebrate Excellence",
      description: "Recognize outstanding projects and reward innovation within our coding community."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by coders, for coders. Experience the power of collaborative decision-making."
    },
    {
      icon: Award,
      title: "Skill Recognition",
      description: "Showcase your coding skills and get recognized for your technical achievements."
    }
  ];

  const stats = [
    { number: "150+", label: "Club Members" },
    { number: "12+", label: "Competitions" },
    { number: "45+", label: "Projects Showcased" },
    { number: "100%", label: "Club Spirit" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <ResponsiveNavbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white">
                Empower 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}Innovation
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The official voting platform for Coding Ninja club competitions and hackathons. 
                Discover brilliant projects, support your favorite teams, and celebrate coding excellence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto"
            >
              {session ? (
                // Authenticated user buttons
                <>
                  <Link href="/dashboard" className="w-full sm:w-auto group">
                    <motion.button 
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-500 flex items-center justify-center gap-2 relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={false}
                      />
                      <Users className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Go to Dashboard</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                  </Link>
                  
                  <Link href="/events" className="w-full sm:w-auto">
                    <motion.button 
                      className="w-full sm:w-auto px-8 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-xl font-semibold text-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calendar className="w-5 h-5" />
                      Browse Events
                    </motion.button>
                  </Link>
                </>
              ) : (
                // Non-authenticated user buttons
                <>
                  <Link href="/events" className="w-full sm:w-auto">
                    <motion.button 
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Calendar className="w-5 h-5" />
                      Explore Events
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  
                  <Link href="/auth/signin" className="w-full sm:w-auto">
                    <motion.button 
                      className="w-full sm:w-auto px-8 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-xl font-semibold text-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Vote className="w-5 h-5" />
                      Sign In to Vote
                    </motion.button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Meet Our Team Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              The brilliant minds behind Coding Ninja club's innovative projects
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
              <Image
                src="https://media.licdn.com/dms/image/v2/D4E22AQF0tugdwQ_hyQ/feedshare-shrink_2048_1536/B4EZWuK_AyGYBA-/0/1742383872980?e=1756339200&v=beta&t=0piJPz37wOstpYYf4MHrLJ613_uJkdqGsxt0VKy6yeg"
                alt="Event Management Dashboard"
                width={1200}
                height={600}
                className="w-full h-auto"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Join Coding Ninja Club?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover what makes our coding community special and how you can be part of our journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Become part of Coding Ninja club and help shape the future of our coding community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                // Authenticated users
                <>
                  <Link href="/dashboard">
                    <motion.button 
                      className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-500 flex items-center justify-center gap-2 group"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Users className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      Open Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                  </Link>
                  <Link href="/events">
                    <motion.button 
                      className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Vote className="w-5 h-5" />
                      Vote in Events
                    </motion.button>
                  </Link>
                </>
              ) : (
                // Non-authenticated users
                <>
                  <Link href="/events">
                    <motion.button 
                      className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      Start Voting Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                  </Link>
                  <Link href="/auth/signup">
                    <motion.button 
                      className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Create Account
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
