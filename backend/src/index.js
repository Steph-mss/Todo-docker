require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Point de terminaison de vérification de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/tasks', tasksRouter);

// Point de terminaison racine
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

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}`);
});
