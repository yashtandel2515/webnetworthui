import test from 'node:test'
import assert from 'node:assert/strict'
import { goldValue, isUsableGoldQuote, TROY_OUNCE_GRAMS } from '../src/goldPrice.js'

test('values gold by net weight and carat, including fractional grams', () => {
  assert.equal(goldValue(10, 24, 10000), 100000)
  assert.equal(goldValue(10, 18, 10000), 75000)
  assert.ok(Math.abs(goldValue(2.5, 22, 10000) - 22916.6666667) < 0.001)
  assert.equal(goldValue(-1, 22, 10000), 0)
  assert.equal(goldValue(10, 25, 10000), 0)
})

test('accepts weekend quotes but rejects stale, future and invalid prices', () => {
  const now = Date.now()
  const quote = (age) => ({ pricePerGram24k: 10000, updatedAt: new Date(now - age).toISOString() })
  assert.ok(isUsableGoldQuote(quote(2 * 86400000), now))
  assert.ok(!isUsableGoldQuote(quote(5 * 86400000), now))
  assert.ok(!isUsableGoldQuote(quote(-3600000), now))
  assert.ok(!isUsableGoldQuote({ pricePerGram24k: -1, updatedAt: new Date(now).toISOString() }, now))
})

test('converts INR per troy ounce and caches the verified quote', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({ symbol: 'XAU', currency: 'INR', price: TROY_OUNCE_GRAMS * 10000, updatedAt: new Date().toISOString() }) }))
  const { fetchGoldQuote } = await import('../src/goldPrice.js?cache-test')
  const quote = await fetchGoldQuote()
  assert.equal(quote.pricePerGram24k, 10000)
  assert.deepEqual(await fetchGoldQuote(), quote)
  assert.equal(fetchMock.mock.callCount(), 1)
})

test('rejects non-INR responses and retries after failure', async (t) => {
  let currency = 'USD'
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({ symbol: 'XAU', currency, price: 300000, updatedAt: new Date().toISOString() }) }))
  const { fetchGoldQuote } = await import('../src/goldPrice.js?retry-test')
  await assert.rejects(fetchGoldQuote(), /recent INR gold price/)
  currency = 'INR'
  assert.ok((await fetchGoldQuote()).pricePerGram24k > 0)
})

test('does not invent a price when the feed is unavailable', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false }))
  const { fetchGoldQuote } = await import('../src/goldPrice.js?failure-test')
  await assert.rejects(fetchGoldQuote(), /unavailable/)
})
