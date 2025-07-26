import clientPromise from "../../../../lib/mongodb";
import { sendEmail } from "../../../../lib/mailer";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email.endsWith("@chitkara.edu.in")) {
            return NextResponse.json({ error: "Only Chitkara University emails are allowed." }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("votingApp");

        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        await db.collection("otps").insertOne({
            email,
            otp: hashedOtp,
            expiresAt: otpExpiry,
        });

        await sendEmail({
            to: email,
            subject: "Your Verification Code",
            html: `<h1>Your OTP is: ${otp}</h1><p>This code will expire in 10 minutes.</p>`,
        });

        return NextResponse.json({ message: "OTP sent successfully." }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred." }, { status: 500 });
    }
}
