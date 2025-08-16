import clientPromise from "../../../../lib/mongodb";
import { checkAdmin } from "../../../../lib/adminAuth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

export async function PUT(request) {
    const adminCheck = await checkAdmin();
    if (adminCheck) return adminCheck;

    try {
        const { userId, role } = await request.json();

        if (!userId || !role || !['admin', 'user'].includes(role)) {
            return NextResponse.json({ error: "Invalid user ID or role" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("votingApp");

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { 
                $set: { 
                    role: role,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User role updated successfully" });
    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const adminCheck = await checkAdmin();
    if (adminCheck) return adminCheck;

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("votingApp");

        const result = await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}