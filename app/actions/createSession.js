'use server';

import clientPromise from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function createSession(previousState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return {
      error: 'Please fill out all fields',
    };
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('bookit');
    const usersCollection = db.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return {
        error: 'Invalid Credentials',
      };
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        error: 'Invalid Credentials',
      };
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Store this secret in .env.local
      { expiresIn: '1h' }
    );
    // Set JWT in a secure cookie
    cookies().set('session-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour in seconds
      path: '/',
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log('Authentication Error: ', error);
    return {
      error: 'Invalid Credentials',
    };
  }
}

export default createSession;
