import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";


export async function GET(request){
    try{
        const client = await clientPromise;
        const db = client.db("votingApp");
        const events = await db.collection("events").find({}).sort({createdAt: -1}).toArray();
        return NextResponse.json(events);
    } catch(e){
        console.error(e);
        return NextResponse.json({error: "Error fetching events"}, {status: 500});
    }
}