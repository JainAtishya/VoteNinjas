import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password, contactNumber, otp } = await request.json();

    if (!name || !email || !password || !contactNumber || !otp) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("votingApp");
    const otpRecord = await db.collection("otps").findOne({ email }, { sort: { expiresAt: -1 } });

    if (!otpRecord) {
      return NextResponse.json({ error: "No OTP found for this email. Please request one." }, { status: 404 });
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 410 }); // 410 Gone
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      return NextResponse.json({ error: "Invalid OTP." }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      createdAt: new Date(),
    });

    await db.collection("otps").deleteOne({ _id: otpRecord._id });

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred during registration." }, { status: 500 });
  }
}
