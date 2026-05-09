import { PROGRESS_SCHEMA_VERSION } from './constants'

export function migrateProfile(raw) {
  if (!raw || typeof raw !== 'object') return null
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  if (!name) return null
  return {
    id: typeof raw.id === 'string' ? raw.id : `local-${Date.now()}`,
    name,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    lastActiveAt: typeof raw.lastActiveAt === 'string' ? raw.lastActiveAt : new Date().toISOString(),
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  }
}

export function migrateGlobalStats(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      totalAnswered: 0,
      totalCorrect: 0,
      sessionsCount: 0,
      lastStudyAt: null,
      schemaVersion: PROGRESS_SCHEMA_VERSION,
    }
  }
  return {
    totalAnswered: Number(raw.totalAnswered) || 0,
    totalCorrect: Number(raw.totalCorrect) || 0,
    sessionsCount: Number(raw.sessionsCount) || 0,
    lastStudyAt: raw.lastStudyAt ?? null,
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  }
}

export function migrateDeckStats(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      answered: 0,
      correct: 0,
      wrong: 0,
      attempts: 0,
      accuracy: 0,
      bestAccuracy: 0,
      lastAccuracy: 0,
      mistakesCount: 0,
      resolvedMistakesCount: 0,
      updatedAt: null,
      schemaVersion: PROGRESS_SCHEMA_VERSION,
    }
  }
  return {
    answered: Number(raw.answered) || 0,
    correct: Number(raw.correct) || 0,
    wrong: Number(raw.wrong) || 0,
    attempts: Number(raw.attempts) || 0,
    accuracy: Number(raw.accuracy) || 0,
    bestAccuracy: Number(raw.bestAccuracy) || 0,
    lastAccuracy: Number(raw.lastAccuracy) || 0,
    mistakesCount: Number(raw.mistakesCount) || 0,
    resolvedMistakesCount: Number(raw.resolvedMistakesCount) || 0,
    updatedAt: raw.updatedAt ?? null,
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  }
}

export function migrateMistakesMap(raw) {
  if (!raw || typeof raw !== 'object') return {}
  const out = {}
  Object.entries(raw).forEach(([key, val]) => {
    if (!val || typeof val !== 'object') return
    const qid = val.questionId ?? Number(key)
    if (qid == null || Number.isNaN(Number(qid))) return
    out[String(qid)] = {
      questionId: Number(qid),
      selectedKey: typeof val.selectedKey === 'string' ? val.selectedKey : '',
      correctKey: typeof val.correctKey === 'string' ? val.correctKey : '',
      wrongCount: Number(val.wrongCount) || 0,
      lastWrongAt: val.lastWrongAt ?? null,
      resolvedAt: val.resolvedAt ?? null,
    }
  })
  return out
}

export function migrateSessions(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((s) => s && typeof s === 'object')
    .map((s) => ({
      deckId: String(s.deckId),
      startedAt: s.startedAt,
      finishedAt: s.finishedAt,
      correct: Number(s.correct) || 0,
      wrong: Number(s.wrong) || 0,
      accuracy: Number(s.accuracy) || 0,
      mode: s.mode === 'mistakes' ? 'mistakes' : 'normal',
    }))
}

export function migrateIndex(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.deckIds)) {
    return { deckIds: [], schemaVersion: PROGRESS_SCHEMA_VERSION }
  }
  return {
    deckIds: [...new Set(raw.deckIds.map(String))],
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  }
}
