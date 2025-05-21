// app/utils/env.ts
// Client-safe environment variables

export const ENV = {
  API_BASE_URL: typeof process !== 'undefined' 
    ? process.env.API_BASE_URL || 'http://localhost:3000/api/v1'
    : 'http://localhost:3000/api/v1',
  ACTION_CABLE_URL: typeof process !== 'undefined'
    ? process.env.ACTION_CABLE_URL || 'ws://localhost:3000/cable'
    : 'ws://localhost:3000/cable',
};
