import clientPromise from "../../../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { checkAdmin } from "../../../../../../lib/adminAuth";

export async function GET(request, contextPromise) {
    const { params } = await contextPromise;
    const { eventId } = await params;

    const adminCheck = await checkAdmin();
    if (adminCheck) return adminCheck;

    try {
        const client = await clientPromise;
        const db = client.db("votingApp");

        const candidates = await db
            .collection("candidates")
            .find({
                $or: [
                    { eventId },
                    { eventId: new ObjectId(eventId) }
                ]
            })
            .toArray();

        return NextResponse.json(candidates);
    } catch (error) {
        console.error("Failed to fetch candidates:", error);
        return NextResponse.json(
            { error: "Failed to fetch candidates" },
            { status: 500 }
        );
    }
}

export async function POST(request, {params}){
    const {eventId} = await params;
    const adminCheck = await checkAdmin();

    if(adminCheck) return adminCheck;

    try{
        const {name} = await request.json();

        const client = await clientPromise;

        const db = client.db("votingApp");

        const newCandidate = {
            name,
            eventId: new ObjectId(eventId),
            votes:0,
            members : [],
        };

        const result = await db.collection("candidates").insertOne(newCandidate);

        return NextResponse.json({
            message: "Candidate created successfully",
            candidate: {...newCandidate, _id: result.insertedId},
        }, {status: 201});
    } catch(error){
        console.error("Failed to create candidate: ", error);
        return NextResponse.json({
            error: "Failed to create candidate",
        }, {status: 500});
    }
}