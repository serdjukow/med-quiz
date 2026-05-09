import { useState, useEffect } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  IconButton,
  useColorModeValue,
  List,
  ListItem,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { FaRedo } from 'react-icons/fa'
import { getMedicinaDeck, medicinaTestPath, medicinaGlossaryPath } from '../../utils/medicinaDecks'
import { MEDICINA_ROUTE } from '../../utils/consts'
import MedicinaBreadcrumbs from './MedicinaBreadcrumbs'

const MedicinaCardsPage = () => {
  const { deckId } = useParams()
  const deck = getMedicinaDeck(deckId)
  const questions = deck?.questions ?? []

  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setI(0)
    setFlipped(false)
  }, [deckId])

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.800', 'white')
  const muted = useColorModeValue('gray.600', 'gray.400')
  const backBg = useColorModeValue('teal.50', 'gray.700')

  if (!deck || questions.length === 0) {
    return (
      <Box py={12} px={4}>
        <Container maxW="md">
          <MedicinaBreadcrumbs current="cards" />
          <Alert status="warning" borderRadius="lg" mt={4}>
            <AlertIcon />
            <Box>
              <AlertTitle>Набор не найден</AlertTitle>
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

  const q = questions[i]

  const go = (delta) => {
    setI((prev) => {
      const next = prev + delta
      if (next < 0) return questions.length - 1
      if (next >= questions.length) return 0
      return next
    })
    setFlipped(false)
  }

  return (
    <Box pb={{ base: 24, md: 10 }} pt={{ base: 6, md: 10 }} px={{ base: 3, md: 4 }}>
      <Container maxW="560px">
        <VStack spacing={5} align="stretch">
          <MedicinaBreadcrumbs deck={deck} current="cards" />
          <VStack align="stretch" spacing={1}>
            <HStack justify="space-between" flexWrap="wrap" gap={2}>
              <HStack flexWrap="wrap" spacing={2}>
                <Button as={RouterLink} to={MEDICINA_ROUTE} variant="link" colorScheme="teal" size="sm">
                  ← Все наборы
                </Button>
                <Button
                  as={RouterLink}
                  to={medicinaTestPath(deck.id)}
                  variant="link"
                  colorScheme="teal"
                  size="sm"
                >
                  К тесту
                </Button>
                <Button
                  as={RouterLink}
                  to={medicinaGlossaryPath(deck.id)}
                  variant="link"
                  colorScheme="teal"
                  size="sm"
                >
                  Словарь
                </Button>
              </HStack>
              <Badge colorScheme="teal">{i + 1} / {questions.length}</Badge>
            </HStack>
            <Text fontSize="xs" color={muted} noOfLines={2}>
              {deck.title}
            </Text>
          </VStack>

          <Box
            role="button"
            tabIndex={0}
            onClick={() => setFlipped(!flipped)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setFlipped(!flipped)
              }
            }}
            aria-label={flipped ? 'Mostra domanda' : 'Mostra risposta'}
            cursor="pointer"
            minH={{ base: '280px', md: '320px' }}
            bg={flipped ? backBg : cardBg}
            borderWidth="2px"
            borderColor={borderColor}
            borderRadius="2xl"
            p={{ base: 5, md: 7 }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            transition="background 0.2s ease"
            boxShadow="md"
          >
            {!flipped ? (
              <VStack spacing={4} align="stretch">
                <Text fontSize="xs" textTransform="uppercase" letterSpacing="wider" color={muted}>
                  Итальянский
                </Text>
                <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} color={textColor}>
                  {q.promptIt}
                </Heading>
                <Text fontSize="sm" color={muted} lineHeight="tall">
                  Перевод: {q.promptRu}
                </Text>
                <Text fontSize="xs" color="teal.500" mt={2}>
                  Нажмите, чтобы увидеть ответ
                </Text>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <Text fontSize="xs" textTransform="uppercase" letterSpacing="wider" color={muted}>
                  Ответ · Объяснение
                </Text>
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="600" color={textColor}>
                  {q.correctKey}) {q.correctTextIt}
                </Text>
                <Text fontSize="sm" color={muted}>
                  {q.answerTranslationRu}
                </Text>
                <List spacing={2} pt={2}>
                  {q.explanation.map((line, idx) => (
                    <ListItem key={idx} fontSize="sm" color={muted}>
                      {line}
                    </ListItem>
                  ))}
                </List>
                <Text fontSize="xs" color="teal.600">
                  Нажмите, чтобы вернуться к вопросу
                </Text>
              </VStack>
            )}
          </Box>

          <HStack justify="center" spacing={6}>
            <IconButton
              icon={<ChevronLeftIcon boxSize={8} />}
              aria-label="Предыдущий"
              variant="outline"
              colorScheme="teal"
              size="lg"
              borderRadius="full"
              onClick={() => go(-1)}
            />
            <IconButton
              icon={<FaRedo />}
              aria-label="Перевернуть карточку"
              colorScheme="teal"
              variant="ghost"
              size="md"
              onClick={() => setFlipped(!flipped)}
            />
            <IconButton
              icon={<ChevronRightIcon boxSize={8} />}
              aria-label="Следующий"
              variant="outline"
              colorScheme="teal"
              size="lg"
              borderRadius="full"
              onClick={() => go(1)}
            />
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default MedicinaCardsPage
