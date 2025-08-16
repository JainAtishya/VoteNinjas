'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Eye,
  Users,
  Vote,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

const EventCard = ({ event, onDelete, onToggleVoting }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const totalVotes = event.candidates?.reduce((sum, candidate) => sum + (candidate.votes || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
    >
      {/* Event Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">
            {event.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {event.description || 'No description provided'}
          </p>
        </div>
        
        {/* Status Badge */}
        <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${
          event.votingOpen
            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        }`}>
          {event.votingOpen ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          {event.votingOpen ? 'Active' : 'Closed'}
        </div>
      </div>

      {/* Event Image */}
      {event.imageUrl && (
        <div className="mb-4">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-32 md:h-40 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 mb-1">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            {event.candidates?.length || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Candidates</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
            <Vote className="w-4 h-4" />
          </div>
          <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            {totalVotes}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Votes</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-orange-600 dark:text-orange-400 mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            {new Date(event.createdAt || Date.now()).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/events/${event._id}/manage`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          <Settings className="w-4 h-4" />
          Manage
        </Link>
        
        <button
          onClick={() => onToggleVoting(event._id, !event.votingOpen)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            event.votingOpen
              ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40'
              : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40'
          }`}
        >
          {event.votingOpen ? 'Close' : 'Open'}
        </button>
        
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
            >
              <Link
                href={`/events/${event._id}`}
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Public
              </Link>
              <button
                onClick={() => onDelete(event._id)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Event
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter(event => event._id !== eventId));
      } else {
        alert('Failed to delete event. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('An error occurred while deleting the event.');
    }
  };

  const handleToggleVoting = async (eventId, votingOpen) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ votingOpen }),
      });

      if (response.ok) {
        setEvents(events.map(event => 
          event._id === eventId ? { ...event, votingOpen } : event
        ));
      } else {
        alert('Failed to update voting status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating voting status:', error);
      alert('An error occurred while updating the voting status.');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && event.votingOpen) ||
                         (filterStatus === 'closed' && !event.votingOpen);

    return matchesSearch && matchesFilter;
  });

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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Manage Events
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Create, edit, and manage all voting events
          </p>
        </div>
        
        <Link
          href="/admin/events/create"
          className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base appearance-none"
          >
            <option value="all">All Events</option>
            <option value="active">Active Events</option>
            <option value="closed">Closed Events</option>
          </select>
        </div>
      </motion.div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <EventCard
                event={event}
                onDelete={handleDeleteEvent}
                onToggleVoting={handleToggleVoting}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No events found' : 'No events created yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Create your first voting event to get started'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Link
              href="/admin/events/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Your First Event
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdminEventsPage;
