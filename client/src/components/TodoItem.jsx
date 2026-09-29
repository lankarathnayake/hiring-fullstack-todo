export default function TodoItem({ todo, onToggle, onDelete }) {
  const handleDelete = () => {
    if (window.confirm('Delete this todo?')) onDelete(todo._id);
  };

  return (
    <li className={todo.done ? 'todo done' : 'todo'}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo._id)}
      />
      <div>
        <h3>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}
      </div>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}
