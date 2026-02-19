# Vercel deployment — CarbHEALTH (manual)

A concise step‑by‑step guide to make the app public on Vercel and enable the AI / GROQ features.

---

## ✅ Quick checklist (before you start)
- Code pushed to `main` on GitHub (already done).
- You have a Vercel account and access to the repo.  
- Prod secrets available (OpenAI API key, Sanity/GROQ token) — **do not** add these as VITE_* variables.

---

## 1) Required environment variables (add in Vercel Project → Settings → Environment Variables)
- OPENAI_API_KEY — server-only key for `/api/insights` (production only)
- SANITY_PROJECT_ID — your Sanity project id (for GROQ proxy)
- SANITY_DATASET — your Sanity dataset name
- GROQ_API_KEY — Sanity **server token** used by `/api/sanity-*` endpoints

Optional (frontend) Vite variables (prefix VITE_ — these are public):
- VITE_APP_TITLE (default `CarbHEALTH`)
- VITE_INITIAL_USERS
- VITE_INITIAL_SUGAR_SAVED
- VITE_ENABLE_TRIVIA (`true|false`)
- VITE_API_URL (if you have a separate API)

Important: keep OPENAI_API_KEY and GROQ_API_KEY as **server** env vars (do NOT prefix with `VITE_`).

---

## 2) Deploy via Vercel dashboard (recommended)
1. Go to https://vercel.com → Import Project → GitHub → select `Mozzicato/CarbHealth`.
2. Set Framework Preset = **Vite** (Vercel usually detects automatically).
3. Build Command: `npm run build`  
   Output Directory: `dist`  
   Root Directory: (project root)
4. Add the Environment Variables listed above (click **Environment Variables** while configuring or after import in Project Settings).
5. Click **Deploy**. Vercel will build and publish — the URL appears after deploy completes.

After first deploy, Vercel will auto-deploy on every push to `main`.

---

## 3) (Alternative) Deploy using Vercel CLI
```bash
# install CLI if needed
npm i -g vercel
vercel login
# run an interactive production deploy
vercel --prod
```

Add production env vars via CLI (interactive):
```bash
vercel env add OPENAI_API_KEY production
vercel env add SANITY_PROJECT_ID production
vercel env add SANITY_DATASET production
vercel env add GROQ_API_KEY production
```

---

## 4) Post‑deploy checks / smoke tests
- Open your site: `https://<your-project>.vercel.app` — check UI, hero stats, food logger.  
- Test AI endpoint (requires OPENAI_API_KEY set in Vercel):
```bash
curl -X POST https://<your-deployment>/api/insights \
  -H 'Content-Type: application/json' \
  -d '{"foodLog":[{"food":{"name":"Coke","carbs":39,"sugar":39,"gi":63},"quantity":1,"time":"2026-02-19T00:00:00Z"}]}'
```
- Test Sanity/GROQ proxy (requires SANITY vars):
```bash
curl -X POST https://<your-deployment>/api/sanity-query \
  -H 'Content-Type: application/json' \
  -d '{"query":"*[_type == \"food\"]"}'
```
- Check serverless logs in Vercel: Project → Deployments → select deployment → **Logs**.

---

## 5) Troubleshooting (common issues)
- `500 /api/insights` → OPENAI_API_KEY missing or invalid. Add/set the key in Project Settings and redeploy.
- `502` from Sanity proxy → SANITY_PROJECT_ID / SANITY_DATASET / GROQ_API_KEY wrong or token lacks permissions.
- AI returns non-JSON → UI falls back to `raw` text; tweak prompt or check model usage / limits.
- Secrets accidentally committed? Rotate them immediately and update Vercel.

---

## 6) Security & cost tips
- Keep keys server-side only. Never expose WRITE tokens to the client.  
- Add rate-limiting or caching to `/api/insights` if you expect frequent calls (OpenAI costs).  
- Add monitoring & alerting in Vercel or with external tools.

---

## 7) Rollback / redeploy
- To rollback to a previous deployment: Vercel → Deployments → Select older deployment → **Promote to Production**.
- To force a rebuild after env changes: push a trivial commit or click **Redeploy** on the latest deployment.

---

## 8) Want me to do it?
- I can add the env vars and trigger a deploy if you provide the keys (or give CLI access).  
- Otherwise follow the steps above — it takes ~2–5 minutes.

---

Good luck — ping me with your Vercel URL once deployed and I’ll run a quick acceptance check (AI + GROQ tests). 🚀
