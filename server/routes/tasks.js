const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// GET all tasks (for logged in user)
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new task
router.post('/', auth, async (req, res) => {
    const { title, description, status } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
        title,
        description,
        status,
        user: req.user // Get ID from auth middleware
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (update) a task
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.body.title != null) task.title = req.body.title;
        if (req.body.description != null) task.description = req.body.description;
        if (req.body.status != null) task.status = req.body.status;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
