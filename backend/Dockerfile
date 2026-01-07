# Étape de construction
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Étape de production
FROM node:20-alpine

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001

WORKDIR /app

# Copier les dépendances depuis le builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copier le code de l'application
COPY --chown=nodejs:nodejs . .

# Basculer vers l'utilisateur non-root
USER nodejs

# Exposer le port
EXPOSE 3000

# Vérification de santé
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Démarrer l'application
CMD ["node", "src/index.js"]
