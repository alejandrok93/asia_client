// app/utils/api.server.ts
import axios from 'axios';
import { json } from '@remix-run/node';

// Use a direct string here for server-side code to avoid process.env issues
const API_BASE_URL = 'http://localhost:3000/api/v1';

export const createApiClient = (token?: string) => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  // Add response interceptor for error handling
  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Handle unauthorized errors
        // We'll handle this in the auth logic
      }
      return Promise.reject(error);
    }
  );

  console.log('api client', client)

  return client;
};

// Helper function to handle API errors
export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'An unexpected error occurred';

    throw json({ message }, { status });
  }

  throw json({ message: 'An unexpected error occurred' }, { status: 500 });
}
