import clientPromise from "../../../../lib/mongodb";
import { checkAdmin } from "../../../../lib/adminAuth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Get live leaderboard with weighted votes
export async function GET(request) {
    const adminCheck = await checkAdmin();
    if(adminCheck) return adminCheck;

    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');

        if (!eventId) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("votingApp");

        // Get event details
        const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) });
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // Get candidates
        const candidates = await db.collection("candidates").find({ eventId: new ObjectId(eventId) }).toArray();
        
        // Get all votes for this event
        const votes = await db.collection("votes").find({ eventId: new ObjectId(eventId) }).toArray();
        
        // Get user details for vote weighting
        const userIds = votes.map(vote => new ObjectId(vote.userId));
        const users = await db.collection("users").find({ _id: { $in: userIds } }).toArray();
        const userMap = users.reduce((map, user) => {
            map[user._id.toString()] = user;
            return map;
        }, {});

        // Calculate weighted votes for each candidate
        const candidateResults = candidates.map(candidate => {
            const candidateVotes = votes.filter(vote => vote.candidateId.toString() === candidate._id.toString());
            
            let totalWeightedVotes = 0;
            let regularVotes = 0;
            let adminVotes = 0;
            
            candidateVotes.forEach(vote => {
                const user = userMap[vote.userId];
                const weight = user?.role === 'admin' ? (event.defaultVoteWeight || 5) : 1;
                totalWeightedVotes += weight;
                
                if (user?.role === 'admin') {
                    adminVotes++;
                } else {
                    regularVotes++;
                }
            });

            return {
                candidate: {
                    _id: candidate._id,
                    name: candidate.name,
                    description: candidate.description,
                    imageUrl: candidate.imageUrl
                },
                totalVotes: candidateVotes.length,
                totalWeightedVotes,
                regularVotes,
                adminVotes,
                percentage: candidates.length > 0 ? (totalWeightedVotes / votes.reduce((sum, v) => {
                    const user = userMap[v.userId];
                    return sum + (user?.role === 'admin' ? (event.defaultVoteWeight || 5) : 1);
                }, 0)) * 100 : 0
            };
        });

        // Sort by weighted votes
        candidateResults.sort((a, b) => b.totalWeightedVotes - a.totalWeightedVotes);

        return NextResponse.json({
            event: {
                _id: event._id,
                name: event.name,
                description: event.description,
                votingOpen: event.votingOpen,
                defaultVoteWeight: event.defaultVoteWeight || 5
            },
            candidates: candidateResults,
            totalVoters: votes.length,
            totalWeightedVotes: candidateResults.reduce((sum, c) => sum + c.totalWeightedVotes, 0),
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
