'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface Winner {
  _id: string;
  name: string;
  votes: number;
}

interface EventResult {
  _id: string;
  name: string;
  description: string;
  winners: Winner[];
}

const ResultsPage = () => {
  const [results, setResults] = useState<EventResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/results');
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-12 text-center">Event Results</h1>

      {loading ? (
        <p className="text-center">Loading results...</p>
      ) : results.length > 0 ? (
        <div className="space-y-12">
          {results.map((result) => (
            <motion.div
              key={result._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-xl shadow-lg bg-neutral-100 dark:bg-neutral-800"
            >
              <h2 className="text-2xl font-bold mb-2">{result.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{result.description}</p>
              
              {result.winners.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    {result.winners.length > 1 ? 'Winners (Tie)' : 'Winner'}
                  </h3>
                  {result.winners.map(winner => (
                    <div key={winner._id} className="flex items-center justify-between p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Trophy className="text-yellow-500" size={28} />
                        <div>
                          <p className="text-xl font-bold">{winner.name}</p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">{winner.votes} votes</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No winner declared for this event.</p>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No completed events found.</p>
      )}
    </div>
  );
};

export default ResultsPage;