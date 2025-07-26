import clientPromise from "../../../../../../lib/mongodb";
import { checkAdmin } from "../../../../../../lib/adminAuth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(request, {params}){
    const adminCheck = await checkAdmin();
    if(adminCheck) return adminCheck;

    try{
        const {eventId} = params;
        const {userIds} = await request.json();

        const client = await clientPromise;
        const db = client.db("votingApp");

        await db.collection("events").updateOne(
            {_id: new ObjectId(eventId)},
            {$set: {allowedVoters: userIds}}
        );
        return NextResponse.json({message: "Voter list updated successfully"});
    } catch (error){
        return NextResponse.json({error: "Failed to update voter list"}, { status : 500});
    }
}