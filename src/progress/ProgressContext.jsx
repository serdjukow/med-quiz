import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { migrateProfile } from './progressMigrations'
import {
  applySessionCommit,
  clearAllProgressExceptProfile,
  clearDeckProgress,
  readDeckStats,
  readGlobalStats,
  readMistakesDeck,
  readProfile,
  readSessions,
  writeProfile,
} from './progressStorage'

const ProgressContext = createContext(null)

function newProfileFromName(name) {
  const trimmed = name.trim()
  const now = new Date().toISOString()
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `local-${Date.now()}`
  return migrateProfile({
    id,
    name: trimmed,
    createdAt: now,
    lastActiveAt: now,
  })
}

function LocalProfileGate({ profile, onSaved }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!profile?.name) onOpen()
    else onClose()
  }, [profile?.name, onOpen, onClose])

  const handleSave = () => {
    const trimmed = value.trim()
    if (trimmed.length < 1) {
      setError('Введите имя или псевдоним')
      return
    }
    const p = newProfileFromName(trimmed)
    writeProfile(p)
    setError('')
    onSaved(p)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>Локальный профиль</ModalHeader>
        <ModalBody>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Данные обучения сохраняются только в этом браузере на этом устройстве. Это не аккаунт и не
            вход в сервис.
          </Text>
          <FormControl isInvalid={!!error}>
            <FormLabel>Как к вам обращаться?</FormLabel>
            <Input
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (error) setError('')
              }}
              placeholder="Имя или псевдоним"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
              }}
            />
            {error ? (
              <Text fontSize="sm" color="red.500" mt={2}>
                {error}
              </Text>
            ) : null}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleSave}>
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export function ProgressProvider({ children }) {
  const [profile, setProfile] = useState(() => readProfile())
  const [tick, setTick] = useState(0)

  const bump = useCallback(() => setTick((t) => t + 1), [])

  const refreshProfile = useCallback(() => {
    setProfile(readProfile())
  }, [])

  const saveProfileName = useCallback(
    (name) => {
      const trimmed = name.trim()
      if (!trimmed) return
      const existing = readProfile()
      const now = new Date().toISOString()
      const next = existing
        ? migrateProfile({ ...existing, name: trimmed, lastActiveAt: now })
        : newProfileFromName(trimmed)
      if (next) {
        writeProfile(next)
        setProfile(next)
        bump()
      }
    },
    [bump]
  )

  const commitTestSession = useCallback(
    (payload) => {
      applySessionCommit(payload)
      const p = readProfile()
      if (p) {
        writeProfile({ ...p, lastActiveAt: new Date().toISOString() })
        setProfile(readProfile())
      }
      bump()
    },
    [bump]
  )

  const getMistakesMap = useCallback((deckId) => readMistakesDeck(deckId), [])

  const getUnresolvedMistakeQuestionIds = useCallback((deckId) => {
    const m = readMistakesDeck(deckId)
    return Object.values(m)
      .filter((row) => row.resolvedAt == null)
      .map((row) => row.questionId)
  }, [])

  const getDeckStats = useCallback((deckId) => readDeckStats(deckId), [])

  const getGlobalStats = useCallback(() => readGlobalStats(), [])

  const getSessions = useCallback(() => readSessions(), [])

  const resetDeck = useCallback(
    (deckId) => {
      clearDeckProgress(deckId)
      bump()
    },
    [bump]
  )

  const resetAllProgress = useCallback(() => {
    clearAllProgressExceptProfile()
    bump()
  }, [bump])

  const value = useMemo(
    () => ({
      profile,
      saveProfileName,
      commitTestSession,
      getMistakesMap,
      getUnresolvedMistakeQuestionIds,
      getDeckStats,
      getGlobalStats,
      getSessions,
      resetDeck,
      resetAllProgress,
      refreshProfile,
      revision: tick,
    }),
    [
      profile,
      saveProfileName,
      commitTestSession,
      getMistakesMap,
      getUnresolvedMistakeQuestionIds,
      getDeckStats,
      getGlobalStats,
      getSessions,
      resetDeck,
      resetAllProgress,
      refreshProfile,
      tick,
    ]
  )

  return (
    <ProgressContext.Provider value={value}>
      {children}
      <LocalProfileGate
        profile={profile}
        onSaved={(p) => {
          setProfile(p)
          bump()
        }}
      />
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider')
  }
  return ctx
}
