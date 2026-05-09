import {
    Container,
    Heading,
    Text,
    Button,
    Box,
    Image,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import StartImage from '../../assets/images/start-page-4.svg'
import {
    GET_STARTED_ROUTE,
} from '../../utils/consts'

const HomePage = () => {
    const textColor = useColorModeValue('gray.600', 'gray.300')
    const headingColor = useColorModeValue('gray.800', 'white')

    return (
        <Box py={{ base: 16, md: 24 }}>
            <Container maxW="lg">
                <VStack spacing={8} textAlign="center">
                    <Heading
                        fontWeight={700}
                        fontSize={{ base: '3xl', md: '5xl' }}
                        lineHeight="110%"
                        color={headingColor}
                    >
                        Учебный кабинет
                    </Heading>

                    <Text fontSize={{ base: 'md', md: 'lg' }} color={textColor}>
                        Выберите раздел и начните занятие.
                    </Text>

                    <Button
                        as={RouterLink}
                        to={GET_STARTED_ROUTE}
                        size="lg"
                        colorScheme="teal"
                        px={10}
                        py={6}
                        fontWeight="600"
                        borderRadius="xl"
                    >
                        Выбрать раздел
                    </Button>

                    <Box w="100%" maxW="560px" pt={{ base: 2, md: 4 }}>
                        <Image
                            src={StartImage}
                            alt="Start illustration"
                            w="100%"
                            h={{ base: '180px', sm: '230px', md: '280px' }}
                            objectFit="contain"
                        />
                    </Box>
                </VStack>
            </Container>
        </Box>
    )
}

export default HomePage
