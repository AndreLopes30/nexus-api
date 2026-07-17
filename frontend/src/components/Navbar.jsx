import { Link } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  return (
    <nav style={{ padding: 10, background: '#eee', display: 'flex', alignItems: 'center', gap: 15 }}>
      <Link to="/tasks">Tarefas</Link>
      <Link to="/users">Usuários</Link>
      <button onClick={onLogout} style={{ marginLeft: 'auto' }}>Sair</button>
    </nav>
  );
}
