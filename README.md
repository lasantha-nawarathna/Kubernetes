[README.md](https://github.com/user-attachments/files/26390221/README.md)
# Kubernetes Reference Book

A single-page web app for browsing Kubernetes reference content. The UI is built with **React**, **Vite**, and **Tailwind CSS**; production serves the built client with **Express**.

## Requirements

- **Node.js** 18+ (recommended: current LTS)
- **npm** (this repo uses npm; see `package-lock.json` and `.npmrc`)

## Setup

```bash
npm install
```

`postinstall` runs [patch-package](https://github.com/ds300/patch-package) to apply a small patch to `wouter`.

## Scripts

| Command        | Description |
|----------------|-------------|
| `npm run dev`  | Vite dev server (with `--host`) |
| `npm run build`| Build the client to `dist/public` and bundle the server to `dist/index.js` |
| `npm start`    | Run production server (`NODE_ENV=production node dist/index.js`) |
| `npm run preview` | Preview the production build with Vite |
| `npm run check`   | TypeScript check (`tsc --noEmit`) |
| `npm run format`  | Format with Prettier |

## Development

```bash
npm run dev
```

The Vite app lives under `client/`. In development, the Express server is not required for the UI; use `npm start` only after a production build.

## Production

1. Build:

   ```bash
   npm run build
   ```

2. Start:

   ```bash
   npm start
   ```

The server listens on **`PORT`** if set, otherwise **3000**. It serves static files from `dist/public` and falls back to `index.html` for client-side routing.

### Hosting (e.g. Plesk Node.js)

- **Application startup file:** `dist/index.js` (relative to the app root)
- Run **`npm run build`** during deployment before starting the app
- Set **`NODE_ENV=production`** and the **`PORT`** your host expects

## Project layout

| Path | Role |
|------|------|
| `client/` | React app (Vite `root`) |
| `server/index.ts` | Express server (bundled to `dist/index.js`) |
| `dist/public/` | Built static assets (from `npm run build`) |
| `dist/index.js` | Built server entry |
| `patches/` | Patches applied by `patch-package` |

## License

MIT
