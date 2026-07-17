export default function Navbar({ onLogout, page, setPage }) {
  return (
    <nav style={{ padding: 10, background: '#eee', display: 'flex', alignItems: 'center', gap: 15 }}>
      <button
        onClick={() => setPage('tasks')}
        style={btnStyle(page === 'tasks')}
      >
        Tarefas
      </button>
      <button
        onClick={() => setPage('users')}
        style={btnStyle(page === 'users')}
      >
        Usuários
      </button>
      <button onClick={onLogout} style={{ marginLeft: 'auto' }}>Sair</button>
    </nav>
  );
}

function btnStyle(active) {
  return {
    background: active ? '#ddd' : 'transparent',
    border: 'none',
    padding: '4px 8px',
    cursor: 'pointer',
  };
}
