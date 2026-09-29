const mongoose = require('mongoose');
const Todo = require('../models/Todo');

const notFound = (res) => res.status(404).json({ message: 'Todo not found' });

//GET
exports.getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    next(err);
  }
};

//POST
exports.createTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({ title, description });
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

//PUT
exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return notFound(res);

    const { title, description } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );
    if (!todo) return notFound(res);
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

//PATCH
exports.toggleDone = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return notFound(res);

    const todo = await Todo.findById(id);
    if (!todo) return notFound(res);
    todo.done = !todo.done;
    await todo.save();
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

//DELETE
exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return notFound(res);

    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return notFound(res);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};