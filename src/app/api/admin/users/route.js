import clientPromise from "../../../../lib/mongodb";
import { checkAdmin } from "../../../../lib/adminAuth";
import { NextResponse } from "next/server";

export async function GET(request){
    const adminCheck = await checkAdmin();
    if (adminCheck) return adminCheck;

    try{
        const client = await clientPromise;
        const db = client.db("votingApp");
        const users = await db.collection("users").find({}, { projection: {password: 0}}).toArray();
        return NextResponse.json(users);
    }catch(error){
        return NextResponse.json({error: "Failed to fetch users"}, {status: 500});
    }
}