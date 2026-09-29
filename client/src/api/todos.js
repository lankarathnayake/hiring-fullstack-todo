import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getTodos = () => api.get('/todos').then((res) => res.data);

export const createTodo = (data) => api.post('/todos', data).then((res) => res.data);

export const updateTodo = (id, data) => api.put(`/todos/${id}`, data).then((res) => res.data);

export const toggleDone = (id) => api.patch(`/todos/${id}/done`).then((res) => res.data);

export const deleteTodo = (id) => api.delete(`/todos/${id}`);
