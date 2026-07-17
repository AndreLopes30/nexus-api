import { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  setToken(token);
  return <div className="app-container"><h1>Nexus – Gestão de Tarefas</h1></div>;
}

export default App;
