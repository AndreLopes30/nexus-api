import { useState } from 'react';
import Login from './components/Login.jsx';
import Navbar from './components/Navbar.jsx';
import UserList from './components/UserList.jsx';
import TaskList from './components/TaskList.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [page, setPage] = useState('tasks');

  const handleLogin = (t) => {
    localStorage.setItem('access_token', t);
    setToken(t);
  };
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <Navbar onLogout={handleLogout} page={page} setPage={setPage} />
      <div style={{ padding: 20 }}>
        {page === 'users' ? <UserList /> : <TaskList />}
      </div>
    </div>
  );
}

export default App;
