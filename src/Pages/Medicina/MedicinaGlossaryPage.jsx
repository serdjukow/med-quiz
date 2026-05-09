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
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { getMedicinaDeck, medicinaTestPath } from '../../utils/medicinaDecks'
import { MEDICINA_ROUTE } from '../../utils/consts'

const buildEntries = (deck) => {
  const all = []
  deck.questions.forEach((q) => {
    all.push({ it: q.promptIt, ru: q.promptRu, type: 'Вопрос' })
    if (q.correctTextIt && q.answerTranslationRu) {
      all.push({ it: q.correctTextIt, ru: q.answerTranslationRu, type: 'Ответ' })
    }
  })

  const uniq = new Map()
  all.forEach((entry) => {
    const key = `${entry.it}__${entry.ru}`
    if (!uniq.has(key)) uniq.set(key, entry)
  })

  return [...uniq.values()]
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
    return entries.filter(
      (e) => e.it.toLowerCase().includes(normalized) || e.ru.toLowerCase().includes(normalized)
    )
  }, [entries, normalized])

  if (!deck) {
    return (
      <Box py={12} px={4}>
        <Container maxW="md">
          <Alert status="warning" borderRadius="lg">
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
          <VStack align="stretch" spacing={1}>
            <HStack justify="space-between" flexWrap="wrap" gap={2}>
              <Button as={RouterLink} to={MEDICINA_ROUTE} variant="link" colorScheme="teal" size="sm">
                ← Все наборы
              </Button>
              <Badge colorScheme="teal">{filtered.length}</Badge>
            </HStack>
            <Text fontSize="xs" color={muted} noOfLines={2}>
              {deck.title}
            </Text>
          </VStack>

          <Heading as="h1" size="lg">
            Итальяно-русский словарь
          </Heading>

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
            {filtered.map((entry, idx) => (
              <Card key={`${entry.it}-${idx}`} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontWeight="700" color={textColor}>
                        {entry.it}
                      </Text>
                      <Badge variant="subtle" colorScheme={entry.type === 'Вопрос' ? 'blue' : 'green'}>
                        {entry.type}
                      </Badge>
                    </HStack>
                    <Text color={muted}>{entry.ru}</Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <Button as={RouterLink} to={medicinaTestPath(deck.id)} variant="outline" colorScheme="teal" size="sm">
            Открыть тест этого набора
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default MedicinaGlossaryPage
