import clientPromise from "../../../../lib/mongodb";
import { checkAdmin } from "../../../../lib/adminAuth";
import { NextResponse } from "next/server";


export async function POST(request){
    const adminCheck = await checkAdmin();
    if(adminCheck) return adminCheck;

    try{
        const body = await request.json();
        const {name, description, votingOpen, startTime, endTime, startDate, endDate, imageUrl, image, candidates} = body;
        
        const client = await clientPromise;
        const db = client.db("votingApp");

        // Handle both startTime/endTime and startDate/endDate field names
        const start = startTime || startDate;
        const end = endTime || endDate;
        const eventImage = imageUrl || image;

        const newEvent = {
            name, 
            description,
            votingOpen: votingOpen || false,
            imageUrl: eventImage || null, 
            allowedVoters: [],
            startDate: start ? new Date(start) : null,
            endDate: end ? new Date(end) : null,
            createdAt: new Date(),
        };

        const eventResult = await db.collection("events").insertOne(newEvent);
        const eventId = eventResult.insertedId;

        // If candidates are provided, create them
        if (candidates && candidates.length > 0) {
            const candidateDocuments = candidates.map(candidate => ({
                ...candidate,
                eventId: eventId,
                votes: 0,
                weightedVotes: 0,
                createdAt: new Date()
            }));
            
            await db.collection("candidates").insertMany(candidateDocuments);
        }

        return NextResponse.json({message: "Event created successfully", eventId}, {status: 201});
    } catch (error){
        console.error('Event creation error:', error);
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