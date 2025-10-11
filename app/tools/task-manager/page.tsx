'use client';

import { useState, useEffect } from 'react';
import ToolSidebar from '@/components/ToolSidebar';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export default function TaskManagerPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user and fetch tasks
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchTasks();
      } else {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // Fetch tasks from database
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const addTask = async () => {
    if (!newTask.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            user_id: user.id,
            text: newTask.trim(),
            completed: false,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [data, ...prev]);
      setNewTask('');
    } catch (error: any) {
      setError(error.message);
      console.error('Error adding task:', error);
    }
  };

  // Toggle task completion
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error: any) {
      setError(error.message);
      console.error('Error toggling task:', error);
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error: any) {
      setError(error.message);
      console.error('Error deleting task:', error);
    }
  };

  // Clear completed tasks
  const clearCompleted = async () => {
    const completedIds = tasks.filter(t => t.completed).map(t => t.id);
    if (completedIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', completedIds);

      if (error) throw error;

      setTasks(prev => prev.filter(t => !t.completed));
    } catch (error: any) {
      setError(error.message);
      console.error('Error clearing completed tasks:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active': return !task.completed;
      case 'completed': return task.completed;
      default: return true;
    }
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.filter(task => !task.completed).length;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Please sign in to use Task Manager
          </h1>
          <a href="/sign-in" className="text-purple hover:opacity-80">
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <ToolSidebar />
        </div>

        {/* Main Content - ClickUp Style */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b px-8 py-6" style={{ borderColor: 'var(--border-primary)' }}>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Tasks
            </h1>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple">{tasks.length}</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple">{activeCount}</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple">{completedCount}</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Completed</span>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="border-b px-8 py-3 flex items-center justify-between" style={{ 
            borderColor: 'var(--border-primary)',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <div className="flex gap-2">
              {(['all', 'active', 'completed'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className="px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: filter === filterType ? 'var(--purple-primary)' : 'transparent',
                    color: filter === filterType ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-4 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                Clear Completed
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-4 p-3 rounded-lg" style={{ 
              backgroundColor: '#FEE2E2',
              borderColor: '#FCA5A5',
              borderWidth: '1px'
            }}>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-xs text-red-500 hover:text-red-600 mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Task List */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {/* Add Task Input - ClickUp Style */}
            <div className="mb-6">
              <div className="flex items-center gap-3 group">
                <button
                  className="w-5 h-5 rounded border-2 flex-shrink-0 transition-colors duration-200"
                  style={{
                    borderColor: 'var(--purple-secondary)'
                  }}
                >
                  <svg className="w-3 h-3 m-auto" style={{ color: 'var(--purple-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Add a task..."
                  className="flex-1 px-0 py-2 border-0 focus:outline-none focus:ring-0 text-base"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner mx-auto mb-4"></div>
                <p style={{ color: 'var(--text-secondary)' }}>Loading tasks...</p>
              </div>
            ) : (
              /* Tasks */
              <div className="space-y-1">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {filter === 'all' ? 'No tasks yet' : 
                       filter === 'active' ? 'No active tasks' : 
                       'No completed tasks'}
                    </h3>
                    <p style={{ color: 'var(--text-tertiary)' }} className="text-sm">
                      {filter === 'all' ? 'Add your first task above!' : 
                       filter === 'active' ? 'All tasks are completed!' : 
                       'Complete some tasks to see them here.'}
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group hover:bg-secondary"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200"
                        style={{
                          backgroundColor: task.completed ? 'var(--purple-primary)' : 'transparent',
                          borderColor: task.completed ? 'var(--purple-primary)' : 'var(--purple-secondary)',
                        }}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      
                      <span 
                        className={`flex-1 transition-all duration-200 ${task.completed ? 'line-through' : ''}`}
                        style={{ 
                          color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)'
                        }}
                      >
                        {task.text}
                      </span>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 rounded hover:bg-tertiary transition-colors duration-200"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
