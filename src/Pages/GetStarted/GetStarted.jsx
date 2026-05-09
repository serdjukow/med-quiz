import React from "react";
import { Link as RouterLink } from 'react-router-dom'
import {
    Container, Text, Heading, SimpleGrid, Button, Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Box,
    Icon,
    useColorModeValue,
    VStack,
    HStack,
    Badge
} from '@chakra-ui/react'
import {
    FaBookOpen,
    FaStethoscope,
    FaLightbulb,
    FaPlay,
    FaArrowRight,
} from 'react-icons/fa'
import {
    MEDICINA_ROUTE,
    MEDICINA_GLOSSARY_ROUTE,
} from '../../utils/consts'


const GetStartedPageContent = [
    {
        title: "Тесты по медицине",
        text: "Все наборы Medicina legale: отвечайте на вопросы, сразу получайте перевод и полное объяснение.",
        buttonText: "Открыть",
        buttonLink: MEDICINA_ROUTE,
        icon: FaStethoscope,
        color: "teal",
        gradient: "linear(to-r, teal.400, cyan.500)",
        isSpecial: true,
    },
    {
        title: "Итальяно-русский словарь",
        text: "Словарь по материалам тестов: ключевые итальянские формулировки и их перевод на русский.",
        buttonText: "Открыть",
        buttonLink: MEDICINA_GLOSSARY_ROUTE,
        icon: FaBookOpen,
        color: "blue",
        gradient: "linear(to-r, blue.400, blue.600)"
    },
]

const GetStartedCard = ({ heading, description, icon, href, buttonText, color, gradient, isSpecial }) => {
    const cardBg = useColorModeValue('white', 'gray.800')
    const textColor = useColorModeValue('gray.600', 'gray.300')
    const headingColor = useColorModeValue('gray.800', 'white')
    const borderColor = useColorModeValue('gray.200', 'gray.600')

    return (
        <Box
            maxW={{ base: 'full', md: '350px' }}
            w={'full'}
            bg={cardBg}
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            transition="all 0.3s"
            _hover={{
                transform: "translateY(-8px)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            position="relative"
        >
            {/* Цветная полоса сверху */}
            <Box
                h="4px"
                bgGradient={gradient}
                w="100%"
            />

            <VStack align="stretch" spacing={6} p={6} h="100%">
                {/* Иконка и заголовок */}
                <HStack spacing={4} align="start">
                    <Box
                        p={4}
                        bgGradient={gradient}
                        borderRadius="xl"
                        boxShadow="lg"
                        flexShrink={0}
                    >
                        <Icon as={icon} w={8} h={8} color="white" />
                    </Box>
                    <VStack align="start" spacing={2} flex={1}>
                        <Heading
                            size="lg"
                            color={headingColor}
                            fontWeight="700"
                        >
                            {heading}
                        </Heading>
                        {isSpecial && (
                            <Badge
                                colorScheme={color}
                                variant="subtle"
                                borderRadius="full"
                                px={3}
                                py={1}
                            >
                                <Icon as={FaPlay} mr={1} />
                                Рекомендуем
                            </Badge>
                        )}
                    </VStack>
                </HStack>

                {/* Описание */}
                <Text
                    fontSize="md"
                    color={textColor}
                    lineHeight="1.6"
                    flex={1}
                >
                    {description}
                </Text>

                {/* Кнопка */}
                <Button
                    as={RouterLink}
                    to={href}
                    colorScheme={color}
                    bgGradient={gradient}
                    _hover={{
                        bgGradient: gradient,
                        transform: "translateY(-2px)",
                        boxShadow: "lg"
                    }}
                    rightIcon={<Icon as={FaArrowRight} />}
                    size="lg"
                    fontWeight="600"
                    borderRadius="xl"
                    transition="all 0.3s"
                >
                    {buttonText}
                </Button>
            </VStack>
        </Box>
    )
}

const GetStarted = () => {
    const textColor = useColorModeValue('gray.600', 'gray.300')
    const headingColor = useColorModeValue('gray.800', 'white')

    return (
        <Box>
            <Container maxW='1400px' py={8}>
                <VStack spacing={8} w="100%">
                    {/* Breadcrumb */}
                    <Box w="100%">
                        <Breadcrumb fontWeight='medium' fontSize='md'>
                            <BreadcrumbItem isCurrentPage>
                                <BreadcrumbLink as="span" cursor="default">
                                    Выбор раздела
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </Box>

                    {/* Заголовок */}
                    <VStack spacing={4} textAlign="center">
                        <Heading
                            as='h1'
                            size='2xl'
                            color={headingColor}
                            fontWeight="700"
                            textShadow="0 2px 4px rgba(0,0,0,0.1)"
                        >
                            Выберите формат обучения
                        </Heading>
                        <Text
                            fontSize="lg"
                            color={textColor}
                            maxW="640px"
                            lineHeight="1.7"
                        >
                            В приложении остались только разделы для подготовки по медицине: тесты и словарь.
                        </Text>
                    </VStack>

                    {/* Карточки */}
                    <Box w="100%" mt={8}>
                        <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 3 }}
                            spacing={8}
                            justifyItems="center"
                        >
                            {GetStartedPageContent.map((item, index) => (
                                <GetStartedCard
                                    key={index}
                                    heading={item.title}
                                    icon={item.icon}
                                    description={item.text}
                                    href={item.buttonLink}
                                    buttonText={item.buttonText}
                                    color={item.color}
                                    gradient={item.gradient}
                                    isSpecial={item.isSpecial}
                                />
                            ))}
                        </SimpleGrid>
                    </Box>

                    {/* Дополнительная информация */}
                    <Box
                        w="100%"
                        maxW="800px"
                        mt={12}
                        p={8}
                        bg={useColorModeValue('white', 'gray.800')}
                        borderRadius="2xl"
                        boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                    >
                        <VStack spacing={4} textAlign="center">
                            <Icon as={FaLightbulb} w={12} h={12} color="yellow.500" />
                            <Heading size="lg" color={headingColor}>С чего начать</Heading>
                            <Text color={textColor} lineHeight="1.6">
                                Сначала откройте тесты и пройдите один набор целиком. Затем закрепите материал
                                в словаре по тому же набору.
                            </Text>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    )
}

export default GetStarted