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

Happy to run a CLI deploy for you or finish the Vercel dashboard connection — tell me which you prefer.
# CarbHealth