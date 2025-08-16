import clientPromise from "../../../../../lib/mongodb";
import { checkAdmin } from "../../../../../lib/adminAuth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
    const adminCheck = await checkAdmin();
    if (adminCheck) return adminCheck;

    try {
        const { userId } = await params;
        
        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json({error: "Invalid user ID"}, {status: 400});
        }

        const client = await clientPromise;
        const db = client.db("votingApp");
        
        // Don't allow deleting yourself
        const session = await getServerSession(authOptions);
        if (session?.user?.id === userId) {
            return NextResponse.json({error: "Cannot delete your own account"}, {status: 400});
        }

        const result = await db.collection("users").deleteOne({
            _id: new ObjectId(userId)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        return NextResponse.json({message: "User deleted successfully"});
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({error: "Failed to delete user"}, {status: 500});
    }
}

export async function PATCH(request, { params }) {
    const adminCheck = await checkAdmin();
    if (adminCheck) return adminCheck;

    try {
        const { userId } = await params;
        const body = await request.json();
        
        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json({error: "Invalid user ID"}, {status: 400});
        }

        const { role } = body;
        
        if (!role || !['user', 'admin'].includes(role)) {
            return NextResponse.json({error: "Invalid role. Must be 'user' or 'admin'"}, {status: 400});
        }

        const client = await clientPromise;
        const db = client.db("votingApp");
        
        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: { role: role, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        return NextResponse.json({message: "User role updated successfully"});
    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json({error: "Failed to update user role"}, {status: 500});
    }
}
