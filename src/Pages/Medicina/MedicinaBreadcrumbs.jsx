import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Box } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { GET_STARTED_ROUTE, MEDICINA_ROUTE } from '../../utils/consts'
import { medicinaCardsPath } from '../../utils/medicinaDecks'

const truncate = (s, max = 52) => (s.length > max ? `${s.slice(0, max)}…` : s)

const labels = {
  hub: 'Medicina legale',
  test: 'Тест',
  cards: 'Карточки',
  glossary: 'Словарь',
  progress: 'Мой прогресс',
}

/**
 * @param {{ deck?: { id: string, title: string } | null, current: 'hub' | 'test' | 'cards' | 'glossary' | 'progress' }} props
 */
const MedicinaBreadcrumbs = ({ deck = null, current }) => {
  const deckLinkTo =
    deck && (current === 'cards' ? MEDICINA_ROUTE : medicinaCardsPath(deck.id))

  return (
    <Box w="100%">
      <Breadcrumb fontWeight="medium" fontSize="md">
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={GET_STARTED_ROUTE}>
            Выбор раздела
          </BreadcrumbLink>
        </BreadcrumbItem>

        {current === 'hub' ? (
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink as="span" cursor="default">
              {labels.hub}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to={MEDICINA_ROUTE}>
              {labels.hub}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {deck && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                as={RouterLink}
                to={deckLinkTo}
                title={deck.title}
                noOfLines={1}
                maxW={{ base: '200px', md: '360px' }}
              >
                {truncate(deck.title)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink as="span" cursor="default">
                {labels[current]}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {!deck && current === 'progress' && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to={MEDICINA_ROUTE}>
                {labels.hub}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink as="span" cursor="default">
                {labels.progress}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {!deck && current !== 'hub' && current !== 'progress' && (
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink as="span" cursor="default">
              {labels[current]}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Breadcrumb>
    </Box>
  )
}

export default MedicinaBreadcrumbs
