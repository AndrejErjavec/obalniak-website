'use server';

import clientPromise from '@/app/lib/mongodb';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

async function checkAuth() {
  // Retrieve JWT from cookies
  const sessionToken = cookies().get('session-token');
  if (!sessionToken) {
    return {
      isAuthenticated: false,
    };
  }

  try {
    // Verify the JWT using jsonwebtoken
    const decoded = jwt.verify(sessionToken.value, process.env.JWT_SECRET);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('bookit');
    const usersCollection = db.collection('users');

    // Find the user in the database using the decoded userId
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return {
        isAuthenticated: false,
      };
    }

    return {
      isAuthenticated: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.log('Authentication Error: ', error);
    return {
      isAuthenticated: false,
    };
  }
}

export default checkAuth;
