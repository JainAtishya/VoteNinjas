import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    try {
        const { eventId } = await params;
        
        if (!ObjectId.isValid(eventId)) {
            return NextResponse.json(
                { error: "Invalid event ID" }, 
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("votingApp");
        
        const event = await db.collection("events").findOne({
            _id: new ObjectId(eventId)
        });
        
        if (!event) {
            return NextResponse.json(
                { error: "Event not found" }, 
                { status: 404 }
            );
        }
        
        return NextResponse.json(event);
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Error fetching event" }, 
            { status: 500 }
        );
    }
}
