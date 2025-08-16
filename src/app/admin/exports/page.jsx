'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Calendar, 
  Users, 
  Vote, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  BarChart3,
  Crown
} from 'lucide-react';

const EventCard = ({ event, onExport, onPublishResults }) => {
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExport(event._id, event.name);
    } finally {
      setExporting(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublishResults(event._id);
    } finally {
      setPublishing(false);
    }
  };

  const totalVotes = event.candidates?.reduce((sum, candidate) => sum + (candidate.votes || 0), 0) || 0;
  const totalWeightedVotes = event.candidates?.reduce((sum, candidate) => sum + (candidate.weightedVotes || candidate.votes || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{event.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {event.description || 'No description provided'}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {event.candidates?.length || 0} candidates
            </span>
            <span className="flex items-center gap-1">
              <Vote className="w-4 h-4" />
              {totalVotes} votes
            </span>
            <span className="flex items-center gap-1">
              <Crown className="w-4 h-4" />
              {totalWeightedVotes} weighted
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              event.votingOpen
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              {event.votingOpen ? 'Active' : 'Closed'}
            </span>
          </div>

          {event.resultsPublished && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm mb-4">
              <Eye className="w-4 h-4" />
              <span>Results Published</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {event.resultsPublishedAt ? new Date(event.resultsPublishedAt).toLocaleDateString() : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleExport}
          disabled={exporting || totalVotes === 0}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Export CSV
        </button>

        <button
          onClick={handlePublish}
          disabled={publishing || totalVotes === 0 || event.resultsPublished}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            event.resultsPublished
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {publishing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : event.resultsPublished ? (
            <Eye className="w-4 h-4" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          {event.resultsPublished ? 'Published' : 'Publish Results'}
        </button>
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

export default function ExportResultsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage({ type: 'error', text: 'Failed to load events' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async (eventId, eventName) => {
    try {
      const response = await fetch(`/api/admin/export-results?eventId=${eventId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${eventName.replace(/[^a-zA-Z0-9]/g, '_')}_results.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setMessage({ type: 'success', text: `Results exported for ${eventName}!` });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting results:', error);
      setMessage({ type: 'error', text: 'Failed to export results' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePublishResults = async (eventId) => {
    try {
      const response = await fetch('/api/admin/export-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });

      if (response.ok) {
        setEvents(prev => prev.map(event => 
          event._id === eventId 
            ? { ...event, resultsPublished: true, resultsPublishedAt: new Date() }
            : event
        ));
        setMessage({ type: 'success', text: 'Results published successfully!' });
      } else {
        throw new Error('Publishing failed');
      }
    } catch (error) {
      console.error('Error publishing results:', error);
      setMessage({ type: 'error', text: 'Failed to publish results' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const stats = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.votingOpen).length,
    publishedEvents: events.filter(e => e.resultsPublished).length,
    totalVotes: events.reduce((sum, event) => 
      sum + (event.candidates?.reduce((eventSum, candidate) => 
        eventSum + (candidate.votes || 0), 0
      ) || 0), 0
    )
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
            <Download className="w-8 h-8 text-purple-600" />
            Export & Publish Results
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Export voting results to CSV and publish results for public viewing
          </p>
        </div>
      </motion.div>

      {/* Message Display */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="border-blue-500"
        />
        <StatsCard
          title="Active Events"
          value={stats.activeEvents}
          icon={BarChart3}
          color="border-green-500"
        />
        <StatsCard
          title="Published Results"
          value={stats.publishedEvents}
          icon={Eye}
          color="border-purple-500"
          description="Publicly visible"
        />
        <StatsCard
          title="Total Votes"
          value={stats.totalVotes.toLocaleString()}
          icon={Vote}
          color="border-orange-500"
        />
      </motion.div>

      {/* Events List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Event Results Management
        </h2>
        
        {events.length > 0 ? (
          <div className="grid gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <EventCard
                  event={event}
                  onExport={handleExportCSV}
                  onPublishResults={handlePublishResults}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Events Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create some events to export and publish results
            </p>
          </div>
        )}
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800"
      >
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Export & Publishing Information
        </h3>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p>• <strong>CSV Export</strong> includes candidate details, vote counts, and voter information with timestamps</p>
          <p>• <strong>Weighted votes</strong> are included showing admin vote multipliers</p>
          <p>• <strong>Publishing results</strong> makes them visible to all users in the public results section</p>
          <p>• <strong>Once published</strong>, results cannot be unpublished (but you can export updated CSV anytime)</p>
          <p>• <strong>Real-time data</strong> - exports always include the most current voting results</p>
        </div>
      </motion.div>
    </div>
  );
}
