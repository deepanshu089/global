import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trash2, CheckCircle2, Clock, Circle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="text-green-500" size={20} />;
    case 'in-progress': return <Clock className="text-blue-500" size={20} />;
    default: return <Circle className="text-slate-500" size={20} />;
  }
};

const TaskList = ({ tasks, setTasks, token }) => {

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'in-progress' 
      : currentStatus === 'in-progress' ? 'completed' 
      : 'pending';

    try {
      const res = await api.put(`/tasks/${id}`, { status: nextStatus }, {
         headers: { 'Authorization': `Bearer ${token}` }
      });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500 glass rounded-2xl">
        <div className="flex justify-center mb-4">
          <AlertCircle size={48} className="text-slate-600" />
        </div>
        <h3 className="text-lg font-medium">No tasks yet</h3>
        <p>Get started by adding a new task above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className={`glass p-5 rounded-xl border-l-4 transition-all hover:bg-slate-800/80 group ${
              task.status === 'completed' ? 'border-l-green-500 opacity-75' 
              : task.status === 'in-progress' ? 'border-l-blue-500' 
              : 'border-l-slate-600'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <button 
                    onClick={() => handleStatusUpdate(task._id, task.status)}
                    className="hover:scale-110 transition-transform"
                    title="Click to change status"
                  >
                    <StatusIcon status={task.status} />
                  </button>
                  <h3 className={`text-lg font-medium truncate ${
                    task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-100'
                  }`}>
                    {task.title}
                  </h3>
                </div>
                {task.description && (
                  <p className="text-slate-400 text-sm ml-8 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="ml-8 mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className={`px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                     task.status === 'completed' ? 'bg-green-500/10 text-green-500' 
                     : task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' 
                     : 'bg-slate-500/10 text-slate-500'
                  }`}>
                    {task.status}
                  </span>
                  <span>•</span>
                  <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(task._id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-2 hover:bg-red-400/10 rounded-lg"
                title="Delete Task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
