import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if(!session || session.user.role !=='admin'){
        return NextResponse.json({error: "Unauthorized"}, {status: 403});

    }
    return null;
}