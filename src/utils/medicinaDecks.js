import orderManifest from '../db/medicina/order.json'

/* webpack: files named like id: medicina-legale-….json */
// eslint-disable-next-line no-undef
const deckContext = require.context('../db/medicina', false, /^\.\/medicina-legale-.+\.json$/)

const byId = {}
deckContext.keys().forEach((key) => {
  const mod = deckContext(key)
  const deck = mod.default ?? mod
  if (deck?.id) {
    byId[deck.id] = deck
  }
})

const declared = Array.isArray(orderManifest.order) ? orderManifest.order : []
const order = declared.filter((id) => byId[id])
const missing = Object.keys(byId)
  .filter((id) => !order.includes(id))
  .sort((a, b) => a.localeCompare(b))

export const medicinaDecks = [...order, ...missing].map((id) => byId[id]).filter(Boolean)

export const DEFAULT_MEDICINA_DECK_ID = medicinaDecks[0]?.id ?? ''

export function getMedicinaDeck(deckId) {
  return byId[deckId] ?? null
}

export function medicinaTestPath(deckId) {
  return `/medicina/test/${deckId}`
}

export function medicinaCardsPath(deckId) {
  return `/medicina/cards/${deckId}`
}

export function medicinaGlossaryPath(deckId) {
  return `/medicina/glossary/${deckId}`
}
