import { useState, useEffect, useRef } from 'react';
import { listTasks, createTask, updateTask, deleteTask } from '../api';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [edTitulo, setEdTitulo] = useState('');
  const [edDescricao, setEdDescricao] = useState('');

  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    load();
  }, []);

  async function load() {
    try {
      const data = await listTasks();
      setTasks(data);
    } catch (e) {
      if (e.message && e.message.includes('Sessão expirada')) {
        return;
      }
      alert(e.message);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const titleTrim = titulo.trim();
    if (!titleTrim) {
      alert('O título é obrigatório');
      return;
    }
    const descriptionTrim = descricao.trim() || null;
    try {
      const payload = { title: titleTrim };
      if (descriptionTrim) payload.description = descriptionTrim;
      await createTask(payload);
      setTitulo('');
      setDescricao('');
      load();
    } catch (e) {
      alert('Erro ao criar tarefa: ' + (e.message || e));
    }
  }

  async function handleUpdate(id) {
    try {
      const payload = {};
      if (edTitulo) payload.title = edTitulo;
      if (edDescricao) payload.description = edDescricao;
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
      <form className="form-row" onSubmit={handleCreate}>
        <input placeholder="Título (obrigatório)" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <input placeholder="Descrição (opcional)" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <button type="submit">Criar</button>
      </form>
      <table className="table">
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
                  <input value={edTitulo} onChange={(e) => setEdTitulo(e.target.value)} />
                ) : (
                  t.titulo
                )}
              </td>
              <td>
                {editingId === t.id ? (
                  <input value={edDescricao} onChange={(e) => setEdDescricao(e.target.value)} />
                ) : (
                  t.descricao || ''
                )}
              </td>
              <td>
                {editingId === t.id ? (
                  <>
                    <button className="btn-save" onClick={() => handleUpdate(t.id)}>Salvar</button>
                    <button className="btn-cancel" onClick={() => { setEditingId(null); setEdTitulo(''); setEdDescricao(''); }}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn-edit" onClick={() => { setEditingId(t.id); setEdTitulo(t.titulo); setEdDescricao(t.descricao || ''); }}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(t.id)}>Excluir</button>
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
