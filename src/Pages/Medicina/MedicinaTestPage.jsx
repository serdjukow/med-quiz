import { useState, useMemo, useEffect } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
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
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { getMedicinaDeck, medicinaCardsPath } from '../../utils/medicinaDecks'
import { MEDICINA_ROUTE } from '../../utils/consts'

const MedicinaTestPage = () => {
  const { deckId } = useParams()
  const deck = getMedicinaDeck(deckId)
  const questions = deck?.questions ?? []

  const [index, setIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState(null)
  const [scores, setScores] = useState([])
  const [showExpl, setShowExpl] = useState(true)

  useEffect(() => {
    setIndex(0)
    setSelectedKey(null)
    setScores([])
    setShowExpl(true)
  }, [deckId])

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.800', 'white')
  const muted = useColorModeValue('gray.600', 'gray.400')
  const optionBg = useColorModeValue('gray.50', 'gray.700')
  const stickyBarBg = useColorModeValue('whiteAlpha.920', 'gray.900')

  const q = questions[index]
  const answered = selectedKey !== null
  const isLast = index >= questions.length - 1
  const finished = index >= questions.length

  const correctCount = useMemo(
    () => scores.filter(Boolean).length,
    [scores]
  )

  if (!deck || questions.length === 0) {
    return (
      <Box py={12} px={4}>
        <Container maxW="md">
          <Alert status="warning" borderRadius="lg">
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

  const pickOption = (key) => {
    if (answered) return
    setSelectedKey(key)
    const ok = key === q.correctKey
    setScores((prev) => {
      const next = [...prev]
      next[index] = ok
      return next
    })
  }

  const goNext = () => {
    if (isLast) {
      setIndex(questions.length)
      return
    }
    setIndex((i) => i + 1)
    setSelectedKey(null)
    setShowExpl(true)
  }

  const restart = () => {
    setIndex(0)
    setSelectedKey(null)
    setScores([])
    setShowExpl(true)
  }

  if (finished) {
    return (
      <Box py={{ base: 8, md: 12 }} px={{ base: 3, md: 4 }}>
        <Container maxW="lg">
          <VStack
            spacing={6}
            p={{ base: 5, md: 8 }}
            bg={cardBg}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={borderColor}
            textAlign="center"
          >
            <Text fontSize="sm" color={muted} noOfLines={3}>
              {deck.title}
            </Text>
            <Heading size="lg">Результат</Heading>
            <Text fontSize="3xl" fontWeight="700" color="teal.500">
              {correctCount} / {questions.length}
            </Text>
            <Text color={muted}>
              Правильных: {correctCount}. Можно пройти тест ещё раз или перейти к карточкам.
            </Text>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button colorScheme="teal" onClick={restart}>
                Повторить тест
              </Button>
              <Button as={RouterLink} to={medicinaCardsPath(deck.id)} variant="outline" colorScheme="teal">
                Карточки
              </Button>
              <Button as={RouterLink} to={MEDICINA_ROUTE} variant="outline">
                Другие тесты
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box pb={{ base: 28, md: 12 }} pt={{ base: 6, md: 10 }} px={{ base: 3, md: 4 }}>
      <Container maxW="720px">
        <VStack spacing={5} align="stretch">
          <VStack align="stretch" spacing={1}>
            <HStack justify="space-between" flexWrap="wrap" gap={2}>
              <Button as={RouterLink} to={MEDICINA_ROUTE} variant="link" colorScheme="teal" size="sm">
                ← Все тесты
              </Button>
              <Badge colorScheme="teal" fontSize="sm" px={2} py={1}>
                {index + 1} / {questions.length}
              </Badge>
            </HStack>
            <Text fontSize="xs" color={muted} noOfLines={2}>
              {deck.title}
            </Text>
          </VStack>

          <Progress
            value={((index + (answered ? 1 : 0)) / questions.length) * 100}
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
