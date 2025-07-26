import clientPromise from "../../../../../../lib/mongodb";
import { checkAdmin } from "../../../../../../lib/adminAuth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request, contextPromise) {
    const { params } = await contextPromise;
    const { candidateId } = await params;

    const adminCheck = await checkAdmin();
    if (adminCheck) return adminCheck;

    try {
        const { userId, name } = await request.json();
        const client = await clientPromise;
        const db = client.db("votingApp");

        await db.collection("candidates").updateOne(
            { _id: new ObjectId(candidateId) },
            { $addToSet: { members: { userId, name } } }
        );

        return NextResponse.json({ message: "Member added successfully" });
    } catch (error) {
        console.error("Failed to add member:", error);
        return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
    }
}