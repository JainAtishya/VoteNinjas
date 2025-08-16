'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Vote,
  Award,
  Timer,
  CalendarDays,
  UserCheck,
  Zap,
  Loader,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const TeamCard = ({ team, onVote, hasVoted, isVotingOpen, userVotedForThis, session, isEligibleToVote }) => {
  // Ensure team object has required properties with fallbacks
  const teamName = team?.name || 'Unnamed Team';
  const teamDescription = team?.description || "An innovative team ready to compete!";
  const teamMembers = team?.members || [];
  const teamVotes = team?.votes || 0;
  const teamId = team?._id;

  if (!teamId) {
    return null; // Don't render if team ID is missing
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {teamName.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {teamName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {teamDescription}
          </p>
          
          {teamMembers.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {teamVotes} votes
              </span>
            </div>
            
            {isVotingOpen && session ? (
              isEligibleToVote ? (
                <button
                  onClick={() => onVote(teamId)}
                  disabled={hasVoted}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                    userVotedForThis
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-default'
                      : hasVoted 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <Vote className="w-4 h-4" />
                  {userVotedForThis ? 'Your Vote' : hasVoted ? 'Already Voted' : 'Vote'}
                </button>
              ) : (
                <div className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold cursor-not-allowed flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Not Eligible
                </div>
              )
            ) : isVotingOpen && !session ? (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Vote className="w-4 h-4" />
                Sign in to Vote
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EventDetailsPage = ({ params }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [votedForCandidateId, setVotedForCandidateId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isEligibleToVote, setIsEligibleToVote] = useState(true);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  
  // Extract eventId from params using React.use()
  const resolvedParams = React.use(params);
  const eventId = resolvedParams?.eventId;

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchCandidates();
    }
  }, [eventId, session?.user?.id]); // Re-run when user session changes

  const fetchEventDetails = async () => {
    if (!eventId) return;
    
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Event not found');
        } else {
          throw new Error(`Server error: ${res.status}`);
        }
      }
      const data = await res.json();
      if (data && typeof data === 'object') {
        setEvent(data);
        
        // Check if user is eligible to vote
        if (session?.user?.id && data.allowedVoters) {
          const eligible = data.allowedVoters.includes(session.user.id);
          setIsEligibleToVote(eligible);
        } else if (session?.user?.id && (!data.allowedVoters || data.allowedVoters.length === 0)) {
          // If no allowedVoters list exists or it's empty, everyone can vote
          setIsEligibleToVote(true);
        }
        setEligibilityChecked(true);
      } else {
        throw new Error('Invalid event data received');
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      setError(error.message || 'Failed to load event details.');
    }
  };

  const fetchCandidates = async () => {
    if (!eventId) return;
    
    try {
      const res = await fetch(`/api/events/${eventId}/candidates`);
      if (res.ok) {
        const data = await res.json();
        setCandidates(Array.isArray(data.candidates) ? data.candidates : (Array.isArray(data) ? data : []));
        setHasVoted(Boolean(data.userHasVoted));
        setVotedForCandidateId(data.votedForCandidateId || null);
      } else {
        console.warn('Failed to fetch candidates, using empty array');
        setCandidates([]);
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidateId) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!isEligibleToVote) {
      alert('You are not eligible to vote in this event. Only registered voters can participate.');
      return;
    }

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventId,
          candidateId: candidateId,
        }),
      });

      if (res.ok) {
        setHasVoted(true);
        setVotedForCandidateId(candidateId);
        fetchCandidates(); // Refresh candidates to update vote counts
        alert('Vote cast successfully! Thank you for voting.');
      } else {
        const data = await res.json();
        if (data.error === 'You are not eligible to vote in this event.') {
          setIsEligibleToVote(false);
          alert('You are not eligible to vote in this event. Only registered voters can participate.');
        } else {
          alert(data.error || 'Failed to cast vote');
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('An error occurred while casting your vote. Please try again.');
    }
  };

  const getEventStatus = () => {
    if (!event) return { status: 'unknown', color: 'gray', text: 'Unknown' };
    
    // If no dates are provided, use votingOpen as fallback  
    if (!event.startDate || !event.endDate) {
      return event.votingOpen 
        ? { status: 'live', color: 'green', text: 'Live Now' }
        : { status: 'ended', color: 'gray', text: 'Ended' };
    }
    
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return event.votingOpen 
        ? { status: 'live', color: 'green', text: 'Live Now' }
        : { status: 'ended', color: 'gray', text: 'Ended' };
    }
    
    if (now < start) return { status: 'upcoming', color: 'blue', text: 'Upcoming' };
    if (now >= start && now <= end) {
      return event.votingOpen 
        ? { status: 'live', color: 'green', text: 'Live Now' }
        : { status: 'ended', color: 'gray', text: 'Ended' };
    }
    return { status: 'ended', color: 'gray', text: 'Ended' };
  };

  const eventStatus = getEventStatus();
  const isVotingOpen = eventStatus.status === 'live';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Loader className="w-12 h-12 text-purple-600" />
          </motion.div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading event details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Event Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/events">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/events">
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              <ArrowLeft className="w-5 h-5" />
              Back to Events
            </button>
          </Link>
        </motion.div>

        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full text-white ${
                  eventStatus.status === 'live' ? 'bg-green-500' : 
                  eventStatus.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  <div className="flex items-center gap-2">
                    {eventStatus.status === 'live' && <Zap className="w-4 h-4" />}
                    {eventStatus.text}
                  </div>
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {event.name}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {event.description || "Join this exciting event and witness innovation in action!"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {event.startDate && !isNaN(new Date(event.startDate).getTime()) 
                        ? new Date(event.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short', 
                            day: 'numeric'
                          })
                        : 'Date TBD'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Timer className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {event.startDate && event.endDate && 
                       !isNaN(new Date(event.startDate).getTime()) && 
                       !isNaN(new Date(event.endDate).getTime())
                        ? (() => {
                            const days = Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24));
                            return days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : 'Same day';
                          })()
                        : 'TBD'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Participants</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {candidates.length} teams
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLiked 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </button>
              
              <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </motion.div>

        {/* Voting Eligibility Notification */}
        {session && eligibilityChecked && isVotingOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-4 rounded-2xl border ${
              isEligibleToVote 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {isEligibleToVote ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <div>
                <p className={`font-semibold text-sm ${
                  isEligibleToVote ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}>
                  {isEligibleToVote ? '✅ You are eligible to vote!' : '❌ You are not eligible to vote'}
                </p>
                <p className={`text-xs mt-1 ${
                  isEligibleToVote 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {isEligibleToVote 
                    ? 'You can cast your vote for your favorite team below.' 
                    : 'Only registered voters can participate in this event. Contact the admin if you think this is a mistake.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Participating Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Participating Teams
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {isVotingOpen ? 'Cast your vote for your favorite team!' : 'Explore the amazing teams that participated'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {isVotingOpen && (
                <div className="bg-green-100 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      Voting Open
                    </span>
                  </div>
                </div>
              )}
              
              {!session && isVotingOpen && (
                <Link href="/auth/signin">
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Vote className="w-4 h-4" />
                    Sign In to Vote
                  </motion.button>
                </Link>
              )}
            </div>
          </div>

          {candidates && candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates.map((team, index) => {
                if (!team || !team._id) {
                  return null; // Skip invalid team entries
                }
                
                return (
                  <motion.div
                    key={team._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <TeamCard
                      team={team}
                      onVote={handleVote}
                      hasVoted={hasVoted}
                      isVotingOpen={isVotingOpen}
                      userVotedForThis={votedForCandidateId === team._id}
                      session={session}
                      isEligibleToVote={isEligibleToVote}
                    />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl"
            >
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Teams Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Teams will appear here once registration opens
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
