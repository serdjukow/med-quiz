import { Link } from 'react-router-dom'
import { HOME_ROUTE, APP_NAME, MEDICINA_PROGRESS_ROUTE } from '../../utils/consts'
import { useProgress } from '../../progress/ProgressContext'
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
    const { profile } = useProgress()

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
                    <Stack direction={'row'} spacing={{ base: 2, md: 5 }} gap="2" align="center">
                        <Button
                            as={Link}
                            to={MEDICINA_PROGRESS_ROUTE}
                            variant="ghost"
                            size={{ base: 'xs', md: 'sm' }}
                            fontWeight="600"
                            maxW={{ base: '100px', md: '160px' }}
                            isTruncated
                            display={{ base: 'none', sm: 'inline-flex' }}
                        >
                            {profile?.name || 'Профиль'}
                        </Button>
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