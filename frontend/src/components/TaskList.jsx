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

  async function handleToggleDone(id, currentDone) {
    try {
      await updateTask(id, { done: !currentDone });
      load();
    } catch (e) {
      alert('Erro ao alterar conclusão: ' + (e.message || e));
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
      <style>{`
        .checkbox-round {
          appearance: none;
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #aaa;
          background: #fff;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .checkbox-round:checked {
          background: #4CAF50;
          border-color: #4CAF50;
        }
        .checkbox-round:focus {
          outline: none;
        }
        .checkbox-round:hover {
          border-color: #555;
        }
        .task-row.completed td:not(:first-child):not(:last-child) {
          text-decoration: line-through;
          color: #999;
        }
        .table td {
          vertical-align: middle;
        }
        .table td:first-child {
          text-align: center;
        }
      `}</style>
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
            <th>Concluída</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className={`task-row ${t.done ? 'completed' : ''}`}>
              <td>{t.id}</td>
              <td>
                {editingId === t.id ? (
                  <input value={edTitulo} onChange={(e) => setEdTitulo(e.target.value)} />
                ) : (
                  t.title
                )}
              </td>
              <td>
                {editingId === t.id ? (
                  <input value={edDescricao} onChange={(e) => setEdDescricao(e.target.value)} />
                ) : (
                  t.description || ''
                )}
              </td>
              <td>
                <input
                  type="checkbox"
                  className="checkbox-round"
                  checked={t.done}
                  onChange={() => handleToggleDone(t.id, t.done)}
                />
              </td>
              <td>
                {editingId === t.id ? (
                  <>
                    <button className="btn-save" onClick={() => handleUpdate(t.id)}>Salvar</button>
                    <button className="btn-cancel" onClick={() => { setEditingId(null); setEdTitulo(''); setEdDescricao(''); }}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn-edit" onClick={() => { setEditingId(t.id); setEdTitulo(t.title); setEdDescricao(t.description || ''); }}>Editar</button>
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
