import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    const { eventId } = params;

    try {
        const client = await clientPromise;
        const db = client.db("votingApp");

        const candidates = await db
            .collection("candidates")
            .find({ eventId: new ObjectId(eventId) })
            .sort({ votes: -1 }) 
            .toArray();

        return NextResponse.json(candidates);
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}