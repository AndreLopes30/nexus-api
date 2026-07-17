import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login.jsx';
import Navbar from './components/Navbar.jsx';
import UserList from './components/UserList.jsx';
import TaskList from './components/TaskList.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));

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
    <BrowserRouter>
      <Navbar onLogout={handleLogout} />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/users" element={<UserList />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="*" element={<Navigate to="/tasks" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
