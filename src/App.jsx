import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoFilter from './components/TodoFilter';
import TodoList from './components/TodoList';
import todoApi from './api/todoApi';

function App() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');

  // Collect all unique categories from todos
  const categoryOptions = Array.from(
    new Set(
      todos.flatMap(todo => (todo.categories ? todo.categories.split(',') : []))
    )
  ).filter(Boolean);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    let result = [...todos];
    if (activeFilter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (activeFilter === 'completed') {
      result = result.filter(todo => todo.completed);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        todo =>
          todo.title.toLowerCase().includes(query) ||
          todo.description.toLowerCase().includes(query)
      );
    }
    if (categoryFilter) {
      result = result.filter(todo =>
        todo.categories && todo.categories.split(',').includes(categoryFilter)
      );
    }
    if (dueDateFilter) {
      result = result.filter(todo => todo.dueDate === dueDateFilter);
    }
    result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        return priorityValues[b.priority] - priorityValues[a.priority];
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    setFilteredTodos(result);
  }, [todos, activeFilter, searchQuery, sortBy, categoryFilter, dueDateFilter]);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await todoApi.getAllTodos();
      setTodos(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todoData) => {
    try {
      const newTodo = await todoApi.createTodo(todoData);
      if (newTodo) {
        setTodos(prev => [...prev, newTodo]);
        setShowForm(false);
        toast.success('Task added successfully');
      }
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const handleUpdateTodo = async (todoData) => {
    if (!editingTodo) return;
    try {
      const updatedTodo = await todoApi.updateTodo(editingTodo.id, todoData);
      if (updatedTodo) {
        setTodos(prev =>
          prev.map(todo => (todo.id === editingTodo.id ? updatedTodo : todo))
        );
        setEditingTodo(null);
        toast.success('Task updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleToggleTodo = async (id, completed) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
    try {
      await todoApi.toggleTodoStatus(id, completed);
      toast.success(completed ? 'Task completed!' : 'Task marked as active');
    } catch (error) {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTodo = async (id) => {
    const prevTodos = [...todos];
    setTodos(prev => prev.filter(todo => todo.id !== id));
    try {
      const success = await todoApi.deleteTodo(id);
      if (success) {
        toast.success('Task deleted');
      } else {
        setTodos(prevTodos);
        toast.error('Failed to delete task');
      }
    } catch (error) {
      setTodos(prevTodos);
      toast.error('Failed to delete task');
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const taskCount = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length
  };

  return (
    <div className="min-h-screen pb-10">
      <Toaster position="top-right" />
      <Header
        onAddNewClick={() => setShowForm(true)}
        taskCount={taskCount}
      />
      <main className="container mx-auto max-w-4xl px-4">
        {(showForm || editingTodo) && (
          <TodoForm
            onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
            onCancel={handleFormCancel}
            initialData={editingTodo || undefined}
            isEditing={!!editingTodo}
          />
        )}
        <TodoFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          dueDateFilter={dueDateFilter}
          onDueDateFilterChange={setDueDateFilter}
          categoryOptions={categoryOptions}
        />
        {loading ? (
          <div className="flex justify-center my-10">
            <span className="loader"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Categories</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Priority</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTodos.map(todo => {
                  // Color coding for due date
                  let dueDateClass = '';
                  if (todo.dueDate) {
                    const today = new Date();
                    const due = new Date(todo.dueDate);
                    const diff = (due.setHours(0,0,0,0) - today.setHours(0,0,0,0)) / (1000*60*60*24);
                    if (diff === 0) dueDateClass = 'text-red-500 font-bold';
                    else if (diff === -1) dueDateClass = 'text-orange-500 font-bold';
                  }
                  return (
                    <tr key={todo.id} className={todo.completed ? 'opacity-60' : ''}>
                      <td className="px-4 py-2">
                        <span className={todo.completed ? 'line-through' : ''}>{todo.title}</span>
                      </td>
                      <td className="px-4 py-2">
                        {todo.categories ? todo.categories.split(',').map(cat => (
                          <span key={cat} className="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 mr-1 text-xs">{cat}</span>
                        )) : ''}
                      </td>
                      <td className={`px-4 py-2 ${dueDateClass}`}>{todo.dueDate || '-'}</td>
                      <td className="px-4 py-2 capitalize">{todo.priority}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleToggleTodo(todo.id, !todo.completed)} className={`px-2 py-1 rounded ${todo.completed ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{todo.completed ? 'Completed' : 'Active'}</button>
                      </td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleEditClick(todo)} className="btn-secondary mr-2">Edit</button>
                        <button onClick={() => handleDeleteTodo(todo.id)} className="btn-danger">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;