// src/app/api/events/[eventId]/candidates/route.js
import clientPromise from "../../../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/authOptions";
import { ObjectId } from "mongodb";

function isValidObjectId(id){
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(request, context){
  try{
    const {eventId} = await context.params;

    if(!isValidObjectId(eventId)){
      return NextResponse.json({error: "Invalid eventId"}, {status: 400});
    }

    const session = await getServerSession(authOptions);
    const userId= session?.user?.id;
    const client = await clientPromise;
    const db = client.db("votingApp");
    const eventObjectId = new ObjectId(eventId);

    const candidates = await db
    .collection("candidates")
    .find({eventId: eventObjectId})
    .toArray();

    const event = await db.collection("events").findOne({ _id: eventObjectId});

    let userVote = null;

    if(userId){
      userVote= await db.collection("votes").findOne({
        userId,
        eventId: eventObjectId,
      });
    }

    return NextResponse.json({
      candidates,
      votingOpen: event?.votingOpen ?? false,
      // ✅ CORRECTED LINE: Changed userHasVotes to userHasVoted
      userHasVoted: !!userVote,
      votedForCandidateId: userVote ? userVote.candidateId.toString() : null,

    });


  } catch(e){
    console.error("Error in /api/events/[eventId]/candidates: ", e);
    return NextResponse.json(
      {error: "Error fetching candidates"},
      {status: 500}
    );
  }
}