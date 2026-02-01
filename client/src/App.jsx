import React, { useState, useEffect, useContext } from 'react';
import api from './api/axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthContext } from './context/AuthContext';
import { Layout, LogOut, User } from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const { userData, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, [userData.token]);

  const fetchTasks = async () => {
    if (!userData.token) return;
    
    try {
      const res = await api.get('/tasks', {
        headers: { 'Authorization': `Bearer ${userData.token}` }
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const addTask = async (taskData) => {
     try {
      const res = await api.post('/tasks', {
        ...taskData,
        status: 'pending'
      }, {
        headers: { 'Authorization': `Bearer ${userData.token}` }
      });
      handleTaskAdded(res.data);
      return res.data;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };
  
  // Custom TaskForm wrapper to handle the API call here or pass token
  const AuthenticatedTaskForm = () => {
      // Modify TaskForm to accept an onSubmit prop or pass connection details
      // Better to keep TaskForm simple and handle logic here, or refactor TaskForm
      // Let's refactor TaskForm props actually.
      // For now, I'll pass a custom handler to TaskForm that includes the token logic
      return <TaskForm onTaskAdded={handleTaskAdded} token={userData.token} />
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 p-4 md:p-8 overflow-hidden relative">
       <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="mb-10">
          <div className="flex justify-between items-start">
             <div>
                <div className="inline-flex items-center gap-3 mb-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-primary-400 font-medium">
                    <Layout size={16} />
                    <span>Task Management System</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Get Things Done
                </h1>
             </div>
             <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                     <p className="text-sm text-slate-400">Welcome back,</p>
                     <p className="font-medium text-slate-200">{userData.user.username}</p>
                 </div>
                 <button 
                    onClick={logout}
                    className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-all"
                    title="Logout"
                 >
                     <LogOut size={20} />
                 </button>
             </div>
          </div>
        </header>

        <TaskForm onTaskAdded={handleTaskAdded} token={userData.token} />
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-semibold text-slate-200">Your Tasks</h2>
            <span className="text-sm text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
            </span>
          </div>
          <TaskList tasks={tasks} setTasks={setTasks} token={userData.token} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const { userData, loading } = useContext(AuthContext);

  if (loading) return null; // Or a loading spinner

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={userData.user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={!userData.user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!userData.user ? <Signup /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
