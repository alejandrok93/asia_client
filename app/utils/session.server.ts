// app/utils/session.server.ts
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { createApiClient, handleApiError } from './api.server';
import type { User } from '~/types';

// Define session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'asia_ai_session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'default-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
});

// Get user session
export async function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'));
}

// Get user token from session
export async function getUserToken(request: Request) {
  const session = await getUserSession(request);
  const token = session.get('token');
  return token;
}

// Get logged in user
export async function getUser(request: Request): Promise<User | null> {
  const token = await getUserToken(request);
  if (!token) return null;

  try {
    const api = createApiClient(token);
    const response = await api.get('/user');
    return response.data.data;
  } catch (error) {
    // Token might be invalid
    return null;
  }
}

// Login user
export async function login(email: string, password: string) {
  try {
    const api = createApiClient();
    const response = await api.post('/users/sign_in', {
      user: { email, password }
    });

    // Extract token from headers or response
    const token = response.headers.authorization?.replace('Bearer ', '')
      || response.data.token;

    if (!token) {
      throw new Error('No token received from the API');
    }

    return {
      token,
      user: response.data.data
    };
  } catch (error) {
    handleApiError(error);
  }
}

// Create and commit session
export async function createUserSession(token: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set('token', token);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  });
}

// Logout user
export async function logout(request: Request) {
  const token = await getUserToken(request);
  const session = await getUserSession(request);

  if (token) {
    try {
      // Call logout endpoint on API
      const api = createApiClient(token);
      await api.delete('/users/sign_out');
    } catch (error) {
      console.error('Error during API logout:', error);
      // Continue with logout process even if API call fails
    }
  }

  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}

// Require auth
export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const user = await getUser(request);

  if (!user) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return user;
}
