import { useState, useEffect } from 'react';
import { listUsers, createUser, updateUser, deleteUser } from '../api';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [edNome, setEdNome] = useState('');
  const [edSenha, setEdSenha] = useState('');

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
    try {
      await createUser({ nome, senha });
      setNome('');
      setSenha('');
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleUpdate(id) {
    try {
      const payload = {};
      if (edNome) payload.nome = edNome;
      if (edSenha) payload.senha = edSenha;
      await updateUser(id, payload);
      setEditingId(null);
      setEdNome('');
      setEdSenha('');
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir este usuário?')) return;
    try {
      await deleteUser(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div>
      <h2>Usuários</h2>
      <form className="form-row" onSubmit={handleCreate}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <button type="submit">Criar</button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                {editingId === u.id ? (
                  <input value={edNome} onChange={(e) => setEdNome(e.target.value)} />
                ) : (
                  u.nome
                )}
              </td>
              <td>
                {editingId === u.id ? (
                  <>
                    <button className="btn-save" onClick={() => handleUpdate(u.id)}>Salvar</button>
                    <button className="btn-cancel" onClick={() => { setEditingId(null); setEdNome(''); setEdSenha(''); }}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn-edit" onClick={() => { setEditingId(u.id); setEdNome(u.nome); }}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(u.id)}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
