import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

function TodoFilter({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  categoryFilter,
  onCategoryFilterChange,
  dueDateFilter,
  onDueDateFilterChange,
  categoryOptions = []
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 my-5">
      <div className="flex flex-1 items-center glass-card p-2 rounded-lg">
        <Search size={18} className="ml-2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="flex-1 border-none bg-transparent focus:ring-0 p-2"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <select
          value={categoryFilter}
          onChange={e => onCategoryFilterChange(e.target.value)}
          className="border rounded-lg p-2 text-sm"
        >
          <option value="">All Categories</option>
          {categoryOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <input
          type="date"
          value={dueDateFilter}
          onChange={e => onDueDateFilterChange(e.target.value)}
          className="border rounded-lg p-2 text-sm"
        />
        <div className="flex rounded-lg overflow-hidden glass-card">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'all' ? 'filter-active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('active')}
            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'active' ? 'filter-active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'completed' ? 'filter-active' : ''}`}
          >
            Completed
          </button>
        </div>
        <div className="flex items-center glass-card rounded-lg">
          <SlidersHorizontal size={18} className="ml-2 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border-none bg-transparent focus:ring-0 text-sm p-2"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default TodoFilter;