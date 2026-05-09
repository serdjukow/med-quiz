import { Link } from 'react-router-dom'
import {
    HOME_ROUTE,
    menuList,
    APP_NAME,
} from '../../utils/consts'
import {
    Box,
    Container,
    SimpleGrid,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
const Footer = () => {
    return (
        <Box
            as="footer"
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}>
            <Container as={Stack} maxW={'6xl'} py={10}>
                <SimpleGrid
                    templateColumns={{ sm: '1fr 1fr', md: 'repeat(6, auto)' }}
                    spacing={8}>
                    <Stack spacing={6}>
                        <Box maxW={'200px'}>
                            <Link to={HOME_ROUTE} className="logo">
                                <Text
                                    className="logo-text"
                                    fontWeight="800"
                                    fontSize={{ base: "lg", md: "2xl" }}
                                    bgGradient="linear(to-r, teal.500, cyan.500)"
                                    bgClip="text"
                                    letterSpacing="wide"
                                >
                                    {APP_NAME}
                                </Text>
                            </Link>
                        </Box>
                        <Text fontSize={'sm'}>© 2026 {APP_NAME}</Text>
                    </Stack>
                    {menuList.map(item => (
                        <Stack key={item.itemLink} align={'flex-start'}>
                            <Box as={Link} to={item.itemLink} _hover={{ color: 'orange.400' }}>
                                {item.itemName}
                            </Box>
                            {item.subItems && item.subItems.map((subItem) => (
                                <Box key={subItem.itemLink} as={Link} to={subItem.itemLink} _hover={{ color: 'orange.400' }}>
                                    {subItem.itemName}
                                </Box>
                            ))}
                            
                        </Stack>
                    ))}               
                </SimpleGrid>
            </Container>
        </Box>
    )
}
export default Footer