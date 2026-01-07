# Todo App - Application de Gestion de Tâches

<div align="center">

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Security](https://img.shields.io/badge/Security-Hardened-green)

**Application moderne de gestion de tâches conteneurisée avec Docker Compose**

[Démarrage Rapide](#démarrage-rapide) • [Documentation](#documentation) • [Sécurité](#sécurité) • [API](#api)

</div>

---

## Fonctionnalités

- **CRUD complet** - Créer, lire, modifier et supprimer des tâches
- **Persistance des données** - Sauvegarde dans PostgreSQL avec volume Docker
- **Interface moderne** - Design glassmorphism avec animations fluides
- **Sécurité renforcée** - Validation des variables, CORS configuré, headers de sécurité
- **Health checks** - Monitoring automatique de tous les services
- **Conteneurisé** - Déploiement simplifié avec Docker Compose
- **Performance optimisée** - Compression Gzip, cache, limites de ressources

---

## Architecture

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
│  │  Port: 8080    │      │  Port: 3000    │      │ Port: 5432*│ │
│  └────────────────┘      └────────────────┘      └────────────┘ │
│         │                        │                       │      │
│         └────────────────────────┴───────────────────────┘      │
│                      todo-network (bridge)                      │
│                                                                 │
│  Volumes:                                                       │
│  └─ postgres_data ──▶ /var/lib/postgresql/data                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

* Port 5432 non exposé en production (sécurité)
```

**Flux de données:**
1. L'utilisateur accède au frontend via http://localhost:8080
2. Le frontend (Nginx) sert l'application React
3. React communique avec l'API via http://api:3000 (réseau Docker)
4. L'API interroge PostgreSQL via le service 'db'
5. Les données sont persistées dans le volume postgres_data

---

## Prérequis

| Outil | Version Minimale | Vérification |
|-------|------------------|--------------|
| **Docker** | 20.10+ | `docker --version` |
| **Docker Compose** | 2.0+ | `docker compose version` |
| **Ports disponibles** | - | 8080, 3000 |

### Systèmes supportés
- Windows 10/11 (avec WSL2)
- macOS (Intel & Apple Silicon)
- Linux (Ubuntu, Debian, Fedora, etc.)

---

## Démarrage Rapide

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd todo-docker
```

### 2. Configurer les variables d'environnement

#### Générer un mot de passe sécurisé

**Windows PowerShell:**
```powershell
$password = -join ((65..90) + (97..122) + (48..57) + (33,35,36,37,38,42,43,45,61,63,64) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host "Mot de passe généré: $password"
```

**Linux/macOS:**
```bash
openssl rand -base64 32
```

#### Créer le fichier `.env`

```bash
# Copier le template
cp .env.example .env

# Éditer et remplacer DB_PASSWORD
nano .env  # ou notepad .env sur Windows
```

**Exemple de `.env`:**
```bash
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=VotreMotDePasseSecurise123!@#
DB_NAME=tododb
DB_PORT=5432

NODE_ENV=production
PORT=3000
CORS_ORIGIN=http://localhost:8080

VITE_API_URL=http://localhost:3000
```

> ⚠️ **IMPORTANT:** Ne JAMAIS commiter le fichier `.env` dans Git !

### 3. Lancer l'application

```bash
docker compose up -d
```

**Sortie attendue:**
```
✔ Network todo-docker_todo-network    Created
✔ Volume "todo-docker_postgres_data"  Created
✔ Container todo-db                   Healthy
✔ Container todo-api                  Healthy
✔ Container todo-frontend             Started
```

### 4. Vérifier le déploiement

```bash
# Vérifier l'état des conteneurs
docker compose ps

# Tous les services doivent être "healthy"
```

### 5. Accéder à l'application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:8080 | Interface utilisateur |
| **API** | http://localhost:3000 | API REST |
| **Health Check** | http://localhost:3000/health | État de l'API |

---

## Sécurité

### Mesures de sécurité implémentées

- **Validation des mots de passe** - Rejet automatique des mots de passe faibles
- **CORS configuré** - Liste blanche des origines autorisées
- **Headers de sécurité** - CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Utilisateurs non-root** - Tous les conteneurs utilisent des utilisateurs dédiés
- **Pas de secrets hardcodés** - Variables d'environnement obligatoires
- **Limites de ressources** - Protection contre l'épuisement des ressources
- **Authentification PostgreSQL** - scram-sha-256 (renforcé)

### Checklist de sécurité (OBLIGATOIRE avant production)

- [ ] Mot de passe PostgreSQL fort (32+ caractères)
- [ ] Fichier `.env` avec permissions restrictives (`chmod 600`)
- [ ] HTTPS activé (certificats Let's Encrypt)
- [ ] Port PostgreSQL (5432) NON exposé
- [ ] CORS_ORIGIN configuré avec votre domaine
- [ ] Firewall configuré (ports 80/443 uniquement)
- [ ] Sauvegardes automatiques activées
- [ ] Monitoring et alertes en place

### Mots de passe INTERDITS

Ces mots de passe sont **automatiquement rejetés** par l'application:
- `postgres`, `password`, `123456`, `admin`, `root`
- Tout mot de passe < 12 caractères génère un avertissement

---

## Services

### Frontend (Port 8080)

**Stack:**
- React 18 + Vite
- Nginx Alpine (serveur web)
- Design glassmorphism moderne

**Fonctionnalités:**
- Interface responsive
- Animations fluides
- Gestion d'état avec React Hooks
- Compression Gzip
- Cache optimisé

**Sécurité:**
- Headers CSP, X-Frame-Options, Referrer-Policy
- Blocage des fichiers sensibles (`.env`, `.git`)
- Limite de taille des requêtes (10MB)

---

### Backend API (Port 3000)

**Stack:**
- Node.js 20 Alpine
- Express.js
- PostgreSQL client (pg)

**Endpoints:**

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/` | Informations sur l'API |
| `GET` | `/health` | Health check |
| `GET` | `/tasks` | Liste toutes les tâches |
| `POST` | `/tasks` | Crée une nouvelle tâche |
| `PUT` | `/tasks/:id` | Met à jour une tâche |
| `DELETE` | `/tasks/:id` | Supprime une tâche |

**Sécurité:**
- Validation des variables d'environnement au démarrage
- CORS avec liste blanche configurable
- Gestion d'erreurs sécurisée (pas de stack trace en prod)
- Headers de sécurité additionnels

---

### Database (Port 5432)

**Stack:**
- PostgreSQL 16 Alpine
- Volume persistant `postgres_data`

**Schéma:**
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

**Sécurité:**
- Authentification scram-sha-256
- Port non exposé en production
- Limites de ressources (1 CPU, 512MB RAM)

---

## Variables d'Environnement

### Configuration PostgreSQL

| Variable | Description | Valeur par défaut | Requis |
|----------|-------------|-------------------|--------|
| `DB_HOST` | Hôte de la base de données | `db` | ✅ |
| `DB_USER` | Utilisateur PostgreSQL | `postgres` | ✅ |
| `DB_PASSWORD` | Mot de passe PostgreSQL | - | ✅ |
| `DB_NAME` | Nom de la base de données | `tododb` | ✅ |
| `DB_PORT` | Port PostgreSQL | `5432` | ✅ |

### Configuration Backend

| Variable | Description | Valeur par défaut | Requis |
|----------|-------------|-------------------|--------|
| `NODE_ENV` | Environnement d'exécution | `production` | ✅ |
| `PORT` | Port de l'API | `3000` | ✅ |
| `CORS_ORIGIN` | Origines CORS autorisées | `http://localhost:8080` | ✅ |

### Configuration Frontend

| Variable | Description | Valeur par défaut | Requis |
|----------|-------------|-------------------|--------|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:3000` | ✅ |

> 💡 **Astuce:** Pour plusieurs origines CORS, séparez-les par des virgules:
> ```bash
> CORS_ORIGIN=https://app.example.com,https://www.example.com
> ```

---

## Commandes Utiles

### Gestion des conteneurs

```bash
# Démarrer les services
docker compose up -d

# Arrêter les services
docker compose down

# Redémarrer un service spécifique
docker compose restart api

# Reconstruire et redémarrer
docker compose up -d --build

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker compose down -v
```

### Logs et debugging

```bash
# Voir tous les logs
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f api
docker compose logs -f frontend
docker compose logs -f db

# Vérifier l'état des services
docker compose ps

# Accéder au shell d'un conteneur
docker compose exec api sh
docker compose exec db psql -U postgres -d tododb
```

### Maintenance

```bash
# Sauvegarder la base de données
docker compose exec db pg_dump -U postgres tododb > backup.sql

# Restaurer la base de données
docker compose exec -T db psql -U postgres tododb < backup.sql

# Nettoyer les images inutilisées
docker system prune -a
```

---

## Tests

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

# Marquer comme terminée
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Supprimer une tâche
curl -X DELETE http://localhost:3000/tasks/1
```

### Test de persistance

```bash
# 1. Créer des tâches via l'interface web
# 2. Redémarrer les conteneurs
docker compose restart

# 3. Vérifier que les tâches sont toujours présentes
# Les données persistent grâce au volume postgres_data
```

---

## Choix Techniques

### Architecture Multi-conteneurs

- **Séparation des responsabilités** - Chaque service a un rôle distinct
- **Scalabilité** - Possibilité de scaler indépendamment
- **Isolation** - Communication via réseau Docker privé
- **Résilience** - Health checks et restart automatique

### Images Docker Optimisées

- **Base Alpine** - Images légères (~50MB vs ~900MB)
- **Multi-stage builds** - Optimisation de la taille finale
- **Utilisateurs non-root** - Sécurité renforcée
- **.dockerignore** - Contexte de build optimisé

### Performance

- Compression Gzip (Nginx)
- Cache des assets statiques (1 an)
- Index PostgreSQL sur `created_at`
- Connection pooling (pg)
- Limites de ressources configurées

---

## Dépannage

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker compose logs

# Vérifier que les ports ne sont pas utilisés
netstat -an | findstr "8080 3000"  # Windows
netstat -an | grep "8080\|3000"    # Linux/macOS

# Nettoyer et redémarrer
docker compose down -v
docker compose up -d
```

### Erreur: "Variable d'environnement requise manquante"

```bash
# Vérifier que le fichier .env existe
ls -la .env  # Linux/macOS
dir .env     # Windows

# Vérifier le contenu
cat .env

# Valider la configuration
cd backend && npm run validate-env
```

### Le frontend ne peut pas se connecter à l'API

```bash
# Vérifier que l'API est healthy
docker compose ps api

# Vérifier les logs de l'API
docker compose logs api

# Tester l'API directement
curl http://localhost:3000/health
```

### Erreur: "Mot de passe faible détecté"

```bash
# Générer un nouveau mot de passe fort
openssl rand -base64 32  # Linux/macOS

# Ou sur Windows PowerShell
-join ((65..90) + (97..122) + (48..57) + (33,35,36,37,38,42,43,45,61,63,64) | Get-Random -Count 32 | % {[char]$_})

# Mettre à jour .env et redémarrer
docker compose restart
```

---

## Structure du Projet

```
todo-docker/
├── frontend/                   # Application React
│   ├── src/
│   │   ├── App.jsx            # Composant principal
│   │   ├── App.css            # Styles de l'application
│   │   ├── main.jsx           # Point d'entrée React
│   │   └── index.css          # Styles globaux
│   ├── index.html             # Template HTML
│   ├── package.json           # Dépendances frontend
│   ├── vite.config.js         # Configuration Vite
│   ├── nginx.conf             # Configuration Nginx
│   ├── Dockerfile             # Image Docker frontend
│   └── .dockerignore          # Exclusions Docker
│
├── backend/                    # API Node.js
│   ├── src/
│   │   ├── index.js           # Serveur Express
│   │   ├── config.js          # Validation des variables
│   │   ├── db.js              # Connexion PostgreSQL
│   │   └── routes/
│   │       └── tasks.js       # Routes CRUD
│   ├── package.json           # Dépendances backend
│   ├── Dockerfile             # Image Docker backend
│   └── .dockerignore          # Exclusions Docker
│
├── database/                   # Configuration DB
│   └── init.sql               # Script d'initialisation
│
├── docker-compose.yml          # Orchestration Docker
├── .env.example               # Template variables d'env
├── .env.production.example    # Template production
├── .gitignore                 # Fichiers à ignorer
└── README.md                  # Ce fichier
```

---

## Déploiement en Production

### Prérequis Production

1. **Serveur** - VPS ou cloud (AWS, Azure, GCP, DigitalOcean)
2. **Domaine** - Nom de domaine configuré
3. **Certificats SSL** - Let's Encrypt (gratuit)
4. **Reverse Proxy** - Nginx, Traefik ou Caddy
5. **Monitoring** - Prometheus + Grafana recommandé

### Étapes de déploiement

#### 1. Préparer le serveur

```bash
# Installer Docker et Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installer Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

#### 2. Configurer les variables

```bash
# Copier le template production
cp .env.production.example .env

# Générer un mot de passe fort
openssl rand -base64 32

# Éditer .env avec vos valeurs
nano .env
```

**Exemple `.env` production:**
```bash
DB_PASSWORD=VotreMotDePasseSuperSecurise!@#$%
NODE_ENV=production
CORS_ORIGIN=https://votredomaine.com,https://www.votredomaine.com
VITE_API_URL=https://api.votredomaine.com
```

#### 3. Configurer le reverse proxy

**Exemple Nginx:**
```nginx
server {
    listen 80;
    server_name votredomaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votredomaine.com;

    ssl_certificate /etc/letsencrypt/live/votredomaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votredomaine.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 4. Déployer

```bash
# Construire et démarrer
docker compose -f docker-compose.yml up -d --build

# Vérifier
docker compose ps
```

#### 5. Configurer les sauvegardes

```bash
# Créer un script de backup
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker compose exec -T db pg_dump -U postgres tododb > backup_$DATE.sql
find . -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Ajouter au crontab (tous les jours à 2h)
crontab -e
# Ajouter: 0 2 * * * /path/to/backup.sh
```

---

## Monitoring

### Métriques recommandées

- **CPU/Mémoire** - Utilisation des conteneurs
- **Requêtes/s** - Charge de l'API
- **Temps de réponse** - Performance
- **Espace disque** - Volume PostgreSQL
- **Taux d'erreur** - Erreurs 5xx

### Stack de monitoring suggérée

```yaml
# Ajouter à docker-compose.yml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
```

---

## Contribution

Les contributions sont les bienvenues ! Pour contribuer:

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## Licence

Ce projet est fourni à titre d'exemple et peut être utilisé librement.

---

## Ressources

### Documentation
- [Docker Documentation](https://docs.docker.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)

### Sécurité
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

### Outils
- [Let's Encrypt](https://letsencrypt.org/) - Certificats SSL gratuits
- [Docker Hub](https://hub.docker.com/) - Registry d'images Docker
- [Portainer](https://www.portainer.io/) - Interface de gestion Docker

---

## Support

Besoin d'aide ? Consultez:

- [Documentation complète](#documentation)
- [Section Dépannage](#dépannage)
- [Issues GitHub](https://github.com/votre-repo/issues)

---

<div align="center">

**Fait avec ❤️ et Docker**

</div>
