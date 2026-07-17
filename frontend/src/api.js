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
    let body;
    try {
      body = await res.json();
    } catch {
      body = { detail: await res.text() };
    }
    const detail = body?.detail;
    // If the backend returns a list of validation errors (422)
    if (Array.isArray(detail)) {
      const msgs = detail
        .map((err) => {
          const loc = err.loc ? err.loc.join('.') : '';
          const msg = err.msg || '';
          return `${loc}: ${msg}`;
        })
        .join('\n');
      throw new Error(msgs);
    }
    throw new Error(detail || `HTTP ${res.status}`);
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
