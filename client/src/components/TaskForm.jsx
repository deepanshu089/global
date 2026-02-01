import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const TaskForm = ({ onTaskAdded, token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const res = await api.post('/tasks', {
        title,
        description,
        status: 'pending'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onTaskAdded(res.data);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <div className="w-2 h-8 bg-primary-500 rounded-full"/>
        Create New Task
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-[100px] resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading || !title.trim()}
            className="btn-primary flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
            ) : (
              <Plus size={20} />
            )}
            Add Task
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;
