# CarbHEALTH — MVP

Quick start (after installing dependencies):

```bash
npm install
npm run dev
```

This is a small Vite + React SPA containing the UI and calculator utilities described in `plan.md`.

## Deploying to Vercel

Two easy options:

1) GitHub → Vercel (recommended)
- Push to `main` (already done).
- On https://vercel.com, choose **Import Project** → select this GitHub repo → use the `Vite` preset (build command `npm run build`, output `dist`).
- Deploy — Vercel will automatically build on every push to `main`.

2) Vercel CLI (one-off)

```bash
npm i -g vercel
vercel login
vercel --prod
```

We've added `vercel.json` so SPA routing and build settings are pre-configured.

Environment variables

This project uses Vite env variables (must start with `VITE_`).
Create a local `.env` for development (already ignored by git) and add the same keys in Vercel (Project → Settings → Environment Variables).

Common keys (already present in `.env.example`):

- `VITE_APP_TITLE` — app title shown in header (default: CarbHEALTH)
- `VITE_INITIAL_USERS` — initial value for live users stat
- `VITE_INITIAL_SUGAR_SAVED` — initial sugar saved stat
- `VITE_ENABLE_TRIVIA` — `true|false` to enable the trivia popup
- `VITE_API_URL` — optional backend/API base URL

Set these under Vercel → Project Settings → Environment Variables for `Production` (and `Preview`/`Development` if needed). After adding them Vercel will rebuild the site on the next push.

Happy to add CI secrets or set the Vercel project for you if you want me to deploy now.
# CarbHealth