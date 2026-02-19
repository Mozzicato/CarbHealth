export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { foodLog } = req.body || {};
  if (!foodLog || !Array.isArray(foodLog)) {
    return res.status(400).json({ error: 'Missing or invalid `foodLog` in request body' });
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_URL = process.env.GEMINI_API_URL; // optional custom URL for Gemini
  const GROQ_KEY = process.env.GROQ_API_KEY;
  const GROQ_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1';
  const GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-8b';
  const OPENAI_KEY = process.env.OPENAI_API_KEY;

  if (!GEMINI_KEY && !GROQ_KEY && !OPENAI_KEY) {
    return res.status(500).json({ error: 'AI provider API key not configured on server. Set GEMINI_API_KEY, GROQ_API_KEY or OPENAI_API_KEY.' });
  }

  const system = `You are a concise nutrition assistant. Given a user's food log, produce up to 5 short, actionable insights about sugar risk, fiber suggestions, healthy swaps, and a one-line summary.`;
  const user = `Food log (array of items): ${JSON.stringify(foodLog)}\n\nRespond with a JSON object exactly in this shape: { "insights": [{ "title": "...", "message": "...", "severity": "low|medium|high" }], "summary": "short summary" }`;

  // 1) Primary: Gemini (managed by Google)
  if (GEMINI_KEY) {
    try {
      const endpoint = GEMINI_URL || `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${GEMINI_KEY}`;
      const body = {
        prompt: { text: `${system}\n\n${user}` },
        temperature: 0.7,
        maxOutputTokens: 800,
      };

      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const txt = await r.text();
        return res.status(502).json({ error: 'Upstream Gemini error', details: txt });
      }

      const data = await r.json();
      const text = data.candidates?.[0]?.output || data.candidates?.[0]?.content?.[0]?.text || data.output?.[0]?.content_text || data.output_text || '';

      let parsed = null;
      try { parsed = JSON.parse(text); } catch (err) { parsed = { raw: text }; }
      return res.status(200).json({ ok: true, ai: parsed });
    } catch (err) {
      return res.status(500).json({ error: 'Gemini request failed', message: String(err) });
    }
  }

  // 2) Secondary fallback: Groq LPU (OpenAI-compatible endpoint)
  if (GROQ_KEY) {
    // Groq System Prime provided by user — embedded as the system message
    const groqSystemPrime = `System Prime: Technical Context for Groq Integration

Role: You are an AI assistant powered by the Groq LPU (Language Processing Unit). Your goal is to leverage high-speed inference to provide near-instantaneous responses.

Technical Context for Your Knowledge Base:

- Hardware: Running on Groq's proprietary LPU inference engine (deterministic, tensor-streaming architecture).
- API Compatibility: Groq exposes an OpenAI-compatible REST API at https://api.groq.com/openai/v1
- Key Models: Llama 3 (8B, 70B), Mixtral 8x7B, Gemma
- Performance: ~300–800 tokens/sec (suitable for real-time/low-latency applications)

Instructions for Interaction:

1) Format: For code examples prefer the groq Python library or LangChain's ChatGroq integration.
2) Efficiency: Provide comprehensive, detailed answers — low latency is expected.
3) API Example (Python):
from groq import Groq
client = Groq(api_key="YOUR_API_KEY")
completion = client.chat.completions.create(
  model="llama3-70b-8192",
  messages=[{"role":"user","content":"Hello!"}]
)
print(completion.choices[0].message.content)

Confirmation: Acknowledge that you understand your architecture is based on Groq LPUs and are ready to provide high-speed, low-latency assistance.`;

    try {
      const endpoint = `${GROQ_URL}/chat/completions`;
      const payload = {
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: groqSystemPrime },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 800,
      };

      const r = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const txt = await r.text();
        return res.status(502).json({ error: 'Upstream Groq error', details: txt });
      }

      const data = await r.json();
      const text = data.choices?.[0]?.message?.content ?? data.output_text ?? '';

      let parsed = null;
      try { parsed = JSON.parse(text); } catch (err) { parsed = { raw: text }; }
      return res.status(200).json({ ok: true, ai: parsed });
    } catch (err) {
      return res.status(500).json({ error: 'Groq request failed', message: String(err) });
    }
  }

  // 3) Tertiary fallback: OpenAI
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

    let parsed = null;
    try { parsed = JSON.parse(text); } catch (err) { parsed = { raw: text }; }
    return res.status(200).json({ ok: true, ai: parsed });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: String(err) });
  }
}
