import { useRef } from "react"
import { Link, NavLink } from "react-router-dom"
import {
    Flex,
    Text,
    VStack,
    Divider,
    HStack,
    Button,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    Icon,
    useColorModeValue,
} from "@chakra-ui/react"
import { GiHamburgerMenu } from "react-icons/gi"
import { CgClose } from "react-icons/cg"
import { menuList, HOME_ROUTE, APP_NAME } from '../../utils/consts'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { TfiDirection } from "react-icons/tfi";

function HamurgerMenu() {
    const btnRef = useRef()
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Flex
            pos='relative'
        >
            <Button
                color={useColorModeValue('gray.900', 'gray.100')}
                _focus={{ outline: "none" }}
                fontSize={{ base: 18, md: 20 }}
                size={{ base: "sm", md: "md" }}
                onClick={onOpen}
            >
                <Icon as={GiHamburgerMenu} />
            </Button>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent
                    minW="250px"
                    maxW={{ base: "full", sm: "350px", md: "400px" }}
                    h="100vh"
                    bg={useColorModeValue('gray.100', 'gray.900')}
                    flexDir="column"
                >
                    <DrawerHeader>
                        <VStack m="0 auto 10px auto" cursor="pointer">
                            <HStack justifyContent="space-between" alignItems="center" w="100%">
                                <Link to={HOME_ROUTE} className="logo">
                                    <Text
                                        className="logo-text"
                                        fontWeight="800"
                                        fontSize={{ base: "lg", md: "xl" }}
                                        bgGradient="linear(to-r, teal.500, cyan.500)"
                                        bgClip="text"
                                        letterSpacing="wide"
                                    >
                                        {APP_NAME}
                                    </Text>
                                </Link>
                                <Button
                                    _focus={{ outline: "none" }}
                                    _focusWithin={{
                                        bg: "none",
                                    }}
                                    fontSize={20}
                                    onClick={onClose}
                                >
                                    <Icon as={CgClose} />
                                </Button>
                            </HStack>
                            <Divider orientation="horizontal" />
                        </VStack>
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack
                            mt={2}
                            spacing={12}
                            alignItems="flex-start"
                            w="100%"
                            justifyContent="flex-start"

                        >
                            <nav>
                                <ul>
                                    {menuList.map((item) => {
                                        return (
                                            <li key={item.itemLink} >
                                                <NavLink to={item.itemLink}
                                                    className='header-nav-link'
                                                >
                                                    <HStack
                                                        spacing={3}
                                                        w="100%"
                                                        justifyContent="flex-start"
                                                        _hover={{
                                                            color: 'orange.400',
                                                        }}
                                                        cursor="pointer"
                                                        py={1}
                                                        onClick={onClose}
                                                    >
                                                        <TfiDirection />
                                                        <Text fontSize={18} >
                                                            {item.itemName}
                                                        </Text>
                                                    </HStack>
                                                </NavLink>
                                                {item.subItems && (
                                                    <ul>
                                                        {item.subItems.map((subItem) => (
                                                            <NavLink
                                                                key={subItem.itemLink}
                                                                to={subItem.itemLink}
                                                                className='header-nav-link'
                                                            >
                                                                <HStack
                                                                    fontSize={14}
                                                                    spacing={3}
                                                                    w="100%"
                                                                    justifyContent="flex-start"
                                                                    _hover={{ color: 'orange.400' }}
                                                                    cursor="pointer"
                                                                    py={1}
                                                                    pl='20px'
                                                                    onClick={onClose}
                                                                >
                                                                    <ChevronLeftIcon w={3} h={3} />
                                                                    <Text fontSize={16} >
                                                                        {subItem.itemName}
                                                                    </Text>
                                                                </HStack>
                                                            </NavLink>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Flex>
    )
}

export default HamurgerMenu
