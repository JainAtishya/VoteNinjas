import clientPromise from "../../../../lib/mongodb";
import { checkAdmin } from "../../../../lib/adminAuth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Export results as CSV
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

        // Get event with candidates and votes
        const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) });
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const candidates = await db.collection("candidates").find({ eventId: new ObjectId(eventId) }).toArray();
        const votes = await db.collection("votes").find({ eventId: new ObjectId(eventId) }).toArray();

        // Get user details for votes
        const userIds = votes.map(vote => new ObjectId(vote.userId));
        const users = await db.collection("users").find({ _id: { $in: userIds } }).toArray();
        const userMap = users.reduce((map, user) => {
            map[user._id.toString()] = user;
            return map;
        }, {});

        // Create CSV content
        let csvContent = "Event Name,Candidate Name,Votes Count,Vote Details\n";
        csvContent += `"${event.name}","Event Summary","${votes.length} total votes","Event created on ${event.createdAt?.toISOString() || 'N/A'}"\n`;
        
        candidates.forEach(candidate => {
            const candidateVotes = votes.filter(vote => vote.candidateId.toString() === candidate._id.toString());
            csvContent += `"${event.name}","${candidate.name}","${candidateVotes.length}","`;
            
            // Add vote details
            const voteDetails = candidateVotes.map(vote => {
                const user = userMap[vote.userId];
                const weight = user?.role === 'admin' ? (event.defaultVoteWeight || 5) : 1;
                return `${user?.name || 'Unknown'} (${user?.email || 'N/A'}) - Weight: ${weight} - ${vote.votedAt?.toISOString() || 'N/A'}`;
            }).join('; ');
            
            csvContent += `${voteDetails}"\n`;
        });

        return new Response(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${event.name.replace(/[^a-zA-Z0-9]/g, '_')}_results.csv"`
            }
        });

    } catch (error) {
        console.error("Error exporting results:", error);
        return NextResponse.json({ error: "Failed to export results" }, { status: 500 });
    }
}

// Publish results
export async function POST(request) {
    const adminCheck = await checkAdmin();
    if(adminCheck) return adminCheck;

    try {
        const { eventId } = await request.json();

        if (!eventId) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("votingApp");

        await db.collection("events").updateOne(
            { _id: new ObjectId(eventId) },
            { 
                $set: { 
                    resultsPublished: true,
                    resultsPublishedAt: new Date()
                }
            }
        );

        return NextResponse.json({ message: "Results published successfully" });

    } catch (error) {
        console.error("Error publishing results:", error);
        return NextResponse.json({ error: "Failed to publish results" }, { status: 500 });
    }
}
