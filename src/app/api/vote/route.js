export const runtime = 'nodejs';

import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { ObjectId } from "mongodb";

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { candidateId, eventId } = await request.json();
        const userId = session.user.id;

        const client = await clientPromise;
        const db = client.db("votingApp");
        const eventObjectId = new ObjectId(eventId);

        const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) });

        if (!event || !event.votingOpen) {
            return NextResponse.json({ error: "Voting for this event is closed." }, { status: 403 });
        }

        // NEW: Check if the user is in the allowedVoters list
        if (event.allowedVoters && event.allowedVoters.length > 0) {
            const isEligible = event.allowedVoters.includes(userId);
            if (!isEligible) {
                return NextResponse.json({ error: "You are not eligible to vote in this event." }, { status: 403 });
            }
        }

        const existingVote = await db.collection("votes").findOne({
            userId: userId,
            eventId: eventObjectId,
        });

        if (existingVote) {
            return NextResponse.json({ error: "You have already voted in this event." }, { status: 409 });
        }

        // Record the vote
        await db.collection("votes").insertOne({
            userId: userId,
            candidateId: new ObjectId(candidateId),
            eventId: eventObjectId,
            votedAt: new Date(),
        });

        // Increment vote count on the candidate
        await db.collection("candidates").updateOne(
            { _id: new ObjectId(candidateId), eventId: eventObjectId },
            { $inc: { votes: 1 } }
        );

        return NextResponse.json({ message: "Vote successful" });
    } catch (e) {
        console.error("Vote error:", e);
        return NextResponse.json({ error: "Error submitting vote" }, { status: 500 });
    }
}