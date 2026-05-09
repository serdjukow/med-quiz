import { useMemo } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Card,
  CardBody,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { getMedicinaDeck, medicinaTestPath, medicinaCardsPath } from '../../utils/medicinaDecks'
import { MEDICINA_ROUTE } from '../../utils/consts'
import MedicinaBreadcrumbs from './MedicinaBreadcrumbs'

const buildEntries = (deck) => {
  const all = []
  deck.questions.forEach((q, idx) => {
    all.push({
      id: `${deck.id}-${idx}`,
      questionIt: q.promptIt,
      questionRu: q.promptRu,
      answerKey: q.correctKey,
      answerIt: q.correctTextIt ?? '',
      answerRu: q.answerTranslationRu ?? '',
    })
  })

  return all
}

const MedicinaGlossaryPage = () => {
  const { deckId } = useParams()
  const deck = getMedicinaDeck(deckId)
  const [query, setQuery] = useState('')

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const muted = useColorModeValue('gray.600', 'gray.400')

  const entries = useMemo(() => (deck ? buildEntries(deck) : []), [deck])
  const normalized = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!normalized) return entries
    return entries.filter((e) => {
      const searchTarget = `${e.questionIt} ${e.questionRu} ${e.answerIt} ${e.answerRu}`.toLowerCase()
      return searchTarget.includes(normalized)
    })
  }, [entries, normalized])

  if (!deck) {
    return (
      <Box py={12} px={4}>
        <Container maxW="md">
          <MedicinaBreadcrumbs current="glossary" />
          <Alert status="warning" borderRadius="lg" mt={4}>
            <AlertIcon />
            <Box>
              <AlertTitle>Словарь не найден</AlertTitle>
              <AlertDescription>Проверьте ссылку или вернитесь к списку наборов.</AlertDescription>
            </Box>
          </Alert>
          <Button as={RouterLink} to={MEDICINA_ROUTE} colorScheme="teal" mt={6} w="100%">
            Все наборы
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box py={{ base: 6, md: 10 }} px={{ base: 3, md: 4 }}>
      <Container maxW="900px">
        <VStack spacing={6} align="stretch">
          <MedicinaBreadcrumbs deck={deck} current="glossary" />
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
                <Button
                  as={RouterLink}
                  to={medicinaTestPath(deck.id)}
                  variant="link"
                  colorScheme="teal"
                  size="sm"
                >
                  К тесту
                </Button>
              </HStack>
              <Badge colorScheme="teal">{filtered.length}</Badge>
            </HStack>
            <Text fontSize="xs" color={muted} noOfLines={2}>
              {deck.title}
            </Text>
          </VStack>

          <Heading as="h1" size="lg">
            Итальяно-русский словарь
          </Heading>
          <Text fontSize="sm" color={muted}>
            Каждая карточка показывает связку вопроса и правильного ответа из набора.
          </Text>

          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color={muted} />
            </InputLeftElement>
            <Input
              placeholder="Поиск по итальянскому или русскому..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              borderColor={borderColor}
            />
          </InputGroup>

          <SimpleGrid columns={1} spacing={3}>
            {filtered.map((entry) => (
              <Card key={entry.id} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                      <Text fontSize="xs" textTransform="uppercase" letterSpacing="wide" color={muted}>
                        Вопрос
                      </Text>
                      <Badge variant="subtle" colorScheme="purple">
                        Вопрос + ответ
                      </Badge>
                    </HStack>
                    <Text fontWeight="700" color={textColor}>
                      {entry.questionIt}
                    </Text>
                    <Text color={muted}>Перевод: {entry.questionRu}</Text>

                    <Divider borderColor={borderColor} />

                    <Text fontSize="xs" textTransform="uppercase" letterSpacing="wide" color={muted}>
                      Ответ
                    </Text>
                    {entry.answerIt ? (
                      <>
                        <Text fontWeight="700" color={textColor}>
                          {entry.answerKey}) {entry.answerIt}
                        </Text>
                        <Text color={muted}>Перевод: {entry.answerRu}</Text>
                      </>
                    ) : (
                      <Text color={muted}>Для этой карточки ответ не указан.</Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

        </VStack>
      </Container>
    </Box>
  )
}

export default MedicinaGlossaryPage
