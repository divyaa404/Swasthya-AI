import { BACKEND_URL } from '../config/api';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`GET Request to ${endpoint} failed: ${response.statusText}`);
    }
    const data = await response.json();
    return { data };
  },

  post: async (endpoint: string, body?: any) => {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`POST Request to ${endpoint} failed: ${response.statusText}`);
    }
    const data = await response.json();
    return { data };
  },
};
