export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Missing `query` in request body' });

  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const token = process.env.GROQ_API_KEY || process.env.SANITY_API_KEY;

  if (!projectId || !dataset || !token) {
    return res.status(500).json({ error: 'Sanity configuration missing. Set SANITY_PROJECT_ID, SANITY_DATASET and GROQ_API_KEY on server.' });
  }

  const endpoint = `https://${projectId}.api.sanity.io/v2021-06-07/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  try {
    const r = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
    const json = await r.json();
    return res.status(200).json({ ok: true, result: json.result ?? json });
  } catch (err) {
    return res.status(502).json({ error: 'Sanity query failed', details: String(err) });
  }
}
