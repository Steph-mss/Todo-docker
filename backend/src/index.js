require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/tasks', tasksRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API is running',
    endpoints: {
      health: 'GET /health',
      tasks: {
        list: 'GET /tasks',
        create: 'POST /tasks',
        update: 'PUT /tasks/:id',
        delete: 'DELETE /tasks/:id'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}`);
});
