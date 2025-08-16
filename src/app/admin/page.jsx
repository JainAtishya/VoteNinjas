'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Vote, 
  TrendingUp, 
  Activity, 
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Download,
  Eye,
  Crown,
  Weight,
  Globe,
  FileText,
  Target,
  Zap,
  ChevronRight,
  Home
} from 'lucide-react';
import Link from 'next/link';

const StatCard = ({ title, value, icon: Icon, color, change, trend, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className={`bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border-l-4 ${color} ${
      onClick ? 'cursor-pointer hover:shadow-xl' : ''
    } transition-all`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {change && (
          <div className={`flex items-center gap-1 text-xs md:text-sm mt-1 ${
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
          }`}>
            <TrendingUp className="w-3 h-3" />
            <span>{change}</span>
          </div>
        )}
      </div>
      <Icon className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
    </div>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, href, color, onClick }) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 ${color}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('-500', '-100')} dark:${color.replace('border-', 'bg-').replace('-500', '-900/20')}`}>
          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color.replace('border-', 'text-')}`} />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

const AdminFeatureCard = ({ title, description, icon: Icon, features, color, href }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('-500', '-100')} dark:${color.replace('border-', 'bg-').replace('-500', '-900/20')}`}>
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
        <ul className="space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
    {href && (
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
      >
        Access Feature
        <TrendingUp className="w-4 h-4" />
      </Link>
    )}
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalVotes: 0,
    activeEvents: 0,
    adminUsers: 0,
    publishedResults: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voteWeights, setVoteWeights] = useState({ defaultAdminWeight: 5, defaultUserWeight: 1 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const [usersRes, eventsRes, weightsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/events'),
          fetch('/api/admin/vote-weights')
        ]);

        if (usersRes.ok && eventsRes.ok) {
          const users = await usersRes.json();
          const events = await eventsRes.json();
          
          const totalVotes = events.reduce((sum, event) => 
            sum + (event.candidates?.reduce((eventSum, candidate) => 
              eventSum + (candidate.votes || 0), 0
            ) || 0), 0
          );
          
          setStats({
            totalUsers: users.length,
            totalEvents: events.length,
            totalVotes,
            activeEvents: events.filter(e => e.votingOpen).length,
            adminUsers: users.filter(u => u.role === 'admin').length,
            publishedResults: events.filter(e => e.resultsPublished).length
          });
          
          setRecentEvents(events.slice(0, 5));
        }

        if (weightsRes.ok) {
          const weights = await weightsRes.json();
          setVoteWeights(weights);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: "Create Event",
      description: "Start a new voting event",
      icon: Plus,
      href: "/admin/events/create",
      color: "border-green-500"
    },
    {
      title: "Manage Users",
      description: "Grant admin roles & manage users",
      icon: Users,
      href: "/admin/users",
      color: "border-blue-500"
    },
    {
      title: "Live Leaderboard",
      description: "View real-time weighted results",
      icon: BarChart3,
      href: "/admin/leaderboard",
      color: "border-purple-500"
    },
    {
      title: "Vote Weights",
      description: "Configure admin vote multipliers",
      icon: Weight,
      href: "/admin/vote-weights",
      color: "border-orange-500"
    },
    {
      title: "Export Results",
      description: "Download CSV reports",
      icon: Download,
      href: "/admin/exports",
      color: "border-indigo-500"
    },
    {
      title: "System Settings",
      description: "Platform configuration",
      icon: Settings,
      href: "/admin/settings",
      color: "border-red-500"
    }
  ];

  const adminFeatures = [
    {
      title: "Event Management",
      description: "Complete control over voting events with scheduling and configuration",
      icon: Calendar,
      color: "border-green-500",
      href: "/admin/events",
      features: [
        "Create, edit, and delete events",
        "Set voting start and end times",
        "Configure eligible voters",
        "Manage event visibility"
      ]
    },
    {
      title: "Team & Candidate Management",
      description: "Organize candidates and teams within events",
      icon: Target,
      color: "border-blue-500", 
      href: "/admin/candidates",
      features: [
        "Add teams to events",
        "Manage candidate profiles",
        "Upload team images",
        "Set team descriptions"
      ]
    },
    {
      title: "Advanced User Control",
      description: "User management with role-based permissions",
      icon: Shield,
      color: "border-purple-500",
      href: "/admin/users",
      features: [
        "Grant and revoke admin roles",
        "View user activity",
        "Manage user permissions",
        "Monitor login history"
      ]
    },
    {
      title: "Weighted Voting System",
      description: "Configurable vote weights for different user roles",
      icon: Weight,
      color: "border-orange-500",
      href: "/admin/vote-weights",
      features: [
        `Admin votes worth ${voteWeights.defaultAdminWeight || 5}x regular votes`,
        "Event-specific weight configuration",
        "Global weight settings",
        "Real-time weight adjustments"
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-purple-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Breadcrumb Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
      >
        <Link 
          href="/landing" 
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link 
          href="/events" 
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Events
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-purple-600 dark:text-purple-400 font-medium">Admin Panel</span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-600" />
            Admin Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Complete control over your voting platform with advanced features
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Admin Weight: {voteWeights.defaultAdminWeight || 5}x
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="border-blue-500"
          change="+12% this month"
          trend="up"
          onClick={() => window.location.href = '/admin/users'}
        />
        <StatCard
          title="Admin Users"
          value={stats.adminUsers}
          icon={Crown}
          color="border-purple-500"
          change={`${((stats.adminUsers / stats.totalUsers) * 100).toFixed(1)}% of users`}
        />
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="border-green-500"
          change="+5% this week"
          trend="up"
          onClick={() => window.location.href = '/admin/events'}
        />
        <StatCard
          title="Active Events"
          value={stats.activeEvents}
          icon={Activity}
          color="border-orange-500"
          onClick={() => window.location.href = '/admin/events?filter=active'}
        />
        <StatCard
          title="Total Votes"
          value={stats.totalVotes.toLocaleString()}
          icon={Vote}
          color="border-indigo-500"
          change="+23% today"
          trend="up"
        />
        <StatCard
          title="Published Results"
          value={stats.publishedResults}
          icon={Eye}
          color="border-teal-500"
          onClick={() => window.location.href = '/admin/results'}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <QuickActionCard {...action} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Admin Features Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-600" />
          Admin Features Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {adminFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <AdminFeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            Recent Events
          </h2>
          <Link
            href="/admin/events"
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline self-start md:self-auto"
          >
            View All Events
          </Link>
        </div>

        {recentEvents.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {recentEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <div className={`w-3 h-3 rounded-full ${
                    event.votingOpen ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                      {event.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {event.candidates?.length || 0} candidates • {
                        event.candidates?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0
                      } votes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    event.votingOpen
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  }`}>
                    {event.votingOpen ? 'Active' : 'Closed'}
                  </span>
                  <Link
                    href={`/admin/events/${event._id}/manage`}
                    className="text-xs md:text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Manage
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">No events created yet</p>
            <Link
              href="/admin/events/create"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Event
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
