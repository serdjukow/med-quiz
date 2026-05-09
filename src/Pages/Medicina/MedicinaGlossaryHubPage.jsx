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
import { FaList, FaTh } from 'react-icons/fa'
import { medicinaDecks, medicinaGlossaryPath } from '../../utils/medicinaDecks'
import { MEDICINA_ROUTE } from '../../utils/consts'

const MedicinaGlossaryHubPage = () => {
  const [viewport, setViewport] = useState('grid')
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
          <VStack spacing={3} textAlign="center">
            <Button as={RouterLink} to={MEDICINA_ROUTE} variant="link" colorScheme="teal" size="sm">
              ← Все форматы
            </Button>
            <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} color={headingColor}>
              Выберите словарь
            </Heading>
            <Text color={textColor} fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall" maxW="2xl" mx="auto">
              Сначала выберите нужный набор, затем откроется соответствующий итальяно-русский словарь.
            </Text>
            <HStack justify="center" spacing={2} pt={2}>
              <IconButton
                aria-label="Сетка"
                icon={<FaTh />}
                variant={viewport === 'grid' ? 'solid' : 'outline'}
                colorScheme="teal"
                onClick={() => setViewport('grid')}
              />
              <IconButton
                aria-label="Список"
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
                        <Badge colorScheme="teal" fontSize="sm">
                          {deck.questions.length}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color={textColor}>
                        {deck.sourceLocale} → {deck.translationLocale}
                      </Text>
                      <Button as={RouterLink} to={medicinaGlossaryPath(deck.id)} colorScheme="teal">
                        Открыть словарь
                      </Button>
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
                    <Th>Набор</Th>
                    <Th isNumeric>Вопросов</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {medicinaDecks.map((deck) => (
                    <Tr key={deck.id} _hover={{ bg: rowHover }}>
                      <Td fontWeight="600" color={headingColor} maxW={{ base: '160px', md: 'none' }}>
                        {deck.title}
                      </Td>
                      <Td isNumeric>{deck.questions.length}</Td>
                      <Td>
                        <Button as={RouterLink} to={medicinaGlossaryPath(deck.id)} size="sm" colorScheme="teal">
                          Открыть
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default MedicinaGlossaryHubPage
