/**
 * Parses Medicina Legale markdown into src/db/medicina/<deck-id>.json
 * and refreshes src/db/medicina/order.json (known ids + new files on disk).
 *
 * Usage:
 *   node scripts/parse-medicina-text.mjs
 *   node scripts/parse-medicina-text.mjs --deck-id=medicina-legale-sapienza-2014-2015
 *   node scripts/parse-medicina-text.mjs --input=altro.md --deck-id=medicina-legale-altro
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const medicinaDir = path.join(root, 'src', 'db', 'medicina')
const orderPath = path.join(medicinaDir, 'order.json')

const inputArg = process.argv.find((a) => a.startsWith('--input='))?.split('=').slice(1).join('=')
const inputPath = path.join(root, inputArg?.trim() || 'text.md')

const deckIdArg = process.argv.find((a) => a.startsWith('--deck-id='))?.split('=')[1]
const deckId = deckIdArg?.trim() || 'medicina-legale-sapienza-2014-2015'

function resolveUniqueDeckId(baseId) {
  let candidate = baseId
  let index = 2
  while (fs.existsSync(path.join(medicinaDir, `${candidate}.json`))) {
    candidate = `${baseId}-${index}`
    index += 1
  }
  return candidate
}

if (!fs.existsSync(inputPath)) {
  console.error(`Input not found: ${inputPath}`)
  process.exit(1)
}

const raw = fs.readFileSync(inputPath, 'utf8')
const lines = raw.split(/\r?\n/)

let title = ''
let i = 0
if (lines[0]?.includes('Medicina') || lines[0]?.startsWith('📘')) {
  title = lines[0].replace(/^📘\s*/, '').trim()
  i = 1
}
while (i < lines.length && lines[i].trim() === '') i++

const bodyLines = lines.slice(i)
const body = bodyLines.join('\n')

const chunks = body.split(/(?=^\d+\.\s)/m).map((c) => c.trim()).filter(Boolean)

const questions = []

for (const chunk of chunks) {
  const chunkLines = chunk.split('\n')
  const head = chunkLines[0].match(/^(\d+)\.\s+(.*)$/)
  if (!head) continue

  const id = parseInt(head[1], 10)
  const promptIt = head[2].trim()

  let promptRu = ''
  const options = []
  let correctKey = ''
  let correctTextIt = ''
  let answerTranslationRu = ''
  const explanation = []

  let phase = 'prompt'

  for (let li = 1; li < chunkLines.length; li++) {
    const line = chunkLines[li]
    const trimmed = line.trim()

    if (trimmed.startsWith('Перевод:')) {
      promptRu = trimmed.replace(/^Перевод:\s*/, '').trim()
      continue
    }

    const optMatch = line.match(/^\s*([a-e])\)\s*(.+)$/)
    if (optMatch && phase !== 'expl') {
      phase = 'options'
      options.push({ key: optMatch[1], textIt: optMatch[2].trim() })
      continue
    }

    const ansMatch = trimmed.match(/^✅\s*Ответ:\s*([a-e])\)\s*(.+)$/)
    if (ansMatch) {
      phase = 'answer'
      correctKey = ansMatch[1]
      correctTextIt = ansMatch[2].trim()
      continue
    }

    const transMatch = trimmed.match(/^👉\s*Перевод:\s*(.+)$/)
    if (transMatch && phase === 'answer') {
      answerTranslationRu = transMatch[1].trim()
      continue
    }

    if (trimmed === 'Объяснение:') {
      phase = 'expl'
      continue
    }

    if (phase === 'expl') {
      explanation.push(line)
      continue
    }

    if (phase === 'answer' && trimmed.startsWith('👉')) {
      const t = trimmed.replace(/^👉\s*Перевод:\s*/, '').trim()
      if (t && !answerTranslationRu) answerTranslationRu = t
    }
  }

  const explanationNormalized = explanation
    .join('\n')
    .replace(/\n+$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*👉\s*/, '').trimEnd())

  questions.push({
    id,
    promptIt,
    promptRu,
    options,
    correctKey,
    correctTextIt,
    answerTranslationRu,
    explanation: explanationNormalized,
  })
}

fs.mkdirSync(medicinaDir, { recursive: true })
const finalDeckId = resolveUniqueDeckId(deckId)
if (finalDeckId !== deckId) {
  console.warn(`Deck "${deckId}" already exists. Creating "${finalDeckId}" instead.`)
}

const deck = {
  id: finalDeckId,
  title: title || 'Medicina Legale',
  sourceLocale: 'it',
  translationLocale: 'ru',
  questions,
}

const outFile = path.join(medicinaDir, `${finalDeckId}.json`)
fs.writeFileSync(outFile, JSON.stringify(deck, null, 2), 'utf8')
console.log(`Wrote ${outFile} (${questions.length} questions)`)

function rebuildOrder() {
  if (!fs.existsSync(medicinaDir)) return

  const files = fs
    .readdirSync(medicinaDir)
    .filter((f) => /^medicina-legale-.+\.json$/.test(f))

  const onDisk = new Map()
  for (const f of files) {
    const p = path.join(medicinaDir, f)
    try {
      const d = JSON.parse(fs.readFileSync(p, 'utf8'))
      if (d?.id) onDisk.set(d.id, true)
    } catch {
      console.warn(`Skip invalid JSON: ${f}`)
    }
  }

  let order = []
  if (fs.existsSync(orderPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(orderPath, 'utf8'))
      if (Array.isArray(prev.order)) order = [...prev.order]
    } catch {
      order = []
    }
  }

  order = order.filter((id) => onDisk.has(id))
  for (const id of [...onDisk.keys()].sort((a, b) => a.localeCompare(b))) {
    if (!order.includes(id)) order.push(id)
  }

  fs.writeFileSync(orderPath, JSON.stringify({ order }, null, 2), 'utf8')
  console.log(`Updated ${orderPath} — ${order.length} deck(s)`)
}

rebuildOrder()
