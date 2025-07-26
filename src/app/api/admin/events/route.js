import clientPromise from "../../../../lib/mongodb";
import { checkAdmin } from "../../../../lib/adminAuth";
import { NextResponse } from "next/server";


export async function POST(request){
    const adminCheck = await checkAdmin();
    if(adminCheck) return adminCheck;

    try{
        const {name, description, votingOpen, startTime, endTime, imageUrl} = await request.json();
        const client = await clientPromise;
        const db = client.db("votingApp");

        const newEvent = {
            name, 
            description,
            votingOpen: false,
            imageUrl: imageUrl || null, 
            allowedVoters: [],
            startTime: startTime ? new Date(startTime): null,
            endTime: endTime ? new Date(endTime) : null,
            createdAt: new Date(),
        };

        await db.collection("events").insertOne(newEvent);
        return NextResponse.json({message: "Event created successfully"}, {status: 201});
    } catch (error){
        return NextResponse.json({error: "Failed to create event"}, {status: 500});
    }
}

export async function GET(request){
    const adminCheck = await checkAdmin();
    if(adminCheck) return adminCheck;

    try{
        const client = await clientPromise;
        const db = client.db("votingApp");
        const events = await db.collection("events").find({}).sort({createdAt: -1}).toArray();
        return NextResponse.json(events);
    } catch (e){
        return NextResponse.json({error: "Error fetching events"}, {status : 500});
    }
}