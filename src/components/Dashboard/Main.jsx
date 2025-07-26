// src/components/Dashboard/Main.jsx
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import TimeLine from './TimeLine';
import Card from './Cards_Section';
import { VotingExpandableCard } from '../ui/voting_expandable_card';
import avatar from "../../assets/images/avatar_image.png";

const DashboardContent = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [cards, setCards] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [votedForCandidateId, setVotedForCandidateId] = useState(null);
  const [votingOpen, setVotingOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDataForEvent = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        setLoading(false);
        return;
      }

      if (!eventId) {
        setLoading(false);
        setError('No event selected. Please choose an event to view the dashboard.');
        return;
      }

      setError('');
      setLoading(true);
      try {
        const res = await fetch(`/api/events/${eventId}/candidates`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch event data');
        }
        const data = await res.json();
        const formattedData = data.candidates.map(c => ({ ...c, id: c._id }));
        setCards(formattedData);
        setUserHasVoted(data.userHasVoted);
        setVotedForCandidateId(data.votedForCandidateId);
        setVotingOpen(data.votingOpen);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataForEvent();
  }, [status, eventId]);

  useEffect(() => {
    const currentTotalVotes = cards.reduce((sum, card) => sum + card.votes, 0);
    setTotalVotes(currentTotalVotes);
    const maxVotes = Math.max(...cards.map(c => c.votes), 0);
    const newOverallProgress = currentTotalVotes > 0 ? (maxVotes / currentTotalVotes) * 100 : 0;
    setOverallProgress(newOverallProgress);
  }, [cards]);

  const handleVote = async (candidateId) => {
    if (userHasVoted || !votingOpen) return;

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, eventId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Vote failed: ${errorData.error}`);
        return;
      }

      const updated = await fetch(`/api/events/${eventId}/candidates`);
      const newData = await updated.json();
      const formattedData = newData.candidates.map(c => ({ ...c, id: c._id }));
      setCards(formattedData);
      setUserHasVoted(newData.userHasVoted);
      setVotedForCandidateId(newData.votedForCandidateId);
      setVotingOpen(newData.votingOpen);
    } catch (error) {
      console.error("Error during voting:", error);
    }
  };



    const votingCards = cards.map(card => ({
    id: card.id,
    title: card.name,
    description: `Total Votes: ${card.votes}`,
    src: "https://lookaside.fbsbx.com/elementpath/media/?media_id=521717260473289&version=1745861300&transcode_extension=webp", // Placeholder image
    ctaText: card.id === votedForCandidateId ? 'Voted' : 'Upvote',
    onCtaClick: () => handleVote(card.id),
    isVoted: card.id === votedForCandidateId,
    isDisabled: userHasVoted || !votingOpen,
    content: () => (
      <div>
        <h4 className="font-bold mb-2">Team Members:</h4>
        <ul className="list-disc list-inside text-sm">
          {(card.members || []).map(m => <li key={m.userId}>{m.name}</li>)}
        </ul>
        <hr className="my-4" />
        <p>The voting progress for this team is currently at {totalVotes > 0 ? ((card.votes / totalVotes) * 100).toFixed(2) : 0}%.</p>
      </div>
    ),
  }));


  if (loading) return <p className="text-center p-10">Loading Dashboard...</p>;
  if (status === 'unauthenticated') return <p className="text-center p-10">Please sign in to view the dashboard.</p>;
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>;

  return (
    <div className='items-center justify-center p-4 md:p-10'>
      {!votingOpen && (
        <div className="p-4 mb-4 text-center text-yellow-800 bg-yellow-100 border-l-4 border-yellow-500" role="alert">
          <p className="font-bold">Voting for this event has ended!</p>
        </div>
      )}
      <TimeLine progress={overallProgress} />
      {/* 3. Render the new component */}
      <div className='mt-8'>
        <VotingExpandableCard cards={votingCards} />
      </div>
    </div>
  );
};

export default function Main() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}