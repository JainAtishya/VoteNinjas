'use client';
import React from 'react';

export default function Card({ name, progress, voted, onVote, isVotingDisabled, members }) {
  const getButtonClass = () => {
    if (voted) return 'bg-black cursor-not-allowed';
    if (isVotingDisabled) return 'bg-gray-400 cursor-not-allowed';
    return 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]';
  };

  return (
    <div
      className={`no-underline decoration-none max-w-md w-full mx-auto mt-10 p-6 rounded-2xl shadow-lg transition-all backdrop-blur-md bg-white/70 border ${
        voted ? 'border-black' : 'border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 no-underline">{name}</h2>
          <p className="text-sm text-gray-500">Participant</p>
        </div>
        {voted && (
          <span className="text-black text-sm font-semibold border border-black px-3 py-1 rounded-full">
            Voted
          </span>
        )}
      </div>

      <div className="mb-6">
        <p className="text-gray-700 text-sm mb-2">Voting Progress</p>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">
          {Math.round(progress || 0)}%
        </p>
      </div>

      {/* Team Members */}
      <div className="mt-4 mb-4">
        <h4 className="font-semibold text-sm text-gray-700">Team Members:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {members && members.length > 0 ? (
            members.map((member) => (
              <li key={member.userId}>{member.name}</li>
            ))
          ) : (
            <li>No members assigned.</li>
          )}
        </ul>
      </div>

      <button
        onClick={onVote}
        disabled={voted || isVotingDisabled}
        className={`w-auto rounded-xl p-2 text-white text-lg transition-all duration-200 ${getButtonClass()}`}
      >
        {voted ? 'Voted' : 'UpVote'}
      </button>
    </div>
  );
}
