// Description: This component is a form for adding or editing a todo item.
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';
import { ClipboardList } from 'lucide-react';

// Remove TypeScript types and interface
function TodoList({ todos, onToggle, onEdit, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <ClipboardList size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-medium text-gray-700">No tasks found</h3>
        <p className="text-gray-500 mt-2">
          Add a new task or try changing your filters
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      {todos.map(todo => (
        <motion.div
          key={todo.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export default TodoList;