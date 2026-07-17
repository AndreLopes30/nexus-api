import { useState, useEffect } from 'react';
import { listTasks, createTask, updateTask, deleteTask } from '../api';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [edTitulo, setEdTitulo] = useState('');
  const [edDescricao, setEdDescricao] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await listTasks();
      setTasks(data);
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const payload = { titulo };
      if (descricao) payload.descricao = descricao;
      await createTask(payload);
      setTitulo('');
      setDescricao('');
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleUpdate(id) {
    try {
      const payload = {};
      if (edTitulo) payload.titulo = edTitulo;
      if (edDescricao) payload.descricao = edDescricao;
      await updateTask(id, payload);
      setEditingId(null);
      setEdTitulo('');
      setEdDescricao('');
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir esta tarefa?')) return;
    try {
      await deleteTask(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div>
      <h2>Tarefas</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
        <input
          placeholder="Título (obrigatório)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          style={{ marginRight: 8, padding: 4 }}
        />
        <input
          placeholder="Descrição (opcional)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={{ marginRight: 8, padding: 4 }}
        />
        <button type="submit">Criar</button>
      </form>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>
                {editingId === t.id ? (
                  <input
                    value={edTitulo}
                    onChange={(e) => setEdTitulo(e.target.value)}
                    style={{ padding: 2 }}
                  />
                ) : (
                  t.titulo
                )}
              </td>
              <td>
                {editingId === t.id ? (
                  <input
                    value={edDescricao}
                    onChange={(e) => setEdDescricao(e.target.value)}
                    style={{ padding: 2 }}
                  />
                ) : (
                  t.descricao || ''
                )}
              </td>
              <td>
                {editingId === t.id ? (
                  <>
                    <button onClick={() => handleUpdate(t.id)} style={{ marginRight: 4 }}>
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEdTitulo('');
                        setEdDescricao('');
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(t.id);
                        setEdTitulo(t.titulo);
                        setEdDescricao(t.descricao || '');
                      }}
                      style={{ marginRight: 4 }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDelete(t.id)}>Excluir</button>
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
