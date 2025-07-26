'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, CircleDot } from 'lucide-react';

interface Team {
  _id: string;
  name: string;
  votes: number;
}

interface EventData {
  _id: string;
  name: string;
  description: string;
  votingOpen: boolean;
  candidates: Team[];
}

// --- Event Card Component ---
const EventLeaderboardCard = ({ event }: { event: EventData }) => {
  const statusLabel = event.votingOpen ? 'Live' : 'Completed';
  const statusColor = event.votingOpen ? 'text-green-500' : 'text-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{event.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
          </div>
          <span
            className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full ${
              event.votingOpen ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'
            } ${statusColor}`}
          >
            <CircleDot size={14} />
            {statusLabel}
          </span>
        </div>

        {/* --- Team Rankings --- */}
        {event.candidates.length > 0 ? (
          <div>
            <h3 className="font-semibold text-lg mb-3">Rankings</h3>
            <ul className="space-y-2">
              {event.candidates.map((team, index) => (
                <li
                  key={team._id}
                  className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-neutral-700/50"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-md w-6 text-center">{index + 1}</span>
                    <span className="font-medium">{team.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {team.votes} votes
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">
            No teams have been added to this event yet.
          </p>
        )}
      </div>
    </motion.div>
  );
};

const AllLeaderboardsPage = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllLeaderboards = async () => {
      try {
        const res = await fetch('/api/leaderboard/all');
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch leaderboards", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllLeaderboards();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-12 text-center">All Event Leaderboards</h1>

      {loading ? (
        <p className="text-center">Loading all events...</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event) => (
            <EventLeaderboardCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No events have been created yet.
        </p>
      )}
    </div>
  );
};

export default AllLeaderboardsPage;