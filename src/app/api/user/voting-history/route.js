import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('votingApp');
    
    // Get user's votes with event and candidate details
    const votes = await db.collection('votes').aggregate([
      { 
        $match: { userId: session.user.id } 
      },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $lookup: {
          from: 'candidates',
          localField: 'candidateId',
          foreignField: '_id',
          as: 'candidate'
        }
      },
      {
        $unwind: '$event'
      },
      {
        $unwind: '$candidate'
      },
      {
        $project: {
          eventName: '$event.name',
          candidateName: '$candidate.name',
          votedAt: '$createdAt',
          weight: '$weight'
        }
      },
      {
        $sort: { votedAt: -1 }
      }
    ]).toArray();

    return NextResponse.json(votes);
  } catch (error) {
    console.error('Failed to fetch voting history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voting history' }, 
      { status: 500 }
    );
  }
}
