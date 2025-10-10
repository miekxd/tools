'use client';

import { useState } from 'react';
import ToolSidebar from '@/components/ToolSidebar';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTasks(prev => [...prev, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/6 bg-black/20 backdrop-blur-sm border-r border-purple-500/20 flex flex-col">
          <ToolSidebar />
        </div>

        {/* Main Content */}
        <div className="w-5/6 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  Task Manager
                </h1>
                <p className="text-gray-300 text-lg">
                  Organize your tasks with style
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                {/* Add Task Form */}
                <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      placeholder="Add a new task..."
                      className="flex-1 bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    />
                    <button
                      onClick={addTask}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                      Add Task
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{tasks.length}</div>
                    <div className="text-sm text-gray-300">Total</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{activeCount}</div>
                    <div className="text-sm text-gray-300">Active</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{completedCount}</div>
                    <div className="text-sm text-gray-300">Completed</div>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6">
                  {(['all', 'active', 'completed'] as const).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        filter === filterType
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-black/30 text-gray-300 hover:bg-purple-500/20 border border-purple-500/30'
                      }`}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                  ))}
                  {completedCount > 0 && (
                    <button
                      onClick={clearCompleted}
                      className="ml-auto px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all duration-200"
                    >
                      Clear Completed
                    </button>
                  )}
                </div>

                {/* Task List */}
                <div className="space-y-3">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        {filter === 'all' ? 'No tasks yet' : 
                         filter === 'active' ? 'No active tasks' : 
                         'No completed tasks'}
                      </h3>
                      <p className="text-gray-400">
                        {filter === 'all' ? 'Add your first task above!' : 
                         filter === 'active' ? 'All tasks are completed!' : 
                         'Complete some tasks to see them here.'}
                      </p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 transition-all duration-200 hover:bg-black/40 ${
                          task.completed ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              task.completed
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500'
                                : 'border-purple-400 hover:border-purple-300'
                            }`}
                          >
                            {task.completed && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          
                          <span className={`flex-1 transition-all duration-200 ${
                            task.completed 
                              ? 'line-through text-gray-400' 
                              : 'text-white'
                          }`}>
                            {task.text}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              {task.createdAt.toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
