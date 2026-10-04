import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Delete this todo?')) onDelete(todo._id);
  };

  const startEdit = () => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setError('');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    try {
      await onEdit(todo._id, { title: title.trim(), description: description.trim() });
      setEditing(false);
    } catch {
      setError('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <li className="todo editing">
        <div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
          <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
          {error && <p className="field-error">{error}</p>}
        </div>
        <button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
      </li>
    );
  }

  return (
    <li className={todo.done ? 'todo done' : 'todo'}>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo._id)} />
      <div>
        <h3>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}
      </div>
      <button onClick={startEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}
