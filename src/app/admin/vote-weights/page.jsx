'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Weight, 
  Settings, 
  Save, 
  RefreshCw, 
  Crown, 
  Users, 
  Calendar,
  Globe,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';

const VoteWeightCard = ({ title, description, value, onChange, icon: Icon, color, disabled = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 ${color} ${
      disabled ? 'opacity-60' : ''
    }`}
  >
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('-500', '-100')} dark:${color.replace('border-', 'bg-').replace('-500', '-900/20')}`}>
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="1"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 1)}
            disabled={disabled}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">votes per submission</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const EventWeightCard = ({ event, onUpdate }) => {
  const [localWeight, setLocalWeight] = useState(event.defaultVoteWeight || 5);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(event._id, localWeight);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{event.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {event.candidates?.length || 0} candidates
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              event.votingOpen
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              {event.votingOpen ? 'Active' : 'Closed'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="100"
            value={localWeight}
            onChange={(e) => setLocalWeight(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleSave}
            disabled={saving || localWeight === (event.defaultVoteWeight || 5)}
            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function VoteWeightsPage() {
  const [globalWeights, setGlobalWeights] = useState({
    defaultAdminWeight: 5,
    defaultUserWeight: 1
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [weightsRes, eventsRes] = await Promise.all([
        fetch('/api/admin/vote-weights'),
        fetch('/api/admin/events')
      ]);

      if (weightsRes.ok) {
        const weights = await weightsRes.json();
        setGlobalWeights(weights);
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load vote weight settings' });
    } finally {
      setLoading(false);
    }
  };

  const saveGlobalWeights = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/vote-weights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...globalWeights,
          isGlobal: true
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Global vote weights updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to update weights');
      }
    } catch (error) {
      console.error('Error saving weights:', error);
      setMessage({ type: 'error', text: 'Failed to update vote weights' });
    } finally {
      setSaving(false);
    }
  };

  const updateEventWeight = async (eventId, weight) => {
    try {
      const response = await fetch('/api/admin/vote-weights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          defaultAdminWeight: weight
        })
      });

      if (response.ok) {
        setEvents(prev => prev.map(event => 
          event._id === eventId 
            ? { ...event, defaultVoteWeight: weight }
            : event
        ));
        setMessage({ type: 'success', text: 'Event vote weight updated!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to update event weight');
      }
    } catch (error) {
      console.error('Error updating event weight:', error);
      setMessage({ type: 'error', text: 'Failed to update event weight' });
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
            <Weight className="w-8 h-8 text-purple-600" />
            Vote Weight Configuration
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Configure how much each vote type is worth in your voting system
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

      {/* Global Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-600" />
          Global Vote Weight Settings
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <VoteWeightCard
            title="Admin Vote Weight"
            description="How many votes each admin vote is worth"
            value={globalWeights.defaultAdminWeight}
            onChange={(value) => setGlobalWeights(prev => ({ ...prev, defaultAdminWeight: value }))}
            icon={Crown}
            color="border-purple-500"
          />
          <VoteWeightCard
            title="User Vote Weight"
            description="How many votes each regular user vote is worth"
            value={globalWeights.defaultUserWeight}
            onChange={(value) => setGlobalWeights(prev => ({ ...prev, defaultUserWeight: value }))}
            icon={Users}
            color="border-blue-500"
            disabled={true}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveGlobalWeights}
            disabled={saving}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Global Settings
          </button>
        </div>
      </motion.div>

      {/* Event-Specific Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Event-Specific Weight Overrides
        </h2>
        
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <EventWeightCard event={event} onUpdate={updateEventWeight} />
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
              Create some events to configure event-specific vote weights
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
          <Zap className="w-5 h-5" />
          How Vote Weighting Works
        </h3>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p>• <strong>Admin votes</strong> are multiplied by the weight you set (default: {globalWeights.defaultAdminWeight}x)</p>
          <p>• <strong>Regular user votes</strong> count as 1 vote each</p>
          <p>• <strong>Event-specific weights</strong> override global settings for that event</p>
          <p>• <strong>Real-time calculation</strong> means changes apply immediately to ongoing events</p>
          <p>• <strong>Transparency</strong> - voters can see the weighting system in leaderboards</p>
        </div>
      </motion.div>
    </div>
  );
}
