import React from "react";
import {
    Container, Text, Heading, Card, CardBody, Button, Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Link,
    AccordionIcon,
    Box,
    VStack,
    HStack,
    useColorModeValue,
    Icon
} from '@chakra-ui/react'
import { FaQuestionCircle, FaEnvelope, FaShieldAlt, FaBullseye } from 'react-icons/fa'

const FaqPage = () => {
    // Цвета для темной/светлой темы
    const cardBg = useColorModeValue('white', 'gray.800')
    const textColor = useColorModeValue('gray.600', 'gray.300')
    const headingColor = useColorModeValue('gray.800', 'white')
    const borderColor = useColorModeValue('gray.200', 'gray.600')
    const hoverBg = useColorModeValue('gray.50', 'gray.700')

    const faqItems = [
        {
            icon: FaEnvelope,
            question: "Haben Sie Fragen?",
            answer: "Haben Sie Fragen, Anregungen oder Probleme? Zögern Sie nicht, uns zu kontaktieren! Sie können uns eine E-Mail senden an:",
            email: "support@serdjukow.eu",
            color: "blue"
        },
        {
            icon: FaBullseye,
            question: "Hauptziel des Projekts",
            answer: "Hauptziel des Projekts ist es, ein nützliches und zugängliches Lernwerkzeug für alle zu schaffen, die ihre Deutschkenntnisse vertiefen möchten.",
            color: "green"
        },
        {
            icon: FaShieldAlt,
            question: "Persönlichen Daten",
            answer: "Unser Projekt ist nicht kommerziell und sammelt keine persönlichen Daten der Benutzer.",
            color: "purple"
        }
    ]

    return (
        <Box>
            <Container maxW='1400px' py={8}>
                <VStack spacing={8} w="100%">
                    {/* Breadcrumb */}
                    <Box w="100%">
                        <Breadcrumb fontWeight='medium' fontSize='md'>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/'>Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem isCurrentPage>
                                <BreadcrumbLink href='#'>FAQ</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </Box>

                    {/* Заголовок */}
                    <VStack spacing={4} textAlign="center">
                        <Box
                            p={6}
                            bg={cardBg}
                            borderRadius="2xl"
                            boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                            border="1px solid"
                            borderColor={borderColor}
                        >
                            <Icon as={FaQuestionCircle} w={16} h={16} color="purple.500" />
                        </Box>

                        <Heading as='h1' size='2xl' color={headingColor} fontWeight="700">
                            Häufig gestellte Fragen
                        </Heading>

                        <Text fontSize="lg" color={textColor} maxW="600px">
                            Hier finden Sie Antworten auf die häufigsten Fragen zu unserem Lernsystem.
                        </Text>
                    </VStack>

                    {/* FAQ Accordion */}
                    <Card w="100%" maxW="800px" bg={cardBg} borderRadius="2xl" boxShadow="xl" border="1px solid" borderColor={borderColor}>
                        <CardBody p={0}>
                            <Accordion allowMultiple>
                                {faqItems.map((item, index) => (
                                    <AccordionItem key={index} border="none">
                                        <AccordionButton
                                            p={6}
                                            _hover={{ bg: hoverBg }}
                                            borderRadius="none"
                                            borderBottom={index < faqItems.length - 1 ? "1px solid" : "none"}
                                            borderColor={borderColor}
                                        >
                                            <HStack spacing={4} flex={1} align="start">
                                                <Box
                                                    p={3}
                                                    bgGradient={`linear(to-r, ${item.color}.400, ${item.color}.600)`}
                                                    borderRadius="xl"
                                                    flexShrink={0}
                                                >
                                                    <Icon as={item.icon} w={6} h={6} color="white" />
                                                </Box>
                                                <VStack align="start" spacing={1} flex={1}>
                                                    <Text fontSize="lg" fontWeight="600" color={headingColor}>
                                                        {item.question}
                                                    </Text>
                                                </VStack>
                                                <AccordionIcon color={textColor} />
                                            </HStack>
                                        </AccordionButton>
                                        <AccordionPanel pb={6} px={6}>
                                            <VStack align="start" spacing={3}>
                                                <Text color={textColor} lineHeight="1.6">
                                                    {item.answer}
                                                </Text>
                                                {item.email && (
                                                    <Link
                                                        color={`${item.color}.500`}
                                                        href={`mailto:${item.email}`}
                                                        fontWeight="600"
                                                        _hover={{ textDecoration: "underline" }}
                                                    >
                                                        {item.email}
                                                    </Link>
                                                )}
                                            </VStack>
                                        </AccordionPanel>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardBody>
                    </Card>

                    {/* Дополнительная информация */}
                    <Card w="100%" maxW="600px" bg={cardBg} borderRadius="2xl" boxShadow="xl" border="1px solid" borderColor={borderColor}>
                        <CardBody p={8}>
                            <VStack spacing={4} textAlign="center">
                                <Icon as={FaEnvelope} w={12} h={12} color="blue.500" />
                                <Heading size="md" color={headingColor}>
                                    Weitere Fragen?
                                </Heading>
                                <Text color={textColor} lineHeight="1.6">
                                    Falls Sie weitere Fragen haben oder Unterstützung benötigen,
                                    zögern Sie nicht, uns zu kontaktieren. Wir helfen gerne!
                                </Text>
                                <Button
                                    as="a"
                                    href="mailto:support@serdjukow.eu"
                                    colorScheme="blue"
                                    bgGradient="linear(to-r, blue.500, purple.500)"
                                    _hover={{
                                        bgGradient: "linear(to-r, blue.600, purple.600)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "xl"
                                    }}
                                    leftIcon={<Icon as={FaEnvelope} />}
                                    size="lg"
                                    px={8}
                                    py={6}
                                    borderRadius="xl"
                                    fontWeight="600"
                                >
                                    E-Mail senden
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>
        </Box>
    )
}

export default FaqPage