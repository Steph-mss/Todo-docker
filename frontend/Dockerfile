# Étape de construction
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

# Étape de production
FROM nginx:alpine

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S nginx-app -u 1001

# Copier les fichiers construits depuis le builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Changer les permissions
RUN chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    chown -R nginx-app:nginx-app /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-app:nginx-app /var/run/nginx.pid

# Basculer vers l'utilisateur non-root
USER nginx-app

# Exposer le port
EXPOSE 80

# Vérification de santé
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost || exit 1

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
