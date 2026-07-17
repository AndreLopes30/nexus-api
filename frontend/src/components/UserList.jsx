import { useState, useEffect } from 'react';
import { listUsers, createUser, updateUser, deleteUser } from '../api';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSenha, setEditSenha] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const n = nome.trim();
    const em = email.trim();
    const s = senha.trim();
    if (!n || !em || !s) return alert('Preencha todos os campos');
    try {
      await createUser({ nome: n, email: em, senha: s });
      setNome('');
      setEmail('');
      setSenha('');
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleUpdate(id) {
    const payload = {};
    if (editNome) payload.nome = editNome;
    if (editEmail) payload.email = editEmail;
    if (editSenha) payload.senha = editSenha;
    try {
      await updateUser(id, payload);
      setEditId(null);
      setEditNome('');
      setEditEmail('');
      setEditSenha('');
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir usuário?')) return;
    try {
      await deleteUser(id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div>
      <h2>Usuários</h2>
      <form className="form-row" onSubmit={handleCreate}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <button type="submit">Criar</button>
      </form>
      <div className="user-list">
        {users.map((u) => (
          <div key={u.id} className="user-item">
            <span className="user-id">#{u.id}</span>
            {editId === u.id ? (
              <div className="edit-row">
                <input value={editNome} onChange={(e) => setEditNome(e.target.value)} />
                <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                <input type="password" value={editSenha} onChange={(e) => setEditSenha(e.target.value)} placeholder="Nova senha" />
                <button onClick={() => handleUpdate(u.id)}>Salvar</button>
                <button onClick={() => { setEditId(null); setEditNome(''); setEditEmail(''); setEditSenha(''); }}>Cancelar</button>
              </div>
            ) : (
              <div className="user-info">
                <span>{u.nome}</span>
                <span className="user-email">{u.email}</span>
              </div>
            )}
            {editId !== u.id && (
              <div className="user-actions">
                <button onClick={() => { setEditId(u.id); setEditNome(u.nome); setEditEmail(u.email); }}>Editar</button>
                <button className="delete" onClick={() => handleDelete(u.id)}>Excluir</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
