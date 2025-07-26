// src/app/api/results/route.js
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("votingApp");

        // Find events where voting is closed
        const completedEvents = await db
            .collection("events")
            .find({ votingOpen: false })
            .sort({ createdAt: -1 })
            .toArray();

        // For each completed event, find the winning candidates AND all candidates
        const results = await Promise.all(
            completedEvents.map(async (event) => {
                const candidates = await db
                    .collection("candidates")
                    .find({ eventId: event._id })
                    .sort({ votes: -1 })
                    .toArray();
                
                const maxVotes = candidates.length > 0 ? candidates[0].votes : 0;
                
                const winners = candidates.filter(c => c.votes === maxVotes && maxVotes > 0);

                return {
                    ...event,
                    winners,
                    candidates, // Include all candidates in the response
                };
            })
        );

        return NextResponse.json(results);
    } catch (error) {
        console.error("Failed to fetch results:", error);
        return NextResponse.json(
            { error: "Failed to fetch results" },
            { status: 500 }
        );
    }
}