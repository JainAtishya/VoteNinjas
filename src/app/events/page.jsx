'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  Search, 
  Filter,
  Eye,
  Heart,
  Star,
  ArrowRight,
  Loader,
  AlertCircle,
  CalendarDays,
  Timer,
  Award,
  RefreshCw
} from 'lucide-react';

const EventCard = ({ event, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const getEventStatus = (startDate, endDate, votingOpen = false) => {
    // If no dates are provided, use votingOpen as fallback
    if (!startDate || !endDate) {
      return votingOpen 
        ? { status: 'live', color: 'green', text: 'Live Now' }
        : { status: 'ended', color: 'gray', text: 'Ended' };
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return votingOpen 
        ? { status: 'live', color: 'green', text: 'Live Now' }
        : { status: 'ended', color: 'gray', text: 'Ended' };
    }
    
    if (now < start) return { status: 'upcoming', color: 'blue', text: 'Upcoming' };
    if (now >= start && now <= end) {
      return votingOpen 
        ? { status: 'live', color: 'green', text: 'Live Now' }
        : { status: 'ended', color: 'gray', text: 'Ended' };
    }
    return { status: 'ended', color: 'gray', text: 'Ended' };
  };

  const eventStatus = getEventStatus(event.startDate, event.endDate, event.votingOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:scale-[1.02]"
    >
      {/* Event Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
            eventStatus.status === 'live' ? 'bg-green-500' : 
            eventStatus.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
          }`}>
            {eventStatus.text}
          </span>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
            {event.name}
          </h3>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {event.description || "Join this exciting event and compete with the best teams!"}
        </p>

        {/* Event Meta */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CalendarDays className="w-4 h-4 text-purple-500" />
            <span>{new Date(event.startDate).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Timer className="w-4 h-4 text-blue-500" />
            <span>
              {new Date(event.startDate).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 text-green-500" />
            <span>{event.teams?.length || 0} teams participating</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href={`/events/${event._id}`} className="flex-1">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group">
              <Eye className="w-4 h-4" />
              View Details
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
          
          {eventStatus.status === 'live' && (
            <Link href={`/events/${event._id}`}>
              <button className="px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" />
                Vote Now
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (!res.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await res.json();
      setEvents(data);
      setError('');
    } catch (error) {
      console.error("Failed to fetch events", error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'ended';
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const eventStatus = getEventStatus(event.startDate, event.endDate);
    const matchesFilter = filterStatus === 'all' || eventStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const eventStats = {
    total: events.length,
    live: events.filter(e => getEventStatus(e.startDate, e.endDate) === 'live').length,
    upcoming: events.filter(e => getEventStatus(e.startDate, e.endDate) === 'upcoming').length,
    ended: events.filter(e => getEventStatus(e.startDate, e.endDate) === 'ended').length
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center px-4">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Loader className="w-12 h-12 text-purple-600" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading amazing events...
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please wait while we fetch the latest events for you
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button 
            onClick={fetchEvents}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Discover 
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}Events
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore amazing hackathons, competitions, and events. Join the innovation ecosystem and showcase your skills.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{eventStats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{eventStats.live}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Live Now</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{eventStats.upcoming}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{eventStats.ended}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none min-w-[150px]"
            >
              <option value="all">All Events</option>
              <option value="live">Live Now</option>
              <option value="upcoming">Upcoming</option>
              <option value="ended">Completed</option>
            </select>
          </div>
        </motion.div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredEvents.map((event, index) => (
              <EventCard key={event._id} event={event} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No events found' : 'No events available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'New events will appear here soon. Stay tuned!'}
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all duration-200"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
