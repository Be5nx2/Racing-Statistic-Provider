# Racing-Statistic-Provider

## Structure

- **server**: TypeScript Express server (DDD: **library/tools**, **services**, **endpoints**). See `server/src/README.md`.
- **frontend**: Vue 3 + Vite + TypeScript frontend.
- **input**: Local input data directory (gitignored).
- **output**: Generated output data (committed if needed).

## Getting started

From the project root:

```bash
npm install
```

### Backend (server)

- **Dev**: `npm run dev:server`
- **Build**: `npm run build:server`

The server uses a domain-driven layout: **library/tools** (shared utilities), **services** (business logic), **endpoints** (HTTP layer). It runs on `http://localhost:3000` and exposes:

- `GET /health`
- `GET /api/stats` – placeholder endpoint for future racing statistics.

### CLI tools (server)

Le dossier `server/cli-tools/` permet d’exécuter des scripts TypeScript en local (tests, imports, actions ponctuelles). Depuis `server/` :

```bash
npm run cli-tools -- cli-tools/example.ts
npm run cli-tools -- cli-tools/mon-script.ts --option value
```

Voir `server/cli-tools/README.md` pour le détail.

### Frontend (Vue)

- **Dev**: `npm run dev:frontend`
- **Build**: `npm run build:frontend`

The frontend runs on `http://localhost:5173` (Vite) and proxies `/api` calls to the server.

### Docker (OrbStack ou Docker Desktop)

Les deux services tournent sous Docker avec Compose :

```bash
docker compose up --build
```

- **Backend** : `http://localhost:3000`
- **Frontend** : `http://localhost:5173` (Vite en dev, proxy `/api` et `/health` vers le backend)

Arrêt : `docker compose down`.

### Future PostgreSQL database

The server is structured so that database-related logic can be added later (e.g. under `server/src`), but no PostgreSQL configuration or connection code has been created yet.