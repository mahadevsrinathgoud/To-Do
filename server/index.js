import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Use your MySQL password
  database: 'todo_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and tables
const initializeDatabase = async () => {
  try {
    // Create the database if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();
    
    // Connect to the database and create tables
    const conn = await pool.getConnection();
    
    // Create todos table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        dueDate DATE,
        categories VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    conn.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

// API Routes
// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM todos ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Get a single todo by ID
app.get('/api/todos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching todo ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  const { title, description, completed, priority, dueDate, categories } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO todos (title, description, completed, priority, dueDate, categories) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, completed || false, priority || 'medium', dueDate, categories ? categories.join(',') : null]
    );
    
    const [newTodo] = await pool.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json(newTodo[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  const { title, description, completed, priority, dueDate, categories } = req.body;
  const id = req.params.id;
  
  try {
    const [todo] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    
    if (todo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    await pool.query(
      'UPDATE todos SET title = ?, description = ?, completed = ?, priority = ?, dueDate = ?, categories = ? WHERE id = ?',
      [
        title || todo[0].title,
        description !== undefined ? description : todo[0].description,
        completed !== undefined ? completed : todo[0].completed,
        priority || todo[0].priority,
        dueDate || todo[0].dueDate,
        categories ? categories.join(',') : todo[0].categories,
        id
      ]
    );
    
    const [updatedTodo] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    res.json(updatedTodo[0]);
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Toggle todo status
app.patch('/api/todos/:id/toggle', async (req, res) => {
  const { completed } = req.body;
  const id = req.params.id;
  
  if (completed === undefined) {
    return res.status(400).json({ error: 'Completed status is required' });
  }
  
  try {
    await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id]);
    const [updatedTodo] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    
    if (updatedTodo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(updatedTodo[0]);
  } catch (error) {
    console.error(`Error toggling todo ${id}:`, error);
    res.status(500).json({ error: 'Failed to toggle todo status' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const [todo] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    
    if (todo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Initialize database and start the server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize the application:', err);
  });