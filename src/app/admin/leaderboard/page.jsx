'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Trophy, 
  Users, 
  Vote, 
  RefreshCw, 
  Crown,
  Zap,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  Medal,
  Award,
  Clock
} from 'lucide-react';

const EventSelector = ({ events, selectedEventId, onSelect }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Select Event for Live Leaderboard
    </label>
    <select
      value={selectedEventId}
      onChange={(e) => onSelect(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    >
      <option value="">Select an event...</option>
      {events.map((event) => (
        <option key={event._id} value={event._id}>
          {event.name} {event.votingOpen ? '(Active)' : '(Closed)'}
        </option>
      ))}
    </select>
  </div>
);

const LeaderboardCard = ({ candidate, position, totalWeightedVotes, adminWeight }) => {
  const percentage = totalWeightedVotes > 0 ? (candidate.totalWeightedVotes / totalWeightedVotes * 100) : 0;
  
  const getRankIcon = (pos) => {
    if (pos === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (pos === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (pos === 3) return <Award className="w-6 h-6 text-orange-500" />;
    return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-400">#{pos}</span>;
  };

  const getRankColor = (pos) => {
    if (pos === 1) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    if (pos === 2) return 'border-gray-400 bg-gray-50 dark:bg-gray-900/20';
    if (pos === 3) return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
    return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl shadow-lg border-l-4 ${getRankColor(position)} transition-all`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {getRankIcon(position)}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {candidate.candidate.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {candidate.candidate.description || 'No description available'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {candidate.totalWeightedVotes}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            weighted votes
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>{percentage.toFixed(1)}% of total votes</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-2 rounded-full ${
              position === 1 ? 'bg-yellow-500' :
              position === 2 ? 'bg-gray-400' :
              position === 3 ? 'bg-orange-500' :
              'bg-purple-500'
            }`}
          />
        </div>
      </div>

      {/* Vote Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {candidate.regularVotes} regular votes
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {candidate.adminVotes} admin votes (×{adminWeight})
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total raw votes: <span className="font-semibold">{candidate.totalVotes}</span>
        </div>
      </div>
    </motion.div>
  );
};

const StatsCard = ({ title, value, icon: Icon, color, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
  </motion.div>
);

export default function LiveLeaderboard() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchLeaderboard();
    }
  }, [selectedEventId]);

  useEffect(() => {
    let interval;
    if (autoRefresh && selectedEventId) {
      interval = setInterval(() => {
        fetchLeaderboard(true);
      }, 10000); // Refresh every 10 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, selectedEventId]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData);
        
        // Auto-select first active event
        const activeEvent = eventsData.find(e => e.votingOpen);
        if (activeEvent) {
          setSelectedEventId(activeEvent._id);
        } else if (eventsData.length > 0) {
          setSelectedEventId(eventsData[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }

    try {
      const response = await fetch(`/api/admin/leaderboard?eventId=${selectedEventId}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            Live Leaderboard
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Real-time weighted voting results with admin vote multipliers
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            Auto-refresh
          </label>
          <button
            onClick={() => fetchLeaderboard(true)}
            disabled={refreshing || !selectedEventId}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Event Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <EventSelector
          events={events}
          selectedEventId={selectedEventId}
          onSelect={setSelectedEventId}
        />
      </motion.div>

      {leaderboardData && (
        <>
          {/* Event Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {leaderboardData.event.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {leaderboardData.event.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  leaderboardData.event.votingOpen
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                }`}>
                  {leaderboardData.event.votingOpen ? 'Voting Active' : 'Voting Closed'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Admin Weight: {leaderboardData.event.defaultVoteWeight}x
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatsCard
              title="Total Candidates"
              value={leaderboardData.candidates.length}
              icon={Target}
              color="border-blue-500"
            />
            <StatsCard
              title="Total Voters"
              value={leaderboardData.totalVoters}
              icon={Users}
              color="border-green-500"
            />
            <StatsCard
              title="Weighted Votes"
              value={leaderboardData.totalWeightedVotes}
              icon={Zap}
              color="border-purple-500"
              description="Including admin multipliers"
            />
            <StatsCard
              title="Last Updated"
              value={new Date(leaderboardData.lastUpdated).toLocaleTimeString()}
              icon={Clock}
              color="border-orange-500"
            />
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              Current Rankings
            </h2>
            
            {leaderboardData.candidates.length > 0 ? (
              <div className="space-y-4">
                {leaderboardData.candidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.candidate._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <LeaderboardCard
                      candidate={candidate}
                      position={index + 1}
                      totalWeightedVotes={leaderboardData.totalWeightedVotes}
                      adminWeight={leaderboardData.event.defaultVoteWeight}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Candidates Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add candidates to this event to see the leaderboard
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
