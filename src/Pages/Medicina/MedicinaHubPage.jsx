import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
  HStack,
  Badge,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { FaClipboardList, FaLayerGroup, FaList, FaTh } from 'react-icons/fa'
import {
  medicinaDecks,
  medicinaTestPath,
  medicinaCardsPath,
  medicinaGlossaryPath,
} from '../../utils/medicinaDecks'
import { MEDICINA_PROGRESS_ROUTE } from '../../utils/consts'
import { useProgress } from '../../progress/ProgressContext'
import MedicinaBreadcrumbs from './MedicinaBreadcrumbs'

const MedicinaHubPage = () => {
  const [viewport, setViewport] = useState('grid')
  const { profile, getGlobalStats, getDeckStats } = useProgress()
  const global = getGlobalStats()
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const headingColor = useColorModeValue('gray.800', 'white')
  const rowHover = useColorModeValue('gray.50', 'gray.700')
  const theadBg = useColorModeValue('gray.50', 'gray.900')

  return (
    <Box py={{ base: 8, md: 12 }}>
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          <MedicinaBreadcrumbs current="hub" />
          <Box
            p={4}
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
          >
            <HStack justify="space-between" flexWrap="wrap" spacing={3}>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="600" color={headingColor}>
                  {profile?.name ? `Профиль: ${profile.name}` : 'Локальный профиль'}
                </Text>
                <Text fontSize="xs" color={textColor}>
                  Ответов: {global.totalAnswered} · Верно: {global.totalCorrect} · Сессий:{' '}
                  {global.sessionsCount}
                </Text>
              </VStack>
              <Button as={RouterLink} to={MEDICINA_PROGRESS_ROUTE} colorScheme="teal" size="sm">
                Мой прогресс
              </Button>
            </HStack>
          </Box>
          <VStack spacing={3} textAlign="center">
            <Heading
              as="h1"
              fontSize={{ base: '2xl', md: '3xl' }}
              color={headingColor}
            >
              Medicina legale
            </Heading>
            <Text color={textColor} fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall" maxW="2xl" mx="auto">
              Выберите набор и формат: тест, карточки или словарь по материалу.
            </Text>
            <HStack justify="center" spacing={2} pt={2}>
              <IconButton
                aria-label="Vista griglia"
                icon={<FaTh />}
                variant={viewport === 'grid' ? 'solid' : 'outline'}
                colorScheme="teal"
                onClick={() => setViewport('grid')}
              />
              <IconButton
                aria-label="Vista elenco"
                icon={<FaList />}
                variant={viewport === 'list' ? 'solid' : 'outline'}
                colorScheme="teal"
                onClick={() => setViewport('list')}
              />
            </HStack>
          </VStack>

          {viewport === 'grid' ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              {medicinaDecks.map((deck) => (
                <Card
                  key={deck.id}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="md"
                >
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between" align="flex-start">
                        <Heading size="md" color={headingColor} lineHeight="short">
                          {deck.title}
                        </Heading>
                        <HStack>
                          {getDeckStats(deck.id).mistakesCount > 0 ? (
                            <Badge colorScheme="red" fontSize="sm">
                              Ошибок: {getDeckStats(deck.id).mistakesCount}
                            </Badge>
                          ) : null}
                          <Badge colorScheme="teal" fontSize="sm">
                            {deck.questions.length}
                          </Badge>
                        </HStack>
                      </HStack>
                      <Text fontSize="sm" color={textColor}>
                        {deck.sourceLocale} → {deck.translationLocale} · scelta multipla
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        <HStack spacing={3} flexWrap="wrap">
                          <Button
                            as={RouterLink}
                            to={medicinaTestPath(deck.id)}
                            colorScheme="teal"
                            size="md"
                            leftIcon={<Icon as={FaClipboardList} />}
                            flex="1"
                            minW="120px"
                          >
                            Тест
                          </Button>
                          <Button
                            as={RouterLink}
                            to={medicinaCardsPath(deck.id)}
                            variant="outline"
                            colorScheme="teal"
                            size="md"
                            leftIcon={<Icon as={FaLayerGroup} />}
                            flex="1"
                            minW="120px"
                          >
                            Карточки
                          </Button>
                          <Button
                            as={RouterLink}
                            to={medicinaGlossaryPath(deck.id)}
                            variant="ghost"
                            colorScheme="teal"
                            size="md"
                            flex="1"
                            minW="120px"
                          >
                            Словарь
                          </Button>
                        </HStack>
                        {getDeckStats(deck.id).mistakesCount > 0 ? (
                          <Button
                            as={RouterLink}
                            to={`${medicinaTestPath(deck.id)}?mode=mistakes`}
                            colorScheme="orange"
                            variant="outline"
                            size="md"
                            w="100%"
                          >
                            Повторить ошибки
                          </Button>
                        ) : null}
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <TableContainer
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
            >
              <Table size="md" variant="simple">
                <Thead bg={theadBg}>
                  <Tr>
                    <Th>Testo / titolo</Th>
                    <Th isNumeric>Domande</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {medicinaDecks.map((deck) => (
                    <Tr key={deck.id} _hover={{ bg: rowHover }}>
                      <Td fontWeight="600" color={headingColor} maxW={{ base: '160px', md: 'none' }}>
                        {deck.title}
                      </Td>
                      <Td isNumeric>
                        <VStack align="end" spacing={1}>
                          {getDeckStats(deck.id).mistakesCount > 0 ? (
                            <Badge colorScheme="red" fontSize="xs">
                              Ошибок: {getDeckStats(deck.id).mistakesCount}
                            </Badge>
                          ) : null}
                          <Text as="span">{deck.questions.length}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <HStack spacing={2} justify="flex-end" flexWrap="wrap">
                          <Button
                            as={RouterLink}
                            to={medicinaTestPath(deck.id)}
                            size="sm"
                            colorScheme="teal"
                          >
                            Тест
                          </Button>
                          <Button
                            as={RouterLink}
                            to={medicinaCardsPath(deck.id)}
                            size="sm"
                            variant="outline"
                            colorScheme="teal"
                          >
                            Карточки
                          </Button>
                          <Button
                            as={RouterLink}
                            to={medicinaGlossaryPath(deck.id)}
                            size="sm"
                            variant="ghost"
                            colorScheme="teal"
                          >
                            Словарь
                          </Button>
                          {getDeckStats(deck.id).mistakesCount > 0 ? (
                            <Button
                              as={RouterLink}
                              to={`${medicinaTestPath(deck.id)}?mode=mistakes`}
                              size="sm"
                              colorScheme="orange"
                              variant="outline"
                            >
                              Повторить ошибки
                            </Button>
                          ) : null}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}

          <Box
            p={5}
            bg={cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Text fontSize="sm" color={textColor} lineHeight="tall">
              В <Text as="span" fontWeight="600">тесте</Text> после каждого ответа показываются перевод и полное
              объяснение. <Text as="span" fontWeight="600">Карточки</Text> удобны для повторения, а{' '}
              <Text as="span" fontWeight="600">словарь</Text> собирает ключевые пары итальянский → русский из
              выбранного набора.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default MedicinaHubPage
