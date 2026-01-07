const express = require('express');
const cors = require('cors');
const { serverConfig } = require('./config');
const tasksRouter = require('./routes/tasks');

const app = express();

// Configuration CORS sécurisée
const corsOptions = {
  origin: function (origin, callback) {
    // Permettre les requêtes sans origine (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Liste des origines autorisées
    const allowedOrigins = serverConfig.corsOrigin.split(',').map(o => o.trim());
    
    if (allowedOrigins.indexOf(origin) !== -1 || serverConfig.nodeEnv === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Limite la taille des requêtes

// Headers de sécurité supplémentaires
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Point de terminaison de vérification de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: serverConfig.nodeEnv
  });
});

// Routes
app.use('/tasks', tasksRouter);

// Point de terminaison racine
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API is running',
    version: '1.0.0',
    environment: serverConfig.nodeEnv,
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
  console.error('❌ Erreur non gérée:', err);
  
  // Ne pas exposer les détails d'erreur en production
  const errorMessage = serverConfig.nodeEnv === 'production' 
    ? 'Erreur interne du serveur' 
    : err.message;
  
  res.status(err.status || 500).json({ 
    error: errorMessage,
    ...(serverConfig.nodeEnv !== 'production' && { stack: err.stack })
  });
});

// Démarrer le serveur
app.listen(serverConfig.port, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${serverConfig.port}`);
  console.log(`📝 API disponible sur http://localhost:${serverConfig.port}`);
  console.log(`🔒 CORS autorisé pour: ${serverConfig.corsOrigin}`);
});
