# 📝 Todo App - Application de Gestion de Tâches

Application moderne de gestion de tâches (To-Do) conteneurisée avec Docker Compose, comprenant un frontend React, une API backend Node.js/Express et une base de données PostgreSQL.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)

## ✨ Fonctionnalités

- ✅ Créer des tâches
- 📋 Voir la liste des tâches
- ✔️ Marquer une tâche comme terminée
- 🗑️ Supprimer une tâche
- 💾 Persistance des données
- 🎨 Interface moderne avec glassmorphism et animations
- 🔒 Sécurité : utilisateurs non-root, pas de secrets en clair
- 🏥 Health checks pour tous les services

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOCKER HOST                              │
│                                                                 │
│  ┌────────────────┐      ┌────────────────┐      ┌────────────┐ │
│  │   FRONTEND     │      │   BACKEND      │      │  DATABASE  │ │
│  │                │      │                │      │            │ │
│  │  React + Vite  │─────▶│ Node.js +      │─────▶│ PostgreSQL ││
│  │  + Nginx       │ HTTP │ Express        │ SQL  │     16     │ │
│  │                │      │                │      │            │ │
│  │  Port: 8080    │      │  Port: 3000    │      │ Port: 5432 │ │
│  └────────────────┘      └────────────────┘      └────────────┘ │
│         │                        │                       │      │
│         └────────────────────────┴───────────────────────┘      │
│                      todo-network (bridge)                      │
│                                                                 │
│  Volumes:                                                       │
│  └─ postgres_data ──▶ /var/lib/postgresql/data                  |
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Flux de données:
1. L'utilisateur accède au frontend via http://localhost:8080
2. Le frontend (Nginx) sert l'application React
3. React communique avec l'API via http://api:3000 (réseau Docker)
4. L'API interroge PostgreSQL via le service 'db'
5. Les données sont persistées dans le volume postgres_data
```

## 📋 Prérequis

- **Docker** : version 20.10 ou supérieure
- **Docker Compose** : version 2.0 ou supérieure
- **Système d'exploitation** : Windows, macOS, ou Linux
- **Ports disponibles** : 8080 (frontend), 3000 (API), 5432 (optionnel, pour debug DB)

### Vérifier l'installation

```bash
docker --version
docker compose version
```

## 🚀 Démarrage Rapide

### 1. Cloner ou télécharger le projet

```bash
cd todo-docker
```

### 2. Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env et modifier le mot de passe
# Exemple sous Windows PowerShell:
notepad .env

# Exemple sous Linux/macOS:
nano .env
```

**Important** : Par défaut, le mot de passe PostgreSQL est postgres.
Vous pouvez le garder pour le développement, mais changez-le en production.

### 3. Lancer l'application

```bash
docker compose up -d
```

Cette commande va :
- Construire les images Docker pour le frontend et le backend
- Télécharger l'image PostgreSQL
- Créer le réseau Docker
- Démarrer les 3 conteneurs
- Initialiser la base de données avec le schéma

### 4. Vérifier que tout fonctionne

```bash
# Vérifier l'état des conteneurs
docker compose ps

# Tous les services doivent être "healthy"
```

### 5. Accéder à l'application

- **Frontend** : http://localhost:8080
- **API** : http://localhost:3000
- **API Health Check** : http://localhost:3000/health



### Section Debug Réseau
Le frontend appelle l’API via http://localhost:3000.
Cela fonctionne parce que l’appel est effectué depuis le navigateur.
En production derrière un proxy, cette valeur pourra être modifiée.

## 📦 Services

### Frontend (Port 8080)

- **Technologie** : React 18 + Vite
- **Serveur** : Nginx Alpine
- **Dockerfile** : Multi-stage build (optimisé)
- **Fonctionnalités** :
  - Interface utilisateur moderne avec design glassmorphism
  - Animations et transitions fluides
  - Responsive design
  - Gestion d'état avec React Hooks

### Backend API (Port 3000)

- **Technologie** : Node.js 20 + Express
- **Base de données** : PostgreSQL (via pg)
- **Endpoints** :
  - `GET /` - Informations sur l'API
  - `GET /health` - Health check
  - `GET /tasks` - Liste toutes les tâches
  - `POST /tasks` - Crée une nouvelle tâche
  - `PUT /tasks/:id` - Met à jour une tâche
  - `DELETE /tasks/:id` - Supprime une tâche

### Database (Port 5432)

- **Technologie** : PostgreSQL 16 Alpine
- **Volume** : `postgres_data` pour la persistance
- **Initialisation** : Script SQL automatique au premier démarrage
- **Schéma** :
  ```sql
  tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  ```

## 🔧 Variables d'Environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `DB_USER` | Utilisateur PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `postgres` |
| `DB_NAME` | Nom de la base de données | `tododb` |
| `DB_PORT` | Port PostgreSQL | `5432` |

## 🛠️ Commandes Utiles

```bash
# Démarrer les services
docker compose up -d

# Arrêter les services
docker compose down

# Voir les logs
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f frontend
docker compose logs -f api
docker compose logs -f db

# Reconstruire les images
docker compose build

# Reconstruire et redémarrer
docker compose up -d --build

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker compose down -v

# Vérifier l'état des services
docker compose ps

# Accéder au shell d'un conteneur
docker compose exec api sh
docker compose exec frontend sh
docker compose exec db psql -U postgres -d tododb
```

## 🧪 Tests

### Test de l'API avec curl

```bash
# Health check
curl http://localhost:3000/health

# Lister les tâches
curl http://localhost:3000/tasks

# Créer une tâche
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Ma nouvelle tâche"}'

# Marquer une tâche comme terminée (remplacer :id)
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Supprimer une tâche (remplacer :id)
curl -X DELETE http://localhost:3000/tasks/1
```

### Test de persistance

```bash
# 1. Créer des tâches via l'interface web
# 2. Redémarrer les conteneurs
docker compose restart

# 3. Vérifier que les tâches sont toujours présentes
# Les données doivent persister grâce au volume postgres_data
```

## 🎨 Choix Techniques

### Architecture Multi-conteneurs

- **Séparation des responsabilités** : Chaque service a un rôle distinct
- **Scalabilité** : Possibilité de scaler indépendamment chaque service
- **Isolation** : Les services communiquent via un réseau Docker privé

### Images Docker

- **Base Alpine** : Images légères (~50MB vs ~900MB pour les images standard)
- **Multi-stage builds** : Optimisation de la taille des images finales
- **Utilisateurs non-root** : Sécurité renforcée

### Sécurité

- ✅ Utilisateurs non-root dans tous les conteneurs
- ✅ Variables d'environnement pour les secrets
- ✅ Pas de secrets commités dans le code
- ✅ Headers de sécurité Nginx (X-Frame-Options, X-Content-Type-Options)
- ✅ Health checks pour tous les services

### Performance

- ✅ Gzip compression (Nginx)
- ✅ Cache des assets statiques
- ✅ Index PostgreSQL sur created_at
- ✅ Connection pooling (pg)

### Développement

- **Hot reload** : Nodemon pour le backend en dev
- **Vite** : Build ultra-rapide pour le frontend
- **Docker Compose** : Environnement de dev identique à la production

## 🐛 Dépannage

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker compose logs

# Vérifier que les ports ne sont pas déjà utilisés
netstat -an | findstr "8080 3000 5432"  # Windows
netstat -an | grep "8080\|3000\|5432"   # Linux/macOS
```

### Le frontend ne peut pas se connecter à l'API

- Vérifier que le service API est "healthy" : `docker compose ps`
- Vérifier les logs de l'API : `docker compose logs api`
- Vérifier que le réseau Docker fonctionne : `docker network ls`

### La base de données ne se connecte pas

```bash
# Vérifier que PostgreSQL est démarré
docker compose ps db

# Tester la connexion
docker compose exec db psql -U postgres -d tododb -c "SELECT 1;"

# Vérifier les variables d'environnement
docker compose exec api env | grep DB_
```

### Réinitialiser complètement l'application

```bash
# Arrêter et supprimer tout (conteneurs, volumes, réseaux)
docker compose down -v

# Redémarrer
docker compose up -d
```

## 📁 Structure du Projet

```
todo-docker/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── App.jsx          # Composant principal
│   │   ├── App.css          # Styles de l'application
│   │   ├── main.jsx         # Point d'entrée React
│   │   └── index.css        # Styles globaux
│   ├── index.html           # Template HTML
│   ├── package.json         # Dépendances frontend
│   ├── vite.config.js       # Configuration Vite
│   ├── nginx.conf           # Configuration Nginx
│   └── Dockerfile           # Image Docker frontend
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── index.js         # Serveur Express
│   │   ├── db.js            # Connexion PostgreSQL
│   │   └── routes/
│   │       └── tasks.js     # Routes CRUD
│   ├── package.json         # Dépendances backend
│   └── Dockerfile           # Image Docker backend
├── database/                 # Configuration DB
│   └── init.sql             # Script d'initialisation
├── docker-compose.yml        # Orchestration Docker
├── .env.example             # Template variables d'env
├── .gitignore               # Fichiers à ignorer
└── README.md                # Ce fichier
```

## 🚀 Prochaines Étapes

Améliorations possibles :

- [ ] Authentification utilisateur
- [ ] Catégories de tâches
- [ ] Dates d'échéance
- [ ] Filtres et recherche
- [ ] Tests automatisés (Jest, Cypress)
- [ ] CI/CD avec GitHub Actions
- [ ] Déploiement sur cloud (AWS, Azure, GCP)

## 📄 Licence

Ce projet est fourni à titre d'exemple et peut être utilisé librement.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Fait avec ❤️ et Docker 🐳**
