'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ManageEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);


     const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setNewEvent(prev => ({ ...prev, imageUrl: data.imageUrl }));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/events');
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to fetch events');
            }
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/admin/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create event');
            }
            fetchEvents();
            setNewEvent({ name: '', description: '', imageUrl: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event and all its data? This action cannot be undone.")) {
            try {
                const res = await fetch(`/api/admin/events/${eventId}`, { method: 'DELETE' });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to delete event');
                }
                fetchEvents();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleToggleVoting = async (eventId, currentStatus) => {
        try {
            const res = await fetch(`/api/admin/events/${eventId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ votingOpen: !currentStatus }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update voting status');
            }
            fetchEvents();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p className="text-center p-10">Loading events...</p>;

return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

      {/* Create New Event */}
      <div className="p-6 bg-white rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
        <form onSubmit={handleCreateEvent} className="space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-gray-700">Event Name</label>
            <input
              type="text"
              name="name"
              value={newEvent.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700">Event Image (Optional)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isUploading}
            />
            {isUploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
            {newEvent.imageUrl && (
              <div className="mt-2">
                <img
                  src={newEvent.imageUrl}
                  alt="Preview"
                  className="h-24 w-auto rounded-lg"
                />
                <p className="text-xs text-gray-500">Image uploaded!</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? 'Waiting for upload...' : 'Create Event'}
          </button>
        </form>
      </div>

      {/* Existing Events List */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Existing Events</h2>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-bold text-lg">{event.name}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <span
                    className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                      event.votingOpen
                        ? 'text-green-600 bg-green-200'
                        : 'text-red-600 bg-red-200'
                    }`}
                  >
                    {event.votingOpen ? 'Open' : 'Closed'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleToggleVoting(event._id, event.votingOpen)
                    }
                    className={`px-3 py-1 text-sm rounded ${
                      event.votingOpen
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {event.votingOpen ? 'Close Voting' : 'Open Voting'}
                  </button>

                  <Link href={`/admin/events/${event._id}/manage`}>
                    <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                      Manage
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No events found. Create one above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEventsPage;