export const PROGRESS_SCHEMA_VERSION = 1
export const STORAGE_PREFIX = 'mq:v1:'
export const SESSIONS_LIMIT = 50

export const KEYS = {
  profile: `${STORAGE_PREFIX}profile`,
  statsGlobal: `${STORAGE_PREFIX}stats:global`,
  statsDeck: (deckId) => `${STORAGE_PREFIX}stats:deck:${deckId}`,
  mistakesDeck: (deckId) => `${STORAGE_PREFIX}mistakes:deck:${deckId}`,
  sessions: `${STORAGE_PREFIX}sessions`,
  index: `${STORAGE_PREFIX}index`,
}
