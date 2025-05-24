import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';
function Header({ onAddNewClick, taskCount }) {
  return (
    <header className="header py-4 px-5">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckSquare size={28} className="text-primary" />
            <h1 className="text-2xl font-bold">To-Do Manager </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center text-sm">
              <span className="text-gray-500">
                {taskCount.completed} of {taskCount.total} tasks completed
              </span>
            </div>
            
            <button
              onClick={onAddNewClick}
              className="btn-primary flex items-center gap-1"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;