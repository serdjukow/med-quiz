import { Link } from 'react-router-dom'
import { HOME_ROUTE, APP_NAME } from '../../utils/consts'
import './header.scss'
import Sidebar from '../../components/Sidebar/Sidebar';

import {
    Box,
    Flex,
    Button,
    Text,
    useColorModeValue,
    Stack,
    useColorMode,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Box
            bg={useColorModeValue('gray.100', 'gray.900')}
            px={{ base: 4, md: 8 }}
            top="0"
            position="fixed"
            zIndex={'1000'}
            w="100%"
        >
            <Flex
                h={{ base: 16, md: 20 }}
                alignItems={'center'}
                justifyContent={'space-between'}
                maxW="1200px"
                mx="auto"
            >
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

                <Flex alignItems={'center'}>
                    <Stack direction={'row'} spacing={{ base: 4, md: 7 }} gap="3">
                        <Button
                            onClick={toggleColorMode}
                            _focus={{ outline: "none" }}
                            fontSize={{ base: 18, md: 20 }}
                            size={{ base: "sm", md: "md" }}
                        >
                            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        </Button>
                        <Sidebar />
                    </Stack>
                </Flex>
            </Flex>
        </Box>
    );
}
export default Header