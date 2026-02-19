import { FOODS } from '../src/data/foods.js'
import { TRIVIA } from '../src/data/trivia.js'

// Lightweight GROQ fallback for local/dev use.
// Supports a minimal set of queries used by the app:
// - *[_type == "food"]
// - *[_type == "trivia"]
// - *[_type == "food" && id == <num>]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { query } = req.body || {}
  if (!query) return res.status(400).json({ error: 'Missing `query` in request body' })

  const q = String(query).trim()

  if (q === '*[_type == "food"]') {
    return res.status(200).json({ ok: true, result: FOODS })
  }

  if (q === '*[_type == "trivia"]') {
    return res.status(200).json({ ok: true, result: TRIVIA })
  }

  const idMatch = q.match(/^\*\s*\[\s*_type\s*==\s*"food"\s*&&\s*id\s*==\s*(\d+)\s*\]$/)
  if (idMatch) {
    const id = Number(idMatch[1])
    const item = FOODS.find((f) => f.id === id)
    return res.status(200).json({ ok: true, result: item ? [item] : [] })
  }

  return res.status(400).json({ error: 'Unsupported GROQ query in fallback serverless implementation' })
}
