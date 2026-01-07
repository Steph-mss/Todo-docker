/**
 * Configuration et validation des variables d'environnement
 */

require('dotenv').config();

/**
 * Valide qu'une variable d'environnement est définie et non vide
 */
function requireEnv(name, defaultValue = null) {
  const value = process.env[name];
  
  if (!value || value.trim() === '') {
    if (defaultValue !== null) {
      console.warn(`⚠️  Variable ${name} non définie, utilisation de la valeur par défaut`);
      return defaultValue;
    }
    console.error(`❌ Variable d'environnement requise manquante: ${name}`);
    process.exit(1);
  }
  
  return value;
}

/**
 * Vérifie la sécurité du mot de passe
 */
function validatePassword(password) {
  const weakPasswords = ['postgres', 'password', '123456', 'admin', 'root', 'CHANGEZ_MOI_OBLIGATOIREMENT'];
  
  if (weakPasswords.includes(password)) {
    console.error('❌ ERREUR DE SÉCURITÉ: Mot de passe faible détecté !');
    console.error('   Le mot de passe ne doit PAS être un mot de passe commun.');
    console.error('   Générez un mot de passe fort: openssl rand -base64 32');
    process.exit(1);
  }
  
  if (password.length < 12) {
    console.warn('⚠️  AVERTISSEMENT: Le mot de passe est court (< 12 caractères)');
    console.warn('   Recommandation: utilisez au moins 16 caractères');
  }
}

// Configuration de la base de données
const dbConfig = {
  host: requireEnv('DB_HOST', 'db'),
  port: parseInt(requireEnv('DB_PORT', '5432'), 10),
  user: requireEnv('DB_USER', 'postgres'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_NAME', 'tododb'),
};

// Validation du mot de passe en production
if (process.env.NODE_ENV === 'production') {
  validatePassword(dbConfig.password);
}

// Configuration du serveur
const serverConfig = {
  port: parseInt(requireEnv('PORT', '3000'), 10),
  nodeEnv: requireEnv('NODE_ENV', 'development'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080',
};

console.log('✅ Configuration validée avec succès');
console.log(`   Environnement: ${serverConfig.nodeEnv}`);
console.log(`   Base de données: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

module.exports = {
  dbConfig,
  serverConfig,
};
