'use server';

import clientPromise from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';

async function createUser(previousState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');

  // Validate required fields
  if (!email || !name || !password) {
    return {
      error: 'Please fill in all fields',
    };
  }

  if (password.length < 8) {
    return {
      error: 'Password must be at least 8 characters long',
    };
  }

  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match',
    };
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('bookit');
    const usersCollection = db.collection('users');

    // Check if user with the same email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return {
        error: 'Email is already registered',
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword.toString(),  // Store hashed password
      createdAt: new Date(),
    });

    return {
      success: true,
      //userId: result.insertedId,
    };
  } catch (error) {
    console.log('Registration Error: ', error);
    return {
      error: 'Could not register user',
    };
  }
}

export default createUser;
