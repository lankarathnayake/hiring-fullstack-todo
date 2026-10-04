import useTodos from './hooks/useTodos';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import ErrorBanner from './components/ErrorBanner';
import './App.css';

function App() {
  const { 
    todos, 
    loading, 
    error, 
    addTodo, 
    toggleTodo, 
    removeTodo, 
    actionError, 
    dismissActionError, 
    editTodo 
  } = useTodos();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Todos</h1>
      <ErrorBanner message={actionError} onDismiss={dismissActionError} />
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={removeTodo} onEdit={editTodo} />
    </div>
  );
}

export default App;
