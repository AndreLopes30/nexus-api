const API_BASE = '';

function getToken() {
  return localStorage.getItem('access_token');
}

function sessionExpired() {
  localStorage.removeItem('access_token');
  window.dispatchEvent(new CustomEvent('session-expired'));
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    sessionExpired();
    throw new Error('Sessão expirada');
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    sessionExpired();
    throw new Error('Sessão expirada');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Erro desconhecido');
  }

  if (res.status === 204) return null;
  return res.json();
}

export function loginAPI(username, password) {
  const params = new URLSearchParams({ username, password });
  return fetch('/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  }).then((r) => {
    if (!r.ok) throw new Error('Credenciais inválidas');
    return r.json();
  });
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
