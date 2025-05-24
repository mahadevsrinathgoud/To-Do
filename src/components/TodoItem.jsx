import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Circle, Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const { id, title, description, completed, priority, dueDate } = todo;
  
  const priorityIcon = () => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'medium':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'low':
        return <AlertTriangle size={16} className="text-green-500" />;
      default:
        return null;
    }
  };
  
  const formattedDueDate = dueDate ? format(new Date(dueDate), 'MMM dd, yyyy') : 'No due date';
  
  return (
    <motion.div 
      className={`todo-item glass-card p-4 mb-3 priority-${priority} ${completed ? 'completed' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <button 
            onClick={() => onToggle(id, !completed)} 
            className="p-1 rounded-full hover:bg-gray-100 mt-0.5"
          >
            {completed ? 
              <CheckCircle size={20} className="text-green-500" /> : 
              <Circle size={20} className="text-gray-400" />
            }
          </button>
          
          <div className="flex-1">
            <h3 className={`font-medium text-lg ${completed ? 'line-through text-gray-500' : ''}`}>
              {title}
            </h3>
            
            {description && (
              <p className={`text-sm mt-1 ${completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {description}
              </p>
            )}
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-xs gap-1 text-gray-500">
                <Calendar size={14} />
                <span>{formattedDueDate}</span>
              </div>
              
              <div className="flex items-center text-xs gap-1">
                {priorityIcon()}
                <span className="capitalize">{priority}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-1">
          <button 
            onClick={() => onEdit(todo)} 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="Edit task"
          >
            <Edit size={16} />
          </button>
          
          <button 
            onClick={() => onDelete(id)} 
            className="p-2 rounded-full hover:bg-red-100 text-red-500"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default TodoItem;