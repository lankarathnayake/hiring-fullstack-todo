import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onAdd({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    } catch {
      setError('Could not add todo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={100}
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        maxLength={500}
      />
      <button type="submit" disabled={saving}>
        {saving ? 'Adding...' : 'Add'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
