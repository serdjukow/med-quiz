import { useState, useMemo, useEffect, useRef } from 'react'
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Progress,
  Badge,
  useColorModeValue,
  Collapse,
  Divider,
  List,
  ListItem,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { getMedicinaDeck, medicinaCardsPath, medicinaTestPath } from '../../utils/medicinaDecks'
import { MEDICINA_ROUTE } from '../../utils/consts'
import MedicinaBreadcrumbs from './MedicinaBreadcrumbs'
import MistakeReviewModal from './MistakeReviewModal'
import { useProgress } from '../../progress/ProgressContext'

const MedicinaTestPage = () => {
  const { deckId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'mistakes' ? 'mistakes' : 'normal'

  const { commitTestSession, getUnresolvedMistakeQuestionIds, getMistakesMap, revision } =
    useProgress()

  const deck = getMedicinaDeck(deckId)
  const allQuestions = deck?.questions ?? []

  /* eslint-disable react-hooks/exhaustive-deps -- revision сбрасывает кэш после записи в localStorage */
  const { mistakeIdsList, activeQuestions } = useMemo(() => {
    const list = deckId ? getUnresolvedMistakeQuestionIds(deckId) : []
    const set = new Set(list)
    if (!deck) return { mistakeIdsList: list, activeQuestions: [] }
    const active =
      mode === 'mistakes' ? deck.questions.filter((q) => set.has(q.id)) : deck.questions
    return { mistakeIdsList: list, activeQuestions: active }
  }, [deck, deckId, mode, getUnresolvedMistakeQuestionIds, revision])
  /* eslint-enable react-hooks/exhaustive-deps */

  const [index, setIndex] = useState(0)
  const [answerByIndex, setAnswerByIndex] = useState([])
  const [showExpl, setShowExpl] = useState(true)
  const sessionStartRef = useRef(new Date().toISOString())
  const reviewModal = useDisclosure()

  useEffect(() => {
    sessionStartRef.current = new Date().toISOString()
  }, [deckId, mode])

  useEffect(() => {
    setIndex(0)
    setAnswerByIndex([])
    setShowExpl(true)
  }, [deckId, mode])

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.800', 'white')
  const muted = useColorModeValue('gray.600', 'gray.400')
  const optionBg = useColorModeValue('gray.50', 'gray.700')
  const stickyBarBg = useColorModeValue('whiteAlpha.920', 'gray.900')

  const q = activeQuestions[index]
  const currentAnswer = answerByIndex[index]
  const answered = !!currentAnswer
  const selectedKey = currentAnswer?.selectedKey ?? null
  const isLast = index >= activeQuestions.length - 1
  const finished = index >= activeQuestions.length

  const correctCount = useMemo(
    () => answerByIndex.filter((a) => a && a.isCorrect).length,
    [answerByIndex]
  )

  const mistakesForReview = deck
    ? Object.values(getMistakesMap(deck.id)).filter((m) => m.resolvedAt == null)
    : []

  if (!deck || allQuestions.length === 0) {
    return (
      <Box py={12} px={4}>
        <Container maxW="md">
          <MedicinaBreadcrumbs current="test" />
          <Alert status="warning" borderRadius="lg" mt={4}>
            <AlertIcon />
            <Box>
              <AlertTitle>Тест не найден</AlertTitle>
              <AlertDescription>
                Проверьте ссылку или вернитесь к списку тестов.
              </AlertDescription>
            </Box>
          </Alert>
          <Button as={RouterLink} to={MEDICINA_ROUTE} colorScheme="teal" mt={6} w="100%">
            Все тесты
          </Button>
        </Container>
      </Box>
    )
  }

  if (mode === 'mistakes' && activeQuestions.length === 0) {
    return (
      <Box py={{ base: 8, md: 12 }} px={{ base: 3, md: 4 }}>
        <Container maxW="md">
          <MedicinaBreadcrumbs deck={deck} current="test" />
          <Alert status="info" borderRadius="lg" mt={4}>
            <AlertIcon />
            <Box>
              <AlertTitle>Нет ошибок для повтора</AlertTitle>
              <AlertDescription>
                Нерешённых ошибок по этому набору пока нет. Пройдите обычный тест или сбросьте прогресс в разделе «Мой прогресс».
              </AlertDescription>
            </Box>
          </Alert>
          <Button as={RouterLink} to={medicinaTestPath(deck.id)} colorScheme="teal" mt={6} w="100%">
            Обычный тест
          </Button>
        </Container>
      </Box>
    )
  }

  const pickOption = (key) => {
    if (answered) return
    const row = {
      questionId: q.id,
      selectedKey: key,
      correctKey: q.correctKey,
      isCorrect: key === q.correctKey,
    }
    setAnswerByIndex((prev) => {
      const next = [...prev]
      next[index] = row
      return next
    })
  }

  const flushSession = () => {
    const answers = answerByIndex.filter(Boolean)
    if (answers.length > 0) {
      commitTestSession({
        deckId: deck.id,
        mode,
        startedAt: sessionStartRef.current,
        finishedAt: new Date().toISOString(),
        answers,
      })
    }
  }

  const goNext = () => {
    if (isLast) {
      flushSession()
      setIndex(activeQuestions.length)
      return
    }
    setIndex((i) => i + 1)
    setShowExpl(true)
  }

  const restartNormal = () => {
    setSearchParams({}, { replace: true })
    setIndex(0)
    setAnswerByIndex([])
    setShowExpl(true)
    sessionStartRef.current = new Date().toISOString()
  }

  const restartSameMode = () => {
    setIndex(0)
    setAnswerByIndex([])
    setShowExpl(true)
    sessionStartRef.current = new Date().toISOString()
  }

  if (finished) {
    return (
      <Box py={{ base: 8, md: 12 }} px={{ base: 3, md: 4 }}>
        <Container maxW="lg">
          <MedicinaBreadcrumbs deck={deck} current="test" />
          <VStack
            spacing={6}
            p={{ base: 5, md: 8 }}
            mt={4}
            bg={cardBg}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={borderColor}
            textAlign="center"
          >
            <HStack justify="center" flexWrap="wrap" spacing={2}>
              {mode === 'mistakes' ? (
                <Badge colorScheme="purple">Повтор ошибок</Badge>
              ) : (
                <Badge colorScheme="teal">Обычный тест</Badge>
              )}
            </HStack>
            <Text fontSize="sm" color={muted} noOfLines={3}>
              {deck.title}
            </Text>
            <Heading size="lg">Результат</Heading>
            <Text fontSize="3xl" fontWeight="700" color="teal.500">
              {correctCount} / {activeQuestions.length}
            </Text>
            <Text color={muted}>
              Правильных: {correctCount}. Можно пройти снова, повторить ошибки или открыть разбор.
            </Text>
            <HStack spacing={3} flexWrap="wrap" justify="center">
              {mode === 'mistakes' ? (
                <>
                  <Button colorScheme="teal" onClick={restartNormal}>
                    Полный тест
                  </Button>
                  <Button variant="outline" colorScheme="teal" onClick={restartSameMode}>
                    Ещё раз по ошибкам
                  </Button>
                </>
              ) : (
                <Button colorScheme="teal" onClick={restartNormal}>
                  Повторить тест
                </Button>
              )}
              {mistakeIdsList.length > 0 ? (
                <Button
                  as={RouterLink}
                  to={`${medicinaTestPath(deck.id)}?mode=mistakes`}
                  variant="outline"
                  colorScheme="orange"
                >
                  Повторить ошибки
                </Button>
              ) : (
                <Button variant="outline" colorScheme="orange" isDisabled cursor="not-allowed">
                  Повторить ошибки
                </Button>
              )}
              {mistakesForReview.length > 0 ? (
                <Button variant="outline" onClick={reviewModal.onOpen}>
                  Разбор ошибок
                </Button>
              ) : null}
              <Button as={RouterLink} to={medicinaCardsPath(deck.id)} variant="outline" colorScheme="teal">
                Карточки
              </Button>
              <Button as={RouterLink} to={MEDICINA_ROUTE} variant="outline">
                Другие тесты
              </Button>
            </HStack>
          </VStack>

          <MistakeReviewModal
            isOpen={reviewModal.isOpen}
            onClose={reviewModal.onClose}
            deck={deck}
            mistakesForReview={mistakesForReview}
          />
        </Container>
      </Box>
    )
  }

  return (
    <Box pb={{ base: 28, md: 12 }} pt={{ base: 6, md: 10 }} px={{ base: 3, md: 4 }}>
      <Container maxW="720px">
        <VStack spacing={5} align="stretch">
          <MedicinaBreadcrumbs deck={deck} current="test" />
          <VStack align="stretch" spacing={1}>
            <HStack justify="space-between" flexWrap="wrap" gap={2}>
              <HStack flexWrap="wrap" spacing={2}>
                <Button as={RouterLink} to={MEDICINA_ROUTE} variant="link" colorScheme="teal" size="sm">
                  ← Все наборы
                </Button>
                <Button
                  as={RouterLink}
                  to={medicinaCardsPath(deck.id)}
                  variant="link"
                  colorScheme="teal"
                  size="sm"
                >
                  К карточкам
                </Button>
              </HStack>
              <HStack>
                {mode === 'mistakes' ? (
                  <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>
                    Ошибки
                  </Badge>
                ) : null}
                <Badge colorScheme="teal" fontSize="sm" px={2} py={1}>
                  {index + 1} / {activeQuestions.length}
                </Badge>
              </HStack>
            </HStack>
            <Text fontSize="xs" color={muted} noOfLines={2}>
              {deck.title}
            </Text>
          </VStack>

          <Progress
            value={((index + (answered ? 1 : 0)) / activeQuestions.length) * 100}
            size="sm"
            colorScheme="teal"
            borderRadius="full"
          />

          <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
          >
            <Text fontSize="sm" color={muted} mb={2}>
              Вопрос
            </Text>
            <Heading as="h2" fontSize={{ base: 'lg', md: 'xl' }} mb={3} color={textColor}>
              {q.promptIt}
            </Heading>
            <Text fontSize={{ base: 'sm', md: 'md' }} color={muted} lineHeight="tall">
              Перевод: {q.promptRu}
            </Text>

            <SimpleGrid columns={1} spacing={3} mt={6}>
              {q.options.map((opt) => {
                const isSel = selectedKey === opt.key
                const isCor = opt.key === q.correctKey
                let scheme = 'gray'
                if (answered) {
                  if (isCor) scheme = 'green'
                  else if (isSel && !isCor) scheme = 'red'
                }
                return (
                  <Button
                    key={opt.key}
                    onClick={() => pickOption(opt.key)}
                    disabled={answered}
                    variant={answered && (isCor || isSel) ? 'solid' : 'outline'}
                    colorScheme={scheme}
                    justifyContent="flex-start"
                    whiteSpace="normal"
                    h="auto"
                    py={3}
                    px={4}
                    textAlign="left"
                    fontWeight="500"
                    bg={answered ? undefined : optionBg}
                    borderWidth="2px"
                  >
                    <Text as="span" fontWeight="700" mr={2}>
                      {opt.key})
                    </Text>
                    <Text as="span">{opt.textIt}</Text>
                  </Button>
                )
              })}
            </SimpleGrid>

            <Collapse in={answered && showExpl} animateOpacity>
              <Divider my={5} />
              <VStack align="stretch" spacing={3}>
                <Box>
                  <Text fontSize="sm" color="green.500" fontWeight="600">
                    Правильный ответ: {q.correctKey}) {q.correctTextIt}
                  </Text>
                  <Text fontSize="sm" color={muted} mt={1}>
                    Перевод ответа: {q.answerTranslationRu}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="600" color={textColor} mb={2}>
                    Объяснение
                  </Text>
                  <List spacing={2}>
                    {q.explanation.map((line, i) => (
                      <ListItem key={i} fontSize="sm" color={muted} pl={1}>
                        {line}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </VStack>
            </Collapse>

            {answered && (
              <Button
                mt={4}
                variant="ghost"
                size="sm"
                rightIcon={showExpl ? <ChevronUpIcon /> : <ChevronDownIcon />}
                onClick={() => setShowExpl(!showExpl)}
              >
                {showExpl ? 'Скрыть объяснение' : 'Показать объяснение'}
              </Button>
            )}
          </Box>

          <Box
            position={{ base: 'fixed', md: 'static' }}
            bottom={0}
            left={0}
            right={0}
            p={4}
            bg={stickyBarBg}
            backdropFilter="blur(8px)"
            borderTopWidth={{ base: '1px', md: 0 }}
            borderColor={borderColor}
            zIndex={10}
          >
            <Button
              colorScheme="teal"
              size="lg"
              w="100%"
              isDisabled={!answered}
              onClick={goNext}
            >
              {isLast ? 'Показать результат' : 'Следующий вопрос'}
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default MedicinaTestPage
