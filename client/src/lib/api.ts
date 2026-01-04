// API configuration for different environments
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_URLS = {
  base: API_BASE,
  auth: {
    login: `${API_BASE}/api/auth/login`,
    register: `${API_BASE}/api/auth/register`,
    anonymous: `${API_BASE}/api/auth/anonymous`,
    me: `${API_BASE}/api/auth/me`,
  },
  sets: {
    list: `${API_BASE}/api/sets`,
    create: `${API_BASE}/api/sets`,
    get: `${API_BASE}/api/sets`,
    update: `${API_BASE}/api/sets`,
    delete: `${API_BASE}/api/sets`,
  },
  responses: {
    list: `${API_BASE}/api/responses`,
    submit: `${API_BASE}/api/responses`,
  },
  dashboard: {
    stats: `${API_BASE}/api/dashboard/stats`,
  },
} as const;

export function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}


