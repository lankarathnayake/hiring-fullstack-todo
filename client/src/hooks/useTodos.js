import { useState, useEffect } from 'react';
import { getTodos, createTodo, toggleDone, deleteTodo } from '../api/todos';

export default function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Could not load todos. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  const addTodo = async (data) => {
    const created = await createTodo(data);
    setTodos((prev) => [created, ...prev]);
  };

  const toggleTodo = async (id) => {
    const previous = todos;
    setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, done: !t.done } : t)));
    try {
      await toggleDone(id);
    } catch {
      setTodos(previous);
      setActionError('Could not update the todo. Please try again.');
    }
  };

  const removeTodo = async (id) => {
    const previous = todos;
    setTodos((prev) => prev.filter((t) => t._id !== id));
    try {
      await deleteTodo(id);
    } catch {
      setTodos(previous);
      setActionError('Could not delete the todo. Please try again.');
    }
  };

  return { todos, loading, error, actionError, dismissActionError: () => setActionError(''), addTodo, toggleTodo, removeTodo };
}
