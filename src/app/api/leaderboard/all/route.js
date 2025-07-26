import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("votingApp");

        const events = await db
            .collection("events")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        const eventsWithLeaderboards = await Promise.all(
            events.map(async (event) => {
                const candidates = await db
                    .collection("candidates")
                    .find({ eventId: new ObjectId(event._id) })
                    .sort({ votes: -1 })
                    .toArray();
                
                return {
                    ...event,
                    candidates,
                };
            })
        );

        return NextResponse.json(eventsWithLeaderboards);
    } catch (error) {
        console.error("Failed to fetch all leaderboards:", error);
        return NextResponse.json(
            { error: "Failed to fetch all leaderboards" },
            { status: 500 }
        );
    }
}