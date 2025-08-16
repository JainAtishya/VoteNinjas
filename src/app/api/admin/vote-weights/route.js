import clientPromise from "../../../../lib/mongodb";
import { checkAdmin } from "../../../../lib/adminAuth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Get vote weights
export async function GET(request) {
    const adminCheck = await checkAdmin();
    if(adminCheck) return adminCheck;

    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');

        const client = await clientPromise;
        const db = client.db("votingApp");

        if (eventId) {
            // Get event-specific vote weights
            const event = await db.collection("events").findOne(
                { _id: new ObjectId(eventId) },
                { projection: { voteWeights: 1, defaultVoteWeight: 1 } }
            );
            return NextResponse.json(event || {});
        } else {
            // Get global vote weight settings
            const settings = await db.collection("settings").findOne(
                { type: "global" },
                { projection: { defaultAdminWeight: 1, defaultUserWeight: 1 } }
            );
            return NextResponse.json(settings || { defaultAdminWeight: 5, defaultUserWeight: 1 });
        }
    } catch (error) {
        console.error("Error fetching vote weights:", error);
        return NextResponse.json({ error: "Failed to fetch vote weights" }, { status: 500 });
    }
}

// Update vote weights
export async function PUT(request) {
    const adminCheck = await checkAdmin();
    if(adminCheck) return adminCheck;

    try {
        const { eventId, voteWeights, defaultAdminWeight, defaultUserWeight, isGlobal } = await request.json();

        const client = await clientPromise;
        const db = client.db("votingApp");

        if (isGlobal) {
            // Update global settings
            await db.collection("settings").updateOne(
                { type: "global" },
                { 
                    $set: { 
                        defaultAdminWeight: defaultAdminWeight || 5, 
                        defaultUserWeight: defaultUserWeight || 1,
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );
        } else if (eventId) {
            // Update event-specific vote weights
            await db.collection("events").updateOne(
                { _id: new ObjectId(eventId) },
                { 
                    $set: { 
                        voteWeights: voteWeights,
                        defaultVoteWeight: defaultAdminWeight || 5,
                        updatedAt: new Date()
                    }
                }
            );
        }

        return NextResponse.json({ message: "Vote weights updated successfully" });
    } catch (error) {
        console.error("Error updating vote weights:", error);
        return NextResponse.json({ error: "Failed to update vote weights" }, { status: 500 });
    }
}
