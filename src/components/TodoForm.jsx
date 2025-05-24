import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function TodoForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing = false 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    categories: []
  });
  const [titleError, setTitleError] = useState('');
  const categoryOptions = ['Work', 'Personal', 'Urgent', 'Home', 'Other'];
  
  useEffect(() => {
    if (initialData) {
      const dueDate = initialData.dueDate 
        ? new Date(initialData.dueDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      setFormData({
        title: initialData.title,
        description: initialData.description,
        completed: initialData.completed,
        priority: initialData.priority,
        dueDate,
        categories: initialData.categories ? initialData.categories.split(',') : []
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, categories: selected }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate title for special characters
    if (/[^a-zA-Z0-9\s]/.test(formData.title)) {
      setTitleError('Title should not contain special characters.');
      return;
    } else {
      setTitleError('');
    }
    onSubmit(formData);
  };
  
  return (
    <div className="glass-card p-5 mb-5 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </h2>
        <button 
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            required
            className="focus:ring-2 focus:ring-blue-500"
          />
          {titleError && <div className="text-red-500 text-sm mt-1">{titleError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details (optional)"
            rows={3}
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="form-group">
          <label htmlFor="categories" className="form-label">Categories</label>
          <select
            id="categories"
            name="categories"
            multiple
            value={formData.categories}
            onChange={handleCategoryChange}
            className="focus:ring-2 focus:ring-blue-500"
          >
            {categoryOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {isEditing && (
          <div className="form-group flex items-center">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleCheckboxChange}
              className="w-4 h-4 mr-2"
            />
            <label htmlFor="completed" className="form-label mb-0">
              Mark as completed
            </label>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {isEditing ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoForm;