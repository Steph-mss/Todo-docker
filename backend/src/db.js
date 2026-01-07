const { Pool } = require('pg');
const { dbConfig } = require('./config');

const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  console.error('❌ Erreur inattendue sur le client PostgreSQL:', err);
  process.exit(-1);
});

// Tester la connexion au démarrage
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    console.error('   Vérifiez vos variables d\'environnement DB_*');
    process.exit(1);
  } else {
    console.log('✅ Base de données connectée avec succès');
    console.log(`   Timestamp serveur: ${res.rows[0].now}`);
  }
});

module.exports = pool;

