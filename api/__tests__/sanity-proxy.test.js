import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import queryHandler from '../sanity-query'
import mutateHandler from '../sanity-mutate'

function mockReqRes(body) {
  const req = { method: 'POST', body }
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  }
  return { req, res }
}

describe('Sanity proxy endpoints', () => {
  let originalFetch
  beforeEach(() => {
    originalFetch = global.fetch
  })
  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('returns error when SANITY env missing', async () => {
    delete process.env.SANITY_PROJECT_ID
    delete process.env.SANITY_DATASET
    delete process.env.GROQ_API_KEY

    const { req, res } = mockReqRes({ query: '*[_type == "food"]' })
    await queryHandler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
  })

  it('proxies query to Sanity and returns result', async () => {
    process.env.SANITY_PROJECT_ID = 'proj'
    process.env.SANITY_DATASET = 'dataset'
    process.env.GROQ_API_KEY = 'token'

    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ result: [{ name: 'Coca' }] }) }))

    const { req, res } = mockReqRes({ query: '*[_type == "food"]' })
    await queryHandler(req, res)

    expect(global.fetch).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalled()
  })

  it('mutates via Sanity mutate endpoint', async () => {
    process.env.SANITY_PROJECT_ID = 'proj'
    process.env.SANITY_DATASET = 'dataset'
    process.env.GROQ_API_KEY = 'token'

    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ results: [] }) }))

    const { req, res } = mockReqRes({ mutations: [{ create: { _type: 'test', title: 'x' } }] })
    await mutateHandler(req, res)

    expect(global.fetch).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
