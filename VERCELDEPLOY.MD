# Vercel deployment — CarbHEALTH (ready-to-deploy)

A short, action-first deployment guide — Gemini is the primary AI provider; Groq is a simple server-side fallback.

---

## ✅ Quick checklist (before you start)
- Push code to `main` (or open a PR from `feat/groq-fallback` — preview deploys are automatic).
- You have a Vercel account with access to the repo.
- Add **server-only** secrets in Vercel (do NOT use VITE_ prefixed names for secrets).
- Run tests locally: `npm test -- --run` and `npm run build` (both should succeed).

---

## 1) Required environment variables (Vercel → Project → Settings → Environment Variables)
Server (required/optional):
- GEMINI_API_KEY — **primary** AI key (production)
- GROQ_API_KEY — optional **Groq fallback** (set to enable Groq LPU)
- GROQ_URL — optional override (default: `https://api.groq.com/openai/v1`)
- GROQ_MODEL — optional (default: `llama3-8b`)

Public (Vite frontend — optional):
- VITE_APP_TITLE, VITE_INITIAL_USERS, VITE_INITIAL_SUGAR_SAVED, VITE_ENABLE_TRIVIA, VITE_API_URL

Notes:
- Keep GEMINI_API_KEY and GROQ_API_KEY server-only (do NOT prefix with `VITE_`).
- To *force* Groq in a Preview deployment, remove GEMINI_API_KEY from Preview env and set GROQ_API_KEY.

---

## 2) Vercel project setup (dashboard)
1. Import the repo: **New Project → Import Git Repository** → select `Mozzicato/CarbHealth`.
2. Framework Preset: **Vite** (auto-detected).
3. Build Command: `npm run build`  
   Output Directory: `dist`
4. After import, add the server env vars from section (1) under **Settings → Environment Variables**.
5. Deploy — Vercel will create a Preview for PRs and auto-deploy `main` to production.

Vercel auto-detects serverless functions; there is no `functions` block in `vercel.json`. Vercel will detect and run `api/*.js` serverless routes automatically using the appropriate Node runtime.

Note: Vercel accepts either a top-level `functions` config or a `builds` block, but not both. This repository intentionally does not include a `functions` block in `vercel.json` to avoid runtime version formatting issues — do not add a `builds` section alongside a `functions` block.

---

## 3) CLI deploy (one-liners)
- Login & deploy (interactive):
  - `npm i -g vercel && vercel login && vercel --prod`
- Add server env vars via CLI (example):
  - `vercel env add GEMINI_API_KEY production`
  - `vercel env add GROQ_API_KEY preview`

---

## 4) Smoke tests (after deploy) 🔎
- Basic site check: open `https://<your-project>.vercel.app` and verify UI loads.

- AI (Gemini primary) — sample request:
```bash
curl -sS -X POST https://<your-deployment>/api/insights \
  -H 'Content-Type: application/json' \
  -d '{"foodLog":[{"food":{"name":"Coke","carbs":39,"sugar":39},"quantity":1,"time":"2026-02-19T00:00:00Z"}]}' | jq
```
- Force Groq fallback (Preview): remove `GEMINI_API_KEY` from Preview env, set `GROQ_API_KEY`, then run the same `/api/insights` curl. The request will route to Groq automatically.

- GROQ-only quick check:
```bash
curl -sS -X POST https://<your-deployment>/api/groq \
  -H 'Content-Type: application/json' \
  -d '{"query":"*[_type == \"food\"]"}' | jq
```
- Inspect server logs in Vercel: **Project → Deployments → (select deployment) → Logs**.

---

## 5) Common issues & fixes
- 500 from `/api/insights`: missing/invalid GEMINI_API_KEY (or GROQ_API_KEY). Add server env vars and redeploy.
- 502 from Groq: invalid `GROQ_API_KEY` / `GROQ_URL` or model not allowed — verify keys and model name.
- AI returns non‑JSON: UI shows `raw` — check model output and prompts; increase `temperature`/`max_tokens` only if intentional.
- Preview not using Groq: ensure Preview environment has `GROQ_API_KEY` set and `GEMINI_API_KEY` removed (if you want to force Groq).

---

## 6) Security & best practices
- Never expose write-capable keys to the browser (no VITE_ prefix for server secrets).
- Add rate limiting or caching on `/api/insights` if traffic/cost is a concern.
- Use Vercel Environment Scopes: set different keys for `preview` vs `production`.

---

## 7) Rollback, PRs & CI
- Vercel auto-creates preview deployments for PRs — use this to validate Groq fallback before merging.
- To rollback: **Deployments → choose older deployment → Promote to Production**.
- After merging `feat/groq-fallback` to `main`, Vercel will deploy production automatically.

---

## 8) I can deploy for you
- I can open the PR, add Vercel env vars, and run a smoke test if you provide the server keys (or log into Vercel). 🔐

---

Happy to deploy now — tell me whether you want me to (A) open the PR and leave it for you, or (B) merge & trigger a production deploy. 🚀
