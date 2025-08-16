'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  Users, 
  Image as ImageIcon, 
  Save,
  ArrowLeft,
  Plus,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const CreateEventPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  // Set default dates (now to 24 hours from now)
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    startDate: now.toISOString().slice(0, 16), // Format for datetime-local input
    endDate: tomorrow.toISOString().slice(0, 16), // Format for datetime-local input
    image: '',
    votingOpen: true,
    candidates: []
  });

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    description: '',
    image: ''
  });

  const handleInputChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCandidateInputChange = (field, value) => {
    setCandidateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCandidate = () => {
    if (!candidateForm.name.trim()) {
      setMessage('Candidate name is required');
      setMessageType('error');
      return;
    }

    const newCandidate = {
      id: Date.now(),
      ...candidateForm,
      votes: 0
    };

    setEventData(prev => ({
      ...prev,
      candidates: [...prev.candidates, newCandidate]
    }));

    setCandidateForm({
      name: '',
      description: '',
      image: ''
    });

    setMessage('Candidate added successfully');
    setMessageType('success');
  };

  const removeCandidate = (candidateId) => {
    setEventData(prev => ({
      ...prev,
      candidates: prev.candidates.filter(c => c.id !== candidateId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventData.name.trim()) {
      setMessage('Event name is required');
      setMessageType('error');
      return;
    }

    if (!eventData.startDate) {
      setMessage('Start date is required');
      setMessageType('error');
      return;
    }

    if (!eventData.endDate) {
      setMessage('End date is required');
      setMessageType('error');
      return;
    }

    // Validate date logic
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);

    if (endDate <= startDate) {
      setMessage('End date must be after start date');
      setMessageType('error');
      return;
    }

    if (eventData.candidates.length === 0) {
      setMessage('At least one candidate is required');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }),
      });

      if (response.ok) {
        setMessage('Event created successfully!');
        setMessageType('success');
        setTimeout(() => {
          router.push('/admin/events');
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage(error.message || 'Failed to create event. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center gap-4"
      >
        <Link
          href="/admin/events"
          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Create New Event
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Set up a new voting event with candidates and settings
          </p>
        </div>
      </motion.div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-3 ${
            messageType === 'success'
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}
        >
          {messageType === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm md:text-base">{message}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Event Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                value={eventData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                placeholder="Enter event name"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={eventData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                placeholder="Describe your event"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="datetime-local"
                value={eventData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                value={eventData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Image URL
              </label>
              <input
                type="url"
                value={eventData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={eventData.votingOpen}
                  onChange={(e) => handleInputChange('votingOpen', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable voting immediately
                </span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Add Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Add Candidates
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Candidate Name *
              </label>
              <input
                type="text"
                value={candidateForm.name}
                onChange={(e) => handleCandidateInputChange('name', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                placeholder="Enter candidate name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Candidate Image URL
              </label>
              <input
                type="url"
                value={candidateForm.image}
                onChange={(e) => handleCandidateInputChange('image', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                placeholder="https://example.com/candidate.jpg"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={candidateForm.description}
                onChange={(e) => handleCandidateInputChange('description', e.target.value)}
                rows={2}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
                placeholder="Brief description of the candidate"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={addCandidate}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base"
          >
            <Plus className="w-4 h-4" />
            Add Candidate
          </button>
        </motion.div>

        {/* Candidates List */}
        {eventData.candidates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Candidates ({eventData.candidates.length})
            </h2>
            
            <div className="space-y-3 md:space-y-4">
              {eventData.candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-2 md:mb-0">
                    {candidate.image && (
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                        {candidate.name}
                      </h3>
                      {candidate.description && (
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          {candidate.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCandidate(candidate.id)}
                    className="self-start md:self-auto p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-4 h-4" />
              </motion.div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
          
          <Link
            href="/admin/events"
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm md:text-base"
          >
            Cancel
          </Link>
        </motion.div>
      </form>
    </div>
  );
};

export default CreateEventPage;
