import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) return <p>No todos yet. Add one above.</p>;
  return (
    <ul>
      {todos.map((t) => (
        <TodoItem key={t._id} todo={t} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </ul>
  );
}
