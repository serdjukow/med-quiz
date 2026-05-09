import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  VStack,
  List,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react'

const MistakeReviewModal = ({ isOpen, onClose, deck, mistakesForReview }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const muted = useColorModeValue('gray.600', 'gray.400')

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>Разбор ошибок</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {!deck || mistakesForReview.length === 0 ? (
            <Text color={muted} fontSize="sm">
              Нет ошибок для разбора.
            </Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {mistakesForReview.map((m) => {
                const question = deck.questions.find((qq) => qq.id === m.questionId)
                if (!question) return null
                return (
                  <Box
                    key={m.questionId}
                    p={4}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                  >
                    <Text fontSize="xs" color={muted} mb={1}>
                      Вопрос
                    </Text>
                    <Text fontWeight="700" mb={2}>
                      {question.promptIt}
                    </Text>
                    <Text fontSize="sm" color={muted} mb={3}>
                      Перевод: {question.promptRu}
                    </Text>
                    <Text fontSize="sm" color="red.500">
                      Ваш ответ: {m.selectedKey}){' '}
                      {question.options.find((o) => o.key === m.selectedKey)?.textIt ?? '—'}
                    </Text>
                    <Text fontSize="sm" color="green.500" mt={2} fontWeight="600">
                      Верно: {question.correctKey}) {question.correctTextIt}
                    </Text>
                    <Text fontSize="sm" color={muted} mt={1}>
                      Перевод: {question.answerTranslationRu}
                    </Text>
                    <List spacing={1} mt={3}>
                      {question.explanation.map((line, i) => (
                        <ListItem key={i} fontSize="sm" color={muted}>
                          {line}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )
              })}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MistakeReviewModal
