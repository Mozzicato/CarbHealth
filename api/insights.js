export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { foodLog } = req.body || {};
  if (!foodLog || !Array.isArray(foodLog)) {
    return res.status(400).json({ error: 'Missing or invalid `foodLog` in request body' });
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    return res.status(500).json({ error: 'AI provider API key not configured on server' });
  }

  // Build a concise prompt asking the model for structured JSON insights
  const system = `You are a concise nutrition assistant. Given a user's food log, produce up to 5 short, actionable insights about sugar risk, fiber suggestions, healthy swaps, and a one-line summary.`;
  const user = `Food log (array of items): ${JSON.stringify(foodLog)}\n\nRespond with a JSON object exactly in this shape: { "insights": [{ "title": "...", "message": "...", "severity": "low|medium|high" }], "summary": "short summary" }`;

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).json({ error: 'Upstream AI error', details: txt });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content ?? '';

    // try to parse JSON out of the returned text
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      // If model didn't return strict JSON, return raw text in `raw` field
      parsed = { raw: text };
    }

    return res.status(200).json({ ok: true, ai: parsed });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: String(err) });
  }
}
