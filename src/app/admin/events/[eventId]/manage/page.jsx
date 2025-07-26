// src/app/admin/events/[eventId]/manage/page.jsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';

const TabButton = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            isActive ? 'bg-white border-b-0 border-gray-300' : 'bg-gray-100 hover:bg-gray-200'
        }`}
    >
        {children}
    </button>
);

const ManageEventDetailsPage = ({ params }) => {
    const { eventId } = React.use(params); // ✅ FIXED

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
                const candidatesData = await candidatesRes.json(); // ✅ DIRECT ARRAY
                const usersData = await usersRes.json();

                setEvent(eventData);
                setCandidates(candidatesData || []); // ✅ FIXED LINE
                setAllUsers(usersData || []);
            } catch (error) {
                console.error("Failed to load management data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId, refreshTrigger]);

    if (loading) return <p>Loading event management console...</p>;
    if (!event) return <p>Could not load event data.</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Manage: {event.name}</h1>
            <p className="mb-6 text-gray-600">Event ID: {eventId}</p>

            <div className="border-b border-gray-300">
                <TabButton isActive={activeTab === 'candidates'} onClick={() => setActiveTab('candidates')}>Manage Teams</TabButton>
                <TabButton isActive={activeTab === 'voters'} onClick={() => setActiveTab('voters')}>Manage Voters</TabButton>
                <TabButton isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>Event Settings</TabButton>
            </div>

            <div className="p-6 bg-white rounded-b-lg shadow">
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
            </div>
        </div>
    );
};

const ManageCandidatesTab = ({ eventId, candidates, availableUsers, onChange }) => {
    const [newTeamName, setNewTeamName] = useState('');

    const createTeam = async () => {
        if (!newTeamName) return;
        const res = await fetch(`/api/admin/events/${eventId}/candidates`, {
            method: 'POST',
            body: JSON.stringify({ name: newTeamName }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            setNewTeamName('');
            onChange();
        }
    };

    const addMember = async (candidateId, userId, name) => {
        await fetch(`/api/admin/candidates/${candidateId}/members`, {
            method: 'POST',
            body: JSON.stringify({ userId, name }),
            headers: { 'Content-Type': 'application/json' }
        });
        onChange();
    };

    return (
        <div>
            <div className="mb-4 flex gap-2">
                <input
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="New Team Name"
                    className="border px-3 py-1 rounded"
                />
                <button onClick={createTeam} className="bg-blue-600 text-white px-4 py-1 rounded">
                    Create
                </button>
            </div>

            {candidates.map((team) => (
                <div key={team._id} className="border p-4 mb-4 rounded shadow-sm">
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <ul className="list-disc list-inside text-sm">
                        {(team.members || []).map(m => (
                            <li key={m.userId}>{m.name}</li>
                        ))}
                    </ul>
                    <select
                        className="mt-2 p-1 border rounded"
                        onChange={(e) => {
                            const userId = e.target.value;
                            const user = availableUsers.find(u => u._id === userId);
                            if (user) addMember(team._id, user._id, user.name);
                        }}
                    >
                        <option value="">Add member</option>
                        {availableUsers.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

const ManageVotersTab = ({ eventId, allUsers, initialAllowedVoters }) => {
    const [selected, setSelected] = useState(new Set(initialAllowedVoters));
    const [saving, setSaving] = useState(false);

    const toggle = (userId) => {
        const newSet = new Set(selected);
        newSet.has(userId) ? newSet.delete(userId) : newSet.add(userId);
        setSelected(newSet);
    };

    const saveVoters = async () => {
        setSaving(true);
        const res = await fetch(`/api/admin/events/${eventId}/voters`, {
            method: 'PUT',
            body: JSON.stringify({ userIds: [...selected] }),
            headers: { 'Content-Type': 'application/json' }
        });
        setSaving(false);
        if (!res.ok) alert("Failed to update voters.");
    };

    return (
        <div>
            <p className="mb-2 text-sm text-gray-600">Select who can vote in this event:</p>
            <div className="max-h-60 overflow-y-auto border p-3 rounded mb-4">
                {allUsers.map(user => (
                    <div key={user._id} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            checked={selected.has(user._id)}
                            onChange={() => toggle(user._id)}
                            className="mr-2"
                        />
                        <label>{user.name}</label>
                    </div>
                ))}
            </div>
            <button onClick={saveVoters} disabled={saving} className="bg-green-600 text-white px-4 py-1 rounded">
                {saving ? 'Saving...' : 'Save Voter List'}
            </button>
        </div>
    );
};

const ManageSettingsTab = ({ event }) => {
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [votingOpen, setVotingOpen] = useState(event.votingOpen);
    const [saving, setSaving] = useState(false);

    const saveSettings = async () => {
        setSaving(true);
        const res = await fetch(`/api/admin/events/${event._id}`, {
            method: 'PUT',
            body: JSON.stringify({ name, description, votingOpen }),
            headers: { 'Content-Type': 'application/json' }
        });
        setSaving(false);
        if (!res.ok) alert("Failed to save settings.");
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block font-medium">Event Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-3 py-1 rounded"
                />
            </div>
            <div>
                <label className="block font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border px-3 py-1 rounded"
                />
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={votingOpen}
                    onChange={() => setVotingOpen(!votingOpen)}
                />
                <label>Voting Open</label>
            </div>
            <button onClick={saveSettings} disabled={saving} className="bg-purple-600 text-white px-4 py-1 rounded">
                {saving ? 'Saving...' : 'Save Settings'}
            </button>
        </div>
    );
};

export default ManageEventDetailsPage;