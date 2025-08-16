'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Award, 
  Trophy, 
  CircleDot, 
  Crown, 
  Medal,
  Users,
  Calendar,
  Home,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Filter,
  Zap,
  Eye
} from 'lucide-react';

interface Team {
  _id: string;
  name: string;
  description?: string;
  votes: number;
  members?: Array<{ name: string }>;
}

interface EventData {
  _id: string;
  name: string;
  description: string;
  votingOpen: boolean;
  startDate?: string;
  endDate?: string;
  candidates: Team[];
}

interface LeaderboardData {
  _id: string;
  candidateName: string;
  candidateId: string;
  eventName?: string;
  eventId?: string;
  votes: number;
  description?: string;
}

// Enhanced Team Ranking Component
const TeamRankingCard = ({ team, rank, maxVotes }: { team: Team; rank: number; maxVotes: number }) => {
  const votePercentage = maxVotes > 0 ? (team.votes / maxVotes) * 100 : 0;
  
  const getRankIcon = () => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Trophy className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRankColors = () => {
    switch (rank) {
      case 1:
        return 'border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-800';
      case 2:
        return 'border-l-gray-400 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/10 dark:to-gray-800';
      case 3:
        return 'border-l-amber-500 bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-800';
      default:
        return 'border-l-blue-500 bg-white dark:bg-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${getRankColors()} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {getRankIcon()}
          <span className="font-bold text-lg w-8 text-center">#{rank}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {team.name}
          </h4>
          {team.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {team.description}
            </p>
          )}
          {team.members && team.members.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Users className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">
                {team.members.length} members
              </span>
            </div>
          )}
          
          {/* Vote Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${votePercentage}%` }}
                transition={{ duration: 0.8, delay: rank * 0.1 }}
                className={`h-1.5 rounded-full ${
                  rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                  rank === 3 ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                  'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-right ml-4">
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {team.votes}
        </div>
        <div className="text-xs text-gray-500">votes</div>
      </div>
    </motion.div>
  );
};

// Enhanced Event Card Component
const EventLeaderboardCard = ({ event }: { event: EventData }) => {
  const statusLabel = event.votingOpen ? 'Live' : 'Completed';
  const statusColor = event.votingOpen ? 'text-green-500' : 'text-red-500';
  const maxVotes = Math.max(...event.candidates.map(team => team.votes || 0));

  const getEventStatus = () => {
    if (!event.startDate) return { status: 'unknown', color: 'gray', text: 'Unknown' };
    
    const now = new Date();
    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : null;
    
    if (now < start) return { status: 'upcoming', color: 'blue', text: 'Upcoming' };
    if (end && now > end) return { status: 'ended', color: 'gray', text: 'Ended' };
    return { status: 'live', color: 'green', text: 'Live' };
  };

  const eventStatus = getEventStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        {/* Event Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {event.name}
              </h2>
              <Link
                href={`/events/${event._id}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {event.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{event.candidates.length} teams</span>
              </div>
              {event.startDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span
              className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full ${
                eventStatus.status === 'live' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                eventStatus.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {eventStatus.status === 'live' && <Zap className="w-4 h-4" />}
              <CircleDot size={12} />
              {eventStatus.text}
            </span>
            
            <Link
              href={`/leaderboard?eventId=${event._id}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
          </div>
        </div>

        {/* Team Rankings */}
        {event.candidates.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Rankings
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {event.candidates.map((team, index) => (
                <TeamRankingCard
                  key={team._id}
                  team={team}
                  rank={index + 1}
                  maxVotes={maxVotes}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No teams have been added to this event yet.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
const AllLeaderboardsPage = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
        
        if (eventId) {
          const event = data.find((e: EventData) => e._id === eventId);
          setSelectedEvent(event);
        }
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvents();
    if (eventId) {
      fetchEventLeaderboard(eventId);
    } else {
      fetchAllLeaderboards();
    }
  }, [eventId, fetchEvents]);

  const fetchEventLeaderboard = async (eventId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard/${eventId}/route`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (error) {
      console.error('Failed to fetch event leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLeaderboards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard/all/route');
      if (res.ok) {
        const data = await res.json();
        setEvents(data || []); // Set events with leaderboard data
      } else {
        // Fallback to regular events endpoint
        const res2 = await fetch('/api/events');
        if (res2.ok) {
          const eventsData = await res2.json();
          
          // Fetch candidates for each event
          const eventsWithCandidates = await Promise.all(
            eventsData.map(async (event: EventData) => {
              try {
                const candidatesRes = await fetch(`/api/events/${event._id}/candidates`);
                if (candidatesRes.ok) {
                  const candidatesData = await candidatesRes.json();
                  return {
                    ...event,
                    candidates: candidatesData.candidates || candidatesData || []
                  };
                }
              } catch (error) {
                console.error(`Failed to fetch candidates for event ${event._id}:`, error);
              }
              return { ...event, candidates: [] };
            })
          );
          
          setEvents(eventsWithCandidates);
        }
      }
    } catch (error) {
      console.error("Failed to fetch leaderboards", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (eventId) {
      await fetchEventLeaderboard(eventId);
    } else {
      await fetchAllLeaderboards();
    }
    setRefreshing(false);
  };

  const getEventStatus = (event: EventData) => {
    if (!event.startDate) return { status: 'unknown', color: 'gray', text: 'Unknown' };
    
    const now = new Date();
    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : null;
    
    if (now < start) return { status: 'upcoming', color: 'blue', text: 'Upcoming' };
    if (end && now > end) return { status: 'ended', color: 'gray', text: 'Ended' };
    return { status: 'live', color: 'green', text: 'Live' };
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    const status = getEventStatus(event);
    return status.status === filter;
  });

  if (eventId && selectedEvent) {
    // Single Event Leaderboard View
    const maxVotes = leaderboard.length > 0 ? Math.max(...leaderboard.map(item => item.votes || 0)) : 1;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400"
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
              href="/leaderboard" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              All Leaderboards
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {selectedEvent.name}
            </span>
          </motion.div>

          {/* Event Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🏆 {selectedEvent.name} Leaderboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {selectedEvent.description}
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                getEventStatus(selectedEvent).status === 'live' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {getEventStatus(selectedEvent).status === 'live' && <Zap className="w-3 h-3 inline mr-1" />}
                {getEventStatus(selectedEvent).text}
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </motion.div>

          {/* Leaderboard */}
          {loading ? (
            <div className="text-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Trophy className="w-12 h-12 text-purple-600" />
              </motion.div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Loading leaderboard...
              </p>
            </div>
          ) : leaderboard.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl"
            >
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Rankings Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Rankings will appear here once voting begins
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((item, index) => {
                const rank = index + 1;
                const votePercentage = maxVotes > 0 ? (item.votes / maxVotes) * 100 : 0;
                
                return (
                  <TeamRankingCard
                    key={item._id || item.candidateId}
                    team={{
                      _id: item.candidateId,
                      name: item.candidateName,
                      description: item.description,
                      votes: item.votes
                    }}
                    rank={rank}
                    maxVotes={maxVotes}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // All Events Leaderboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400"
        >
          <Link 
            href="/landing" 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            All Event Leaderboards
          </span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🏆 All Event Leaderboards
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            View rankings and vote counts across all events
          </p>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Events</option>
                <option value="live">Live Events</option>
                <option value="ended">Ended Events</option>
                <option value="upcoming">Upcoming Events</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Trophy className="w-12 h-12 text-purple-600" />
            </motion.div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Loading all events...
            </p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventLeaderboardCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl"
          >
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' ? 'No events have been created yet.' : `No ${filter} events found.`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllLeaderboardsPage;