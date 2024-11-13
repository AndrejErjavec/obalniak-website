'use server';

import { cookies } from 'next/headers';

async function destroySession() {
  // Retrieve the session cookie
  const sessionCookie = cookies().get('session-token');

  if (!sessionCookie) {
    return {
      error: 'No session cookie found',
    };
  }

  try {
    // Clear the JWT session cookie
    cookies().delete('session-token');

    return {
      success: true,
    };
  } catch (error) {
    console.log('Error deleting session cookie: ', error);
    return {
      error: 'Error deleting session',
    };
  }
}

export default destroySession;
