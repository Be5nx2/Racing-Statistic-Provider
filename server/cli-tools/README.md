# CLI tools

Scripts TypeScript à lancer en local pour tests, imports, ou autres actions.

## Lancer un script

Depuis la racine du **server** :

```bash
npm run cli-tools -- cli-tools/example.ts
```

Avec des arguments :

```bash
npm run cli-tools -- cli-tools/example.ts --arg1 value
```

## Ajouter un script

1. Crée un fichier `.ts` dans `server/cli-tools/` (ex. `import-data.ts`).
2. Exécute-le avec : `npm run cli-tools -- cli-tools/import-data.ts`.

Tu peux importer du code du serveur avec par exemple : `import { ... } from "../src/..."`.
