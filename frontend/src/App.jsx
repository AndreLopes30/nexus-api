import { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import TaskList from './components/TaskList';
import UserList from './components/UserList';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [page, setPage] = useState('tasks');

  const handleLogin = (t) => {
    localStorage.setItem('access_token', t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  useEffect(() => {
    const handler = () => handleLogout();
    window.addEventListener('session-expired', handler);
    return () => window.removeEventListener('session-expired', handler);
  }, []);

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <div className="app-wrapper">
      <Navbar onLogout={handleLogout} page={page} setPage={setPage} />
      <main className="main-content">
        {page === 'tasks' ? <TaskList /> : <UserList />}
      </main>
    </div>
  );
}

export default App;
