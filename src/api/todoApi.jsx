import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const todoApi = {
  getAllTodos: async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      return [];
    }
  },

  getTodoById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching todo ${id}:`, error);
      return null;
    }
  },

  createTodo: async (todoData) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, todoData);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      return null;
    }
  },

  updateTodo: async (id, todoData) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      console.error(`Error updating todo ${id}:`, error);
      return null;
    }
  },

  deleteTodo: async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting todo ${id}:`, error);
      return false;
    }
  },

  toggleTodoStatus: async (id, completed) => {
    try {
      const response = await axios.patch(`${API_URL}/todos/${id}/toggle`, { completed });
      return response.data;
    } catch (error) {
      console.error(`Error toggling todo ${id}:`, error);
      return null;
    }
  }
};

export default todoApi;