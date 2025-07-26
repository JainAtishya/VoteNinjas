// CORRECTED FILE: src/app/api/admin/events/[eventId]/route.js
import clientPromise from "../../../../../lib/mongodb";
import { checkAdmin } from "../../../../../lib/adminAuth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    const adminCheck = await checkAdmin();
    if (adminCheck) return adminCheck;

    try {
        const { eventId } = await params;
        const client = await clientPromise;
        const db = client.db("votingApp");
        const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) });
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const adminCheck = await checkAdmin();
    if (adminCheck) return adminCheck;

    try {
        const { eventId } = params;
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("votingApp");

        const updateData = {};
        if (body.name) updateData.name = body.name;
        if (body.description) updateData.description = body.description;
        if (typeof body.votingOpen === 'boolean') updateData.votingOpen = body.votingOpen;
        if (body.imageUrl) updateData.imageUrl = body.imageUrl;

        await db.collection("events").updateOne(
            { _id: new ObjectId(eventId) },
            { $set: updateData }
        );

        return NextResponse.json({ message: "Event updated successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}

// DELETE - Delete an event and all its related data
export async function DELETE(request, { params }) {
    const adminCheck = await checkAdmin();
    if (adminCheck) return adminCheck;

    try {
        const { eventId } = params;
        const client = await clientPromise;
        const db = client.db("votingApp");

        const session = client.startSession();
        await session.withTransaction(async () => {
            await db.collection("events").deleteOne({ _id: new ObjectId(eventId) }, { session });
            await db.collection("candidates").deleteMany({ eventId: eventId }, { session });
            await db.collection("votes").deleteMany({ eventId: eventId }, { session });
        });
        session.endSession();

        return NextResponse.json({ message: "Event and all related data deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}
