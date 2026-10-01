export const GOLD_PRICE_URL = 'https://api.gold-api.com/price/XAU/INR'
export const TROY_OUNCE_GRAMS = 31.1034768
let cachedQuote
let pendingQuote

export function goldValue(grams, carat, pricePerGram24k) {
  const weight = Number(grams)
  const purity = Number(carat)
  if (!Number.isFinite(weight) || weight < 0 || ![24, 22, 20, 18, 14, 9].includes(purity) || !Number.isFinite(pricePerGram24k) || pricePerGram24k <= 0) return 0
  return weight * purity / 24 * pricePerGram24k
}

export function isUsableGoldQuote(quote, now = Date.now()) {
  const age = now - Date.parse(quote?.updatedAt)
  return Number.isFinite(quote?.pricePerGram24k) && quote.pricePerGram24k > 0 && age >= -300000 && age <= 4 * 86400000
}

export async function fetchGoldQuote() {
  if (cachedQuote && Date.now() - cachedQuote.fetchedAt < 30000 && isUsableGoldQuote(cachedQuote)) return cachedQuote
  if (pendingQuote) return pendingQuote
  pendingQuote = (async () => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch(GOLD_PRICE_URL, { signal: controller.signal })
      if (!response.ok) throw new Error('Gold price is unavailable. Please retry.')
      const data = await response.json()
      const quote = { pricePerGram24k: data.price / TROY_OUNCE_GRAMS, updatedAt: data.updatedAt, fetchedAt: Date.now() }
      if (data.symbol !== 'XAU' || data.currency !== 'INR' || !isUsableGoldQuote(quote)) throw new Error('A recent INR gold price is unavailable. Please retry.')
      cachedQuote = quote
      return quote
    } finally {
      clearTimeout(timeout)
    }
  })()
  try { return await pendingQuote } finally { pendingQuote = null }
}
