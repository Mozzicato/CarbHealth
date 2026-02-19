import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import handler from '../insights'

function mockReqRes(body) {
  const req = { method: 'POST', body }
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  }
  return { req, res }
}

describe('AI insights endpoint (Gemini → Groq)', () => {
  let origFetch
  const OLDS = { ...process.env }

  beforeEach(() => {
    origFetch = global.fetch
  })
  afterEach(() => {
    global.fetch = origFetch
    process.env = { ...OLDS }
    vi.restoreAllMocks()
  })

  it('returns 500 when no AI keys configured', async () => {
    delete process.env.GEMINI_API_KEY
    delete process.env.GROQ_API_KEY

    const { req, res } = mockReqRes({ foodLog: [] })
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
  })

  it('uses Groq when GROQ_API_KEY is set and Gemini missing', async () => {
    delete process.env.GEMINI_API_KEY
    process.env.GROQ_API_KEY = 'groq-token'

    const aiResponse = JSON.stringify({ insights: [{ title: 'AI Tip', message: 'AI suggestion', severity: 'low' }], summary: 'ok' })
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ choices: [{ message: { content: aiResponse } }] }) }))

    const { req, res } = mockReqRes({ foodLog: [{ food: { name: 'Coke', carbs: 39, sugar: 39 }, quantity: 1 }] })
    await handler(req, res)

    expect(global.fetch).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true, provider: 'groq', ai: expect.any(Object) }))
  })

  it('prefers Gemini when GEMINI_API_KEY is present', async () => {
    process.env.GEMINI_API_KEY = 'gemini-token'
    delete process.env.GROQ_API_KEY

    // stub Gemini style response
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ candidates: [{ output: JSON.stringify({ insights: [], summary: 'gemini' }) }] }) }))

    const { req, res } = mockReqRes({ foodLog: [{ food: { name: 'Beans', carbs: 40 }, quantity: 1 }] })
    await handler(req, res)

    expect(global.fetch).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true, provider: 'gemini' }))
  })

  it('falls back to Groq when Gemini responds with non-OK and GROQ_API_KEY is set', async () => {
    process.env.GEMINI_API_KEY = 'gemini-token'
    process.env.GROQ_API_KEY = 'groq-token'

    // first call (Gemini) returns non-OK; second call (Groq) succeeds
    global.fetch = vi.fn((url) => {
      if (String(url).includes('generativelanguage.googleapis.com')) {
        return Promise.resolve({ ok: false, text: () => Promise.resolve('gemini error') })
      }
      // Groq-style success
      const aiResponse = JSON.stringify({ insights: [{ title: 'From Groq', message: 'ok', severity: 'low' }], summary: 'groq' })
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ choices: [{ message: { content: aiResponse } }] }) })
    })

    const { req, res } = mockReqRes({ foodLog: [{ food: { name: 'Coke', carbs: 39, sugar: 39 }, quantity: 1 }] })
    await handler(req, res)

    expect(global.fetch).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true, provider: 'groq', ai: expect.any(Object) }))
  })


})