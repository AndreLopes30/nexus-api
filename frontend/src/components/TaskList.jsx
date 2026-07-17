import { useState, useEffect } from 'react';
import { listTasks, createTask, updateTask, deleteTask } from '../api';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

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
    const t = title.trim();
    const d = description.trim();
    if (!t) return alert('Título obrigatório');
    try {
      await createTask({ title: t, description: d || null });
      setTitle('');
      setDescription('');
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleToggleDone(task) {
    try {
      await updateTask(task.id, { done: !task.done });
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleUpdate(id) {
    const payload = {};
    if (editTitle) payload.title = editTitle;
    if (editDesc) payload.description = editDesc;
    try {
      await updateTask(id, payload);
      setEditId(null);
      setEditTitle('');
      setEditDesc('');
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir tarefa?')) return;
    try {
      await deleteTask(id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div>
      <h2>Tarefas</h2>
      <form className="form-row" onSubmit={handleCreate}>
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Criar</button>
      </form>
      <div className="task-list">
        {tasks.map((t) => (
          <div key={t.id} className={`task-item${t.done ? ' completed' : ''}`}>
            <input
              type="checkbox"
              className="task-checkbox"
              checked={t.done}
              onChange={() => handleToggleDone(t)}
            />
            {editId === t.id ? (
              <div className="edit-row">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
                <button onClick={() => handleUpdate(t.id)}>Salvar</button>
                <button
                  onClick={() => {
                    setEditId(null);
                    setEditTitle('');
                    setEditDesc('');
                  }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="task-info">
                <span className="task-id">#{t.id}</span>
                <span className="task-title">{t.title}</span>
                <span className="task-desc">{t.description || ''}</span>
              </div>
            )}
            {editId !== t.id && (
              <div className="task-actions">
                <button
                  onClick={() => {
                    setEditId(t.id);
                    setEditTitle(t.title);
                    setEditDesc(t.description || '');
                  }}
                >
                  Editar
                </button>
                <button className="delete" onClick={() => handleDelete(t.id)}>
                  Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
