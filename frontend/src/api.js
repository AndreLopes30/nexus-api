const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('access_token');
}

async function request(url, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

export function loginAPI(username, password) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  }).then(r => r.json());
}

export function listUsers() {
  return request('/users/');
}

export function createUser(data) {
  return request('/users/', { method: 'POST', body: JSON.stringify(data) });
}

export function updateUser(id, data) {
  return request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteUser(id) {
  return request(`/users/${id}`, { method: 'DELETE' });
}

export function listTasks() {
  return request('/tasks/');
}

export function createTask(data) {
  return request('/tasks/', { method: 'POST', body: JSON.stringify(data) });
}

export function updateTask(id, data) {
  return request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE' });
}

export function getTask(id) {
  return request(`/tasks/${id}`);
}
