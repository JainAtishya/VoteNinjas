'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Calendar, 
  Vote, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  TrendingUp,
  ChevronRight,
  Eye,
  History,
  Home,
  Settings,
  Bell,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [votingHistory, setVotingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        setLoading(false);
        return;
      }

      try {
        // Fetch events
        const eventsRes = await fetch('/api/events');
        const eventsData = await eventsRes.json();
        
        // Fetch user's voting history
        const historyRes = await fetch('/api/user/voting-history');
        const historyData = historyRes.ok ? await historyRes.json() : [];
        
        setEvents(eventsData || []);
        setVotingHistory(historyData || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading your dashboard...
          </span>
        </motion.div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your dashboard
          </h1>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => event.votingOpen);
  const pastEvents = events.filter(event => !event.votingOpen);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
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
        <span className="text-blue-600 dark:text-blue-400 font-medium">Dashboard</span>
      </motion.div>

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {session.user.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to participate in voting? Check out the latest events below.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Active Events</span>
            </div>
            <p className="text-2xl font-bold mt-1">{upcomingEvents.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5" />
              <span className="text-sm font-medium">Votes Cast</span>
            </div>
            <p className="text-2xl font-bold mt-1">{votingHistory.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Events Joined</span>
            </div>
            <p className="text-2xl font-bold mt-1">{pastEvents.length + upcomingEvents.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Participation</span>
            </div>
            <p className="text-2xl font-bold mt-1">{session.user.role === 'admin' ? '100%' : '85%'}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Link
          href="/events"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Browse Events</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Explore all available events and participate in voting
          </p>
        </Link>

        <Link
          href="/leaderboard"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30 transition-colors">
              <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">View Leaderboard</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Check live results and rankings for all events
          </p>
        </Link>

        <Link
          href="/results"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">View Results</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            See final results and published outcomes
          </p>
        </Link>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-orange-500" />
            Upcoming Events
          </h2>
          <Link
            href="/events"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No upcoming events
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new voting events!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.slice(0, 4).map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {event.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.votingOpen 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {event.votingOpen ? 'Open' : 'Closed'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.candidates?.length || 0} teams
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.votingOpen ? 'Voting now' : 'Voting closed'}
                    </span>
                  </div>

                  {event.votingOpen && (
                    <Link
                      href={`/events/${event._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Vote Now
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Voting History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <History className="w-6 h-6 text-gray-600" />
          Voting History
        </h2>

        {votingHistory.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No voting history yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start participating in events to see your voting history here!
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="max-h-96 overflow-y-auto">
              {votingHistory.map((vote, index) => (
                <div 
                  key={index} 
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {vote.eventName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Voted for: {vote.candidateName}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Voted</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(vote.votedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}