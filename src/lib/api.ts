const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function login(email: string, password: string) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(email: string, password: string, full_name: string) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name }),
  });
}

export async function getProfile() {
  return apiRequest('/api/profiles');
}

export async function updateProfile(updates: { full_name?: string; default_warehouse?: string }) {
  return apiRequest('/api/profiles', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function logout() {
  localStorage.removeItem('token');
}


