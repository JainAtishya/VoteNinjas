// src/app/admin/events/[eventId]/manage/page.jsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Settings, UserCheck, Plus, Search, Trash2, Edit3, Save, X, CheckCircle, XCircle, Calendar } from 'lucide-react';

const TabButton = ({ isActive, onClick, children, icon: Icon }) => (
    <motion.button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
            isActive 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        <Icon size={14} className="md:w-4 md:h-4" />
        {children}
    </motion.button>
);

const ManageEventDetailsPage = ({ params }) => {
    const resolvedParams = React.use(params);
    const { eventId } = resolvedParams;

    const [activeTab, setActiveTab] = useState('candidates');
    const [event, setEvent] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const triggerRefresh = () => setRefreshTrigger((prev) => !prev);

    const availableUsersForTeams = useMemo(() => {
        const assignedUserIds = new Set(candidates.flatMap(c => c.members?.map(m => m.userId) || []));
        return allUsers.filter(u => !assignedUserIds.has(u._id));
    }, [allUsers, candidates]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [eventRes, candidatesRes, usersRes] = await Promise.all([
                    fetch(`/api/admin/events/${eventId}`),
                    fetch(`/api/admin/events/${eventId}/candidates`),
                    fetch('/api/admin/users')
                ]);

                const eventData = await eventRes.json();
                const candidatesData = await candidatesRes.json();
                const usersData = await usersRes.json();

                setEvent(eventData);
                setCandidates(candidatesData || []);
                setAllUsers(usersData || []);
            } catch (error) {
                console.error("Failed to load management data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId, refreshTrigger]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <motion.div
                className="flex flex-col items-center space-y-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading event management console...</p>
            </motion.div>
        </div>
    );

    if (!event) return (
        <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600">Could not load event data. Please try again.</p>
        </motion.div>
    );

    return (
        <motion.div 
            className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 min-h-screen bg-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 md:p-8 border border-gray-700">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 truncate">{event.name}</h1>
                        <p className="text-gray-300 text-sm md:text-lg">Comprehensive Event Management</p>
                        <div className="flex items-center gap-4 mt-4 flex-wrap">
                            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                                <Calendar size={14} className="md:w-4 md:h-4" />
                                <span>Event ID: {eventId}</span>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                                event.votingOpen ? 'bg-green-900 text-green-300 border border-green-800' : 'bg-red-900 text-red-300 border border-red-800'
                            }`}>
                                {event.votingOpen ? <CheckCircle size={12} className="md:w-4 md:h-4" /> : <XCircle size={12} className="md:w-4 md:h-4" />}
                                {event.votingOpen ? 'Voting Open' : 'Voting Closed'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 md:gap-4 p-2 bg-gray-800 rounded-xl overflow-x-auto border border-gray-700">
                <TabButton 
                    isActive={activeTab === 'candidates'} 
                    onClick={() => setActiveTab('candidates')} 
                    icon={Users}
                >
                    <span className="hidden sm:inline">Manage </span>Teams
                </TabButton>
                <TabButton 
                    isActive={activeTab === 'voters'} 
                    onClick={() => setActiveTab('voters')} 
                    icon={UserCheck}
                >
                    <span className="hidden sm:inline">Manage </span>Voters
                </TabButton>
                <TabButton 
                    isActive={activeTab === 'settings'} 
                    onClick={() => setActiveTab('settings')} 
                    icon={Settings}
                >
                    <span className="hidden sm:inline">Event </span>Settings
                </TabButton>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden"
                >
                    {activeTab === 'candidates' && (
                        <ManageCandidatesTab
                            eventId={eventId}
                            candidates={candidates}
                            availableUsers={availableUsersForTeams}
                            onChange={triggerRefresh}
                        />
                    )}
                    {activeTab === 'voters' && (
                        <ManageVotersTab
                            eventId={eventId}
                            allUsers={allUsers}
                            initialAllowedVoters={event.allowedVoters || []}
                        />
                    )}
                    {activeTab === 'settings' && <ManageSettingsTab event={event} />}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

const ManageCandidatesTab = ({ eventId, candidates, availableUsers, onChange }) => {
    const [newTeamName, setNewTeamName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [creating, setCreating] = useState(false);

    const createTeam = async () => {
        if (!newTeamName.trim() || creating) return;
        
        setCreating(true);
        try {
            const res = await fetch(`/api/admin/events/${eventId}/candidates`, {
                method: 'POST',
                body: JSON.stringify({ name: newTeamName }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (res.ok) {
                setNewTeamName('');
                onChange();
            }
        } catch (error) {
            console.error('Failed to create team:', error);
        } finally {
            setCreating(false);
        }
    };

    const addMember = async (candidateId, userId, name) => {
        try {
            await fetch(`/api/admin/candidates/${candidateId}/members`, {
                method: 'POST',
                body: JSON.stringify({ userId, name }),
                headers: { 'Content-Type': 'application/json' }
            });
            onChange();
        } catch (error) {
            console.error('Failed to add member:', error);
        }
    };

    const filteredUsers = availableUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Team Management</h2>
                    <p className="text-gray-300 mt-1 text-sm md:text-base">Create teams and assign members for this event</p>
                </div>
                <div className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full self-start lg:self-center border border-gray-600">
                    {candidates.length} {candidates.length === 1 ? 'Team' : 'Teams'} • {availableUsers.length} Available Members
                </div>
            </div>

            {/* Create New Team */}
            <motion.div 
                className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 border border-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="text-blue-400" size={20} />
                    Create New Team
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="Enter team name..."
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                        onKeyPress={(e) => e.key === 'Enter' && createTeam()}
                    />
                    <motion.button 
                        onClick={createTeam} 
                        disabled={!newTeamName.trim() || creating}
                        className="px-4 md:px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {creating ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Plus size={16} />
                        )}
                        {creating ? 'Creating...' : 'Create Team'}
                    </motion.button>
                </div>
            </motion.div>

            {/* Search Available Users */}
            {availableUsers.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search available users..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                        />
                    </div>
                </div>
            )}

            {/* Teams Grid */}
            {candidates.length === 0 ? (
                <motion.div 
                    className="text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Users className="mx-auto h-12 md:h-16 w-12 md:w-16 text-gray-500 mb-4" />
                    <h3 className="text-base md:text-lg font-medium text-white mb-2">No Teams Yet</h3>
                    <p className="text-gray-400 text-sm md:text-base">Create your first team to get started with the event.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {candidates.map((team, index) => (
                        <motion.div
                            key={team._id}
                            className="bg-gray-800 border border-gray-600 rounded-xl p-4 md:p-6 hover:shadow-lg hover:border-gray-500 transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    {team.name}
                                </h3>
                                <span className="text-xs md:text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
                                    {team.members?.length || 0} {(team.members?.length || 0) === 1 ? 'Member' : 'Members'}
                                </span>
                            </div>

                            {/* Team Members */}
                            <div className="space-y-2 mb-4">
                                {(team.members || []).length === 0 ? (
                                    <p className="text-gray-400 italic text-sm">No members assigned yet</p>
                                ) : (
                                    (team.members || []).map((member, idx) => (
                                        <div key={member.userId} className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg border border-gray-600">
                                            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium text-sm md:text-base">{member.name}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Member Dropdown */}
                            {filteredUsers.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Add Team Member</label>
                                    <select
                                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                                        onChange={(e) => {
                                            const userId = e.target.value;
                                            const user = filteredUsers.find(u => u._id === userId);
                                            if (user) {
                                                addMember(team._id, user._id, user.name);
                                                e.target.value = '';
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" className="bg-gray-700">Select a user to add...</option>
                                        {filteredUsers.map(user => (
                                            <option key={user._id} value={user._id} className="bg-gray-700">{user.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {filteredUsers.length === 0 && availableUsers.length === 0 && (
                                <p className="text-sm text-gray-400 italic">All users have been assigned to teams</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ManageVotersTab = ({ eventId, allUsers, initialAllowedVoters }) => {
    const [selected, setSelected] = useState(new Set(initialAllowedVoters));
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectAll, setSelectAll] = useState(false);

    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggle = (userId) => {
        const newSet = new Set(selected);
        newSet.has(userId) ? newSet.delete(userId) : newSet.add(userId);
        setSelected(newSet);
    };

    const toggleAll = () => {
        if (selectAll) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filteredUsers.map(user => user._id)));
        }
        setSelectAll(!selectAll);
    };

    const saveVoters = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/events/${eventId}/voters`, {
                method: 'PUT',
                body: JSON.stringify({ userIds: [...selected] }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                console.error('Save voters error:', errorData);
                alert(`Failed to update voters: ${errorData.error || 'Unknown error'}`);
            } else {
                const result = await res.json();
                console.log('Voters saved successfully:', result);
                alert('Voter list saved successfully!');
                // Trigger a refresh of the parent component to update the eligible voters count
                if (window.location) {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Failed to save voters:', error);
            alert("Failed to update voters. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        setSelectAll(filteredUsers.length > 0 && filteredUsers.every(user => selected.has(user._id)));
    }, [selected, filteredUsers]);

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Voter Management</h2>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">Select which users can vote in this event</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full self-start md:self-center">
                    {selected.size} of {allUsers.length} users selected
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users by name or email..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                </div>
                
                {/* Select All Toggle */}
                <motion.button
                    onClick={toggleAll}
                    className="px-4 md:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {selectAll ? 'Deselect All' : 'Select All'}
                </motion.button>
            </div>

            {/* Users List */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12 md:py-16 px-4">
                            <UserCheck className="mx-auto h-12 md:h-16 w-12 md:w-16 text-gray-500 mb-4" />
                            <h3 className="text-base md:text-lg font-medium text-white mb-2">No Users Found</h3>
                            <p className="text-gray-400 text-sm md:text-base">
                                {searchTerm ? 'Try adjusting your search terms.' : 'No users available for this event.'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-700">
                            {filteredUsers.map((user, index) => (
                                <motion.div
                                    key={user._id}
                                    className="p-3 md:p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                                    onClick={() => toggle(user._id)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 4 }}
                                >
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <input
                                            type="checkbox"
                                            checked={selected.has(user._id)}
                                            onChange={() => toggle(user._id)}
                                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                        
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm md:text-base">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm md:text-base font-medium text-white truncate">{user.name}</h4>
                                            {user.email && (
                                                <p className="text-xs md:text-sm text-gray-400 truncate">{user.email}</p>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {user.role === 'admin' && (
                                                <span className="px-2 py-1 bg-purple-900 text-purple-300 text-xs font-medium rounded-full border border-purple-800">
                                                    Admin
                                                </span>
                                            )}
                                            {selected.has(user._id) && (
                                                <CheckCircle className="text-green-400" size={16} />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <motion.button
                    onClick={saveVoters}
                    disabled={saving}
                    className="w-full sm:w-auto px-6 md:px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Save Voter List ({selected.size} selected)
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

const ManageSettingsTab = ({ event }) => {
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description || '');
    const [votingOpen, setVotingOpen] = useState(event.votingOpen);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const changed = name !== event.name || 
                      description !== (event.description || '') || 
                      votingOpen !== event.votingOpen;
        setHasChanges(changed);
    }, [name, description, votingOpen, event]);

    const saveSettings = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/events/${event._id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, description, votingOpen }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!res.ok) {
                alert("Failed to save settings.");
            } else {
                setHasChanges(false);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    const resetChanges = () => {
        setName(event.name);
        setDescription(event.description || '');
        setVotingOpen(event.votingOpen);
        setHasChanges(false);
    };

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Event Settings</h2>
                    <p className="text-gray-300 mt-1 text-sm md:text-base">Configure your event details and voting status</p>
                </div>
                {hasChanges && (
                    <motion.div 
                        className="flex items-center gap-2 px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-xs md:text-sm font-medium border border-yellow-800"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Edit3 size={14} />
                        Unsaved changes
                    </motion.div>
                )}
            </div>

            {/* Settings Form */}
            <div className="bg-gray-800 space-y-6 p-4 md:p-6 rounded-xl border border-gray-700">
                {/* Event Name */}
                <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="block text-sm font-semibold text-gray-300">Event Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm md:text-base"
                        placeholder="Enter event name..."
                    />
                </motion.div>

                {/* Event Description */}
                <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block text-sm font-semibold text-gray-300">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-sm md:text-base"
                        placeholder="Describe your event..."
                    />
                </motion.div>

                {/* Voting Status */}
                <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className="block text-sm font-semibold text-gray-300">Voting Status</label>
                    <div className="bg-gray-700 rounded-lg p-4 md:p-6 border border-gray-600">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-4 h-4 rounded-full ${votingOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <div>
                                    <h4 className="font-medium text-white text-sm md:text-base">
                                        {votingOpen ? 'Voting is Open' : 'Voting is Closed'}
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-400">
                                        {votingOpen 
                                            ? 'Users can currently cast their votes for this event.' 
                                            : 'Voting is currently disabled for this event.'
                                        }
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={() => setVotingOpen(!votingOpen)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    votingOpen ? 'bg-blue-600' : 'bg-gray-500'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.span
                                    className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                                    animate={{ x: votingOpen ? 24 : 4 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Event Statistics */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="text-blue-400" size={16} />
                            <span className="text-sm font-medium text-gray-300">Created</span>
                        </div>
                        <p className="text-base md:text-lg font-semibold text-white">
                            {new Date(event.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="text-green-400" size={16} />
                            <span className="text-sm font-medium text-gray-300">Teams</span>
                        </div>
                        <p className="text-base md:text-lg font-semibold text-white">
                            {event.candidates?.length || 0}
                        </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <UserCheck className="text-purple-400" size={16} />
                            <span className="text-sm font-medium text-gray-300">Eligible Voters</span>
                        </div>
                        <p className="text-base md:text-lg font-semibold text-white">
                            {event.allowedVoters?.length || 0}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <motion.button
                    onClick={saveSettings}
                    disabled={saving || !hasChanges}
                    className="flex-1 sm:flex-none px-6 md:px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    whileHover={{ scale: hasChanges ? 1.02 : 1 }}
                    whileTap={{ scale: hasChanges ? 0.98 : 1 }}
                >
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving Settings...
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Save Changes
                        </>
                    )}
                </motion.button>
                
                {hasChanges && (
                    <motion.button
                        onClick={resetChanges}
                        className="px-4 md:px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-gray-600 text-sm md:text-base"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <X size={16} />
                        Reset Changes
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
};

export default ManageEventDetailsPage;