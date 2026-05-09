import { useState, useEffect, useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Card,
  CardBody,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { medicinaDecks, medicinaTestPath } from '../../utils/medicinaDecks'
import { MEDICINA_ROUTE } from '../../utils/consts'
import { useProgress } from '../../progress/ProgressContext'
import MedicinaBreadcrumbs from './MedicinaBreadcrumbs'

const pct = (n) => `${Math.round(n * 100)}%`

const MedicinaProgressPage = () => {
  const {
    profile,
    saveProfileName,
    getDeckStats,
    getGlobalStats,
    getSessions,
    resetDeck,
    resetAllProgress,
  } = useProgress()

  const [nameDraft, setNameDraft] = useState(profile?.name ?? '')
  const [editingName, setEditingName] = useState(false)

  const hasName = !!(profile?.name && profile.name.trim())

  useEffect(() => {
    setNameDraft(profile?.name ?? '')
  }, [profile?.name])

  useEffect(() => {
    if (!hasName) setEditingName(true)
  }, [hasName])

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const muted = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('gray.800', 'white')

  const global = getGlobalStats()
  const sessions = getSessions()

  const resetAllDlg = useDisclosure()
  const cancelRef = useRef()

  return (
    <Box py={{ base: 8, md: 12 }} px={{ base: 3, md: 4 }}>
      <Container maxW="4xl">
        <MedicinaBreadcrumbs current="progress" />
        <VStack align="stretch" spacing={8} mt={4}>
          <VStack align="stretch" spacing={2}>
            <Heading as="h1" size="lg" color={headingColor}>
              Мой прогресс
            </Heading>
            <Text color={muted} fontSize="sm">
              Локальный профиль на этом устройстве: статистика и ошибки хранятся в браузере.
            </Text>
          </VStack>

          <Box
            p={6}
            bg={cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading size="md" mb={4}>
              Профиль
            </Heading>
            {hasName && !editingName ? (
              <HStack flexWrap="wrap" spacing={4} align="center">
                <Box>
                  <Text fontSize="sm" mb={1} color={muted}>
                    Имя
                  </Text>
                  <Text fontSize="lg" fontWeight="600" color={headingColor}>
                    {profile.name}
                  </Text>
                </Box>
                <Button
                  variant="outline"
                  colorScheme="teal"
                  onClick={() => {
                    setNameDraft(profile.name)
                    setEditingName(true)
                  }}
                >
                  Изменить
                </Button>
              </HStack>
            ) : (
              <HStack flexWrap="wrap" spacing={3} align="flex-end">
                <Box flex="1" minW="200px">
                  <Text fontSize="sm" mb={1} color={muted}>
                    Имя
                  </Text>
                  <Input
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    placeholder="Имя или псевдоним"
                  />
                </Box>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    const t = nameDraft.trim()
                    if (!t) return
                    saveProfileName(t)
                    setEditingName(false)
                  }}
                >
                  Сохранить
                </Button>
                {hasName ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setNameDraft(profile.name)
                      setEditingName(false)
                    }}
                  >
                    Отмена
                  </Button>
                ) : null}
              </HStack>
            )}
          </Box>

          <Box
            p={6}
            bg={cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading size="md" mb={4}>
              Общая статистика
            </Heading>
            <HStack spacing={4} flexWrap="wrap">
              <Badge colorScheme="teal" fontSize="md" px={3} py={1}>
                Ответов: {global.totalAnswered}
              </Badge>
              <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                Верно: {global.totalCorrect}
              </Badge>
              <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                Сессий: {global.sessionsCount}
              </Badge>
              {global.lastStudyAt ? (
                <Text fontSize="sm" color={muted}>
                  Последняя активность: {new Date(global.lastStudyAt).toLocaleString()}
                </Text>
              ) : null}
            </HStack>
          </Box>

          <Box
            p={6}
            bg={cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading size="md" mb={4}>
              По наборам
            </Heading>

            <VStack align="stretch" spacing={4} display={{ base: 'flex', md: 'none' }}>
              {medicinaDecks.map((deck) => {
                const st = getDeckStats(deck.id)
                return (
                  <Card
                    key={deck.id}
                    variant="outline"
                    borderColor={borderColor}
                    borderRadius="xl"
                    bg={cardBg}
                  >
                    <CardBody p={4}>
                      <Text fontWeight="700" fontSize="sm" color={headingColor} mb={3} lineHeight="short">
                        {deck.title}
                      </Text>
                      <VStack align="stretch" spacing={2} mb={4}>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color={muted}>
                            Попыток
                          </Text>
                          <Text fontWeight="600">{st.attempts}</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color={muted}>
                            Точность
                          </Text>
                          <Text fontWeight="600">{st.answered ? pct(st.accuracy) : '—'}</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color={muted}>
                            Ошибки
                          </Text>
                          {st.mistakesCount > 0 ? (
                            <Badge colorScheme="red">{st.mistakesCount}</Badge>
                          ) : (
                            <Text fontWeight="600">0</Text>
                          )}
                        </HStack>
                      </VStack>
                      <VStack spacing={2} align="stretch">
                        <Button
                          as={RouterLink}
                          to={medicinaTestPath(deck.id)}
                          colorScheme="teal"
                          size="md"
                          w="100%"
                        >
                          Заново
                        </Button>
                        {st.mistakesCount > 0 ? (
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
                        ) : (
                          <Button
                            colorScheme="orange"
                            variant="outline"
                            size="md"
                            w="100%"
                            isDisabled
                            cursor="not-allowed"
                          >
                            Повторить ошибки
                          </Button>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                )
              })}
            </VStack>

            <TableContainer display={{ base: 'none', md: 'block' }}>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Набор</Th>
                    <Th isNumeric>Попыток</Th>
                    <Th isNumeric>Точность</Th>
                    <Th isNumeric>Ошибки</Th>
                    <Th>Действия</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {medicinaDecks.map((deck) => {
                    const st = getDeckStats(deck.id)
                    return (
                      <Tr key={deck.id}>
                        <Td fontWeight="600" maxW="200px" whiteSpace="normal">
                          {deck.title}
                        </Td>
                        <Td isNumeric>{st.attempts}</Td>
                        <Td isNumeric>{st.answered ? pct(st.accuracy) : '—'}</Td>
                        <Td isNumeric>
                          {st.mistakesCount > 0 ? (
                            <Badge colorScheme="red">{st.mistakesCount}</Badge>
                          ) : (
                            '0'
                          )}
                        </Td>
                        <Td>
                          <HStack spacing={2} flexWrap="wrap" justify="flex-end">
                            <Button
                              as={RouterLink}
                              to={medicinaTestPath(deck.id)}
                              size="xs"
                              colorScheme="teal"
                              variant="solid"
                            >
                              Заново
                            </Button>
                            {st.mistakesCount > 0 ? (
                              <Button
                                as={RouterLink}
                                to={`${medicinaTestPath(deck.id)}?mode=mistakes`}
                                size="xs"
                                colorScheme="orange"
                                variant="outline"
                              >
                                Повторить ошибки
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                colorScheme="orange"
                                variant="outline"
                                isDisabled
                                cursor="not-allowed"
                              >
                                Повторить ошибки
                              </Button>
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          <Box
            p={6}
            bg={cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading size="md" mb={4}>
              Последние сессии
            </Heading>
            {sessions.length === 0 ? (
              <Text color={muted}>Пока нет завершённых сессий.</Text>
            ) : (
              <VStack align="stretch" spacing={3} divider={<Divider />}>
                {sessions.slice(0, 15).map((s, i) => (
                  <HStack key={`${s.finishedAt}-${i}`} justify="space-between" flexWrap="wrap">
                    <Text fontSize="sm" fontWeight="600">
                      {s.deckId}
                    </Text>
                    <HStack spacing={2}>
                      <Badge>{s.correct} верно</Badge>
                      <Badge colorScheme="red">{s.wrong} неверно</Badge>
                      <Badge colorScheme="teal">{pct(s.accuracy)}</Badge>
                      {s.mode === 'mistakes' ? (
                        <Badge colorScheme="purple">ошибки</Badge>
                      ) : null}
                    </HStack>
                    <Text fontSize="xs" color={muted}>
                      {s.finishedAt ? new Date(s.finishedAt).toLocaleString() : ''}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            )}
          </Box>

          <Box
            p={6}
            bg={cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading size="md" mb={4}>
              Сброс данных
            </Heading>
            <Text fontSize="sm" color={muted} mb={4}>
              Сброс набора удаляет статистику и банк ошибок только для этого набора. «Сбросить весь прогресс» очищает статистику и сессии, но сохраняет имя профиля.
            </Text>
            <VStack align="stretch" spacing={3}>
              {medicinaDecks.map((deck) => (
                <HStack key={deck.id} justify="space-between" flexWrap="wrap">
                  <Text fontSize="sm" noOfLines={2} maxW="70%">
                    {deck.title}
                  </Text>
                  <Button size="sm" variant="outline" colorScheme="orange" onClick={() => resetDeck(deck.id)}>
                    Сбросить набор
                  </Button>
                </HStack>
              ))}
              <Button colorScheme="red" variant="outline" onClick={resetAllDlg.onOpen}>
                Сбросить весь прогресс
              </Button>
            </VStack>
          </Box>

          <Button as={RouterLink} to={MEDICINA_ROUTE} variant="link" colorScheme="teal">
            ← К наборам Medicina legale
          </Button>
        </VStack>
      </Container>

      <AlertDialog
        isOpen={resetAllDlg.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={resetAllDlg.onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent mx={4}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Сбросить весь прогресс?
          </AlertDialogHeader>
          <AlertDialogBody>
            Будут удалены статистика, ошибки и история сессий. Имя профиля останется.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={resetAllDlg.onClose}>
              Отмена
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                resetAllProgress()
                resetAllDlg.onClose()
              }}
              ml={3}
            >
              Сбросить
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  )
}

export default MedicinaProgressPage
