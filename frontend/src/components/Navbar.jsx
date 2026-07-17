export default function Navbar({ onLogout, page, setPage }) {
  return (
    <nav className="navbar">
      <button
        className={`nav-btn${page === 'tasks' ? ' active' : ''}`}
        onClick={() => setPage('tasks')}
      >
        Tarefas
      </button>
      <button
        className={`nav-btn${page === 'users' ? ' active' : ''}`}
        onClick={() => setPage('users')}
      >
        Usuários
      </button>
      <button className="logout-btn" onClick={onLogout}>Sair</button>
    </nav>
  );
}

