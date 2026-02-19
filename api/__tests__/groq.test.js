import { describe, it, expect, vi } from 'vitest'
import groqHandler from '../groq'

function mockReqRes(body) {
  const req = { method: 'POST', body }
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  }
  return { req, res }
}

describe('GROQ fallback endpoint', () => {
  it('returns 400 when query missing', async () => {
    const { req, res } = mockReqRes({})
    await groqHandler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('returns food list for *[_type == "food"]', async () => {
    const { req, res } = mockReqRes({ query: '*[_type == "food"]' })
    await groqHandler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true, result: expect.any(Array) }))
  })

  it('supports id filter *[_type == "food" && id == 1]', async () => {
    const { req, res } = mockReqRes({ query: '*[_type == "food" && id == 1]' })
    await groqHandler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true, result: expect.any(Array) }))
  })
})
