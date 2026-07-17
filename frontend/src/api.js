const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('access_token');
}

function forceLogout() {
  localStorage.removeItem('access_token');
  window.location.reload();
}

async function request(url, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // No token stored, cannot make authenticated requests
    throw new Error('Sessão expirada. Faça login novamente.');
  }
  console.log('[request] URL:', `${API_BASE}${url}`, 'Token:', token ? token.slice(0,10)+'...' : 'none');
  let res;
  try {
    res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  } catch (e) {
    throw new Error(`Não foi possível conectar ao servidor (${API_BASE}${url}). Verifique se o backend está rodando em http://localhost:8000`);
  }
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
    // If the error is due to authentication, force logout and refresh
    // (also handles cases where the status code is 422 but the detail indicates authentication failure)
    if (res.status === 401 || (typeof detail === 'string' && detail.includes('Not authenticated'))) {
      forceLogout();
      // Prevent further code after reload
      throw new Error('Sessão expirada. Faça login novamente.');
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
