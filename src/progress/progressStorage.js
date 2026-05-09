import { KEYS, SESSIONS_LIMIT, STORAGE_PREFIX } from './constants'
import * as mig from './progressMigrations'

function safeParse(json, fallback) {
  try {
    if (json == null || json === '') return fallback
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function readProfile() {
  const raw = safeParse(localStorage.getItem(KEYS.profile), null)
  return mig.migrateProfile(raw)
}

export function writeProfile(profile) {
  localStorage.setItem(KEYS.profile, JSON.stringify(profile))
}

export function readGlobalStats() {
  return mig.migrateGlobalStats(safeParse(localStorage.getItem(KEYS.statsGlobal), null))
}

export function readDeckStats(deckId) {
  return mig.migrateDeckStats(safeParse(localStorage.getItem(KEYS.statsDeck(String(deckId))), null))
}

export function readMistakesDeck(deckId) {
  return mig.migrateMistakesMap(safeParse(localStorage.getItem(KEYS.mistakesDeck(String(deckId))), {}))
}

export function readSessions() {
  return mig.migrateSessions(safeParse(localStorage.getItem(KEYS.sessions), null))
}

export function readIndex() {
  return mig.migrateIndex(safeParse(localStorage.getItem(KEYS.index), null))
}

function addDeckToIndex(deckId) {
  const id = String(deckId)
  const idx = mig.migrateIndex(safeParse(localStorage.getItem(KEYS.index), null))
  if (!idx.deckIds.includes(id)) {
    idx.deckIds.push(id)
    localStorage.setItem(KEYS.index, JSON.stringify(idx))
  }
}

/**
 * @param {object} payload
 * @param {string} payload.deckId
 * @param {'normal'|'mistakes'} payload.mode
 * @param {string} payload.startedAt ISO
 * @param {string} payload.finishedAt ISO
 * @param {Array<{ questionId: number, selectedKey: string, correctKey: string, isCorrect: boolean }>} payload.answers
 */
export function applySessionCommit(payload) {
  const { deckId, mode, startedAt, finishedAt, answers } = payload
  const id = String(deckId)
  let mistakes = readMistakesDeck(id)
  let deckStats = readDeckStats(id)
  let globalStats = readGlobalStats()
  let sessions = readSessions()

  const n = answers.length
  const correct = answers.filter((a) => a.isCorrect).length
  const wrong = n - correct
  const lastAcc = n ? correct / n : 0

  for (const a of answers) {
    const key = String(a.questionId)
    if (!a.isCorrect) {
      const prev = mistakes[key] || { questionId: a.questionId, wrongCount: 0 }
      mistakes[key] = {
        questionId: a.questionId,
        selectedKey: a.selectedKey,
        correctKey: a.correctKey,
        wrongCount: (prev.wrongCount || 0) + 1,
        lastWrongAt: finishedAt,
        resolvedAt: null,
      }
    } else if (mode === 'mistakes' && mistakes[key]) {
      mistakes[key] = {
        ...mistakes[key],
        resolvedAt: finishedAt,
      }
    }
  }

  const vals = Object.values(mistakes)
  deckStats.mistakesCount = vals.filter((m) => m.resolvedAt == null).length
  deckStats.resolvedMistakesCount = vals.filter((m) => m.resolvedAt != null).length

  deckStats.answered += n
  deckStats.correct += correct
  deckStats.wrong += wrong
  deckStats.attempts += 1
  deckStats.lastAccuracy = lastAcc
  deckStats.bestAccuracy = Math.max(deckStats.bestAccuracy || 0, lastAcc)
  deckStats.accuracy = deckStats.answered ? deckStats.correct / deckStats.answered : 0
  deckStats.updatedAt = finishedAt

  globalStats.totalAnswered += n
  globalStats.totalCorrect += correct
  globalStats.sessionsCount += 1
  globalStats.lastStudyAt = finishedAt

  sessions.unshift({
    deckId: id,
    startedAt,
    finishedAt,
    correct,
    wrong,
    accuracy: lastAcc,
    mode,
  })
  sessions = sessions.slice(0, SESSIONS_LIMIT)

  localStorage.setItem(KEYS.mistakesDeck(id), JSON.stringify(mistakes))
  localStorage.setItem(KEYS.statsDeck(id), JSON.stringify(deckStats))
  localStorage.setItem(KEYS.statsGlobal, JSON.stringify(globalStats))
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions))
  addDeckToIndex(id)
}

export function clearDeckProgress(deckId) {
  const id = String(deckId)
  const deckStats = readDeckStats(id)
  let globalStats = readGlobalStats()
  let sessions = readSessions()
  const removed = sessions.filter((s) => s.deckId === id)
  sessions = sessions.filter((s) => s.deckId !== id)

  globalStats.totalAnswered = Math.max(0, globalStats.totalAnswered - deckStats.answered)
  globalStats.totalCorrect = Math.max(0, globalStats.totalCorrect - deckStats.correct)
  globalStats.sessionsCount = Math.max(0, globalStats.sessionsCount - removed.length)

  localStorage.removeItem(KEYS.mistakesDeck(id))
  localStorage.removeItem(KEYS.statsDeck(id))
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions))
  localStorage.setItem(KEYS.statsGlobal, JSON.stringify(globalStats))

  const idx = readIndex()
  idx.deckIds = idx.deckIds.filter((d) => d !== id)
  localStorage.setItem(KEYS.index, JSON.stringify(idx))
}

export function clearAllProgressExceptProfile() {
  const keys = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const k = localStorage.key(i)
    if (k && k.startsWith(STORAGE_PREFIX) && k !== KEYS.profile) keys.push(k)
  }
  keys.forEach((k) => localStorage.removeItem(k))
}
