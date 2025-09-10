import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Badge,
  VStack,
  Divider,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'agent':
        return 'orange';
      case 'member':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'agent':
        return 'Agent';
      case 'member':
        return 'Member';
      default:
        return 'User';
    }
  };

  return (
    <Box bg="white" px={{ base: 2, md: 4 }} shadow="sm" position="sticky" top={0} zIndex={1000}>
      <Flex 
        h={{ base: 14, md: 16 }} 
        alignItems="center" 
        maxW="container.xl" 
        mx="auto"
        justify="space-between"
      >
        {/* Logo */}
        <NextLink href="/" passHref>
          <Link fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="blue.500">
            Clever Tour
          </Link>
        </NextLink>

        {/* Desktop Navigation */}
        <Flex 
          display={{ base: 'none', md: 'flex' }} 
          alignItems="center" 
          gap={{ base: 2, lg: 4 }}
        >
          <NextLink href="/tours" passHref>
            <Link px={3} py={2} _hover={{ color: 'blue.500' }}>Tours</Link>
          </NextLink>
          <NextLink href="/attractions" passHref>
            <Link px={3} py={2} _hover={{ color: 'blue.500' }}>Attractions</Link>
          </NextLink>
          
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
                size={{ base: 'sm', md: 'md' }}
              >
                <Flex alignItems="center" gap={2}>
                  <Avatar size={{ base: 'xs', md: 'sm' }} name={user.username} />
                  <VStack spacing={0} align="start" display={{ base: 'none', lg: 'flex' }}>
                    <Text fontSize="sm" fontWeight="medium">
                      {user.username}
                    </Text>
                    <Badge size="sm" colorScheme={getRoleColor(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </VStack>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => router.push('/profile')}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => router.push('/orders')}>
                  My Orders
                </MenuItem>
                
                {/* Admin-only menu items */}
                {user.role === 'admin' && (
                  <>
                    <MenuDivider />
                    <MenuItem onClick={() => router.push('/admin')}>
                      Admin Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => router.push('/admin/manageUser')}>
                      Manage Users
                    </MenuItem>
                    <MenuItem onClick={() => router.push('/admin/manageTours')}>
                      Manage Tours
                    </MenuItem>
                    <MenuItem onClick={() => router.push('/admin/manageAttractions')}>
                      Manage Attractions
                    </MenuItem>
                    <MenuItem onClick={() => router.push('/admin/bookings')}>
                      Manage Bookings
                    </MenuItem>
                    <MenuItem onClick={() => router.push('/admin/reports')}>
                      Reports
                    </MenuItem>
                  </>
                )}
                
                {/* Agent and Admin menu items */}
                {(user.role === 'agent' || user.role === 'admin') && (
                  <>
                    <MenuDivider />
                    <MenuItem onClick={() => router.push('/agent/bookings')}>
                      Manage Bookings
                    </MenuItem>
                    <MenuItem onClick={() => router.push('/agent/reports')}>
                      View Reports
                    </MenuItem>
                  </>
                )}
                
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button 
              colorScheme="blue" 
              onClick={handleLogin}
              size={{ base: 'sm', md: 'md' }}
            >
              Login
            </Button>
          )}
        </Flex>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="ghost"
          aria-label="Toggle Navigation"
          size="sm"
        />
      </Flex>

      {/* Mobile Navigation */}
      <Collapse in={isOpen} animateOpacity>
        <Box 
          bg="white" 
          px={4} 
          py={2} 
          borderTop="1px" 
          borderColor="gray.200"
          shadow="md"
        >
          <VStack spacing={3} align="stretch">
            <NextLink href="/tours" passHref>
              <Link 
                px={3} 
                py={2} 
                _hover={{ bg: 'gray.100' }}
                onClick={onToggle}
              >
                Tours
              </Link>
            </NextLink>
            <NextLink href="/attractions" passHref>
              <Link 
                px={3} 
                py={2} 
                _hover={{ bg: 'gray.100' }}
                onClick={onToggle}
              >
                Attractions
              </Link>
            </NextLink>
            
            {user ? (
              <VStack spacing={2} align="stretch">
                <Text px={3} py={2} fontSize="sm" color="gray.600">
                  Welcome, {user.username}
                </Text>
                <Button 
                  variant="ghost" 
                  justifyContent="flex-start"
                  onClick={() => {
                    router.push('/profile');
                    onToggle();
                  }}
                >
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  justifyContent="flex-start"
                  onClick={() => {
                    router.push('/orders');
                    onToggle();
                  }}
                >
                  My Orders
                </Button>
                
                {/* Admin mobile menu items */}
                {user.role === 'admin' && (
                  <>
                    <Divider />
                    <Text px={3} py={1} fontSize="xs" color="gray.500" fontWeight="bold">
                      ADMIN
                    </Text>
                    <Button 
                      variant="ghost" 
                      justifyContent="flex-start"
                      onClick={() => {
                        router.push('/admin');
                        onToggle();
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      justifyContent="flex-start"
                      onClick={() => {
                        router.push('/admin/manageUser');
                        onToggle();
                      }}
                    >
                      Manage Users
                    </Button>
                    <Button 
                      variant="ghost" 
                      justifyContent="flex-start"
                      onClick={() => {
                        router.push('/admin/manageTours');
                        onToggle();
                      }}
                    >
                      Manage Tours
                    </Button>
                    <Button 
                      variant="ghost" 
                      justifyContent="flex-start"
                      onClick={() => {
                        router.push('/admin/manageAttractions');
                        onToggle();
                      }}
                    >
                      Manage Attractions
                    </Button>
                    <Button 
                      variant="ghost" 
                      justifyContent="flex-start"
                      onClick={() => {
                        router.push('/admin/bookings');
                        onToggle();
                      }}
                    >
                      Manage Bookings
                    </Button>
                    <Button 
                      variant="ghost" 
                      justifyContent="flex-start"
                      onClick={() => {
                        router.push('/admin/reports');
                        onToggle();
                      }}
                    >
                      Reports
                    </Button>
                  </>
                )}
                
                {/* Agent mobile menu items */}
                {(user.role === 'agent' || user.role === 'admin') && (
                  <>
                    <Divider />
                    <Text px={3} py={1} fontSize="xs" color="gray.500" fontWeight="bold">
                      AGENT
                    </Text>
                    <Button 
                      variant="ghost" 
                      justifyContent="flex-start"
                      onClick={() => {
                        router.push('/agent/bookings');
                        onToggle();
                      }}
                    >
                      Manage Bookings
                    </Button>
                    <Button 
                      variant="ghost" 
                      justifyContent="flex-start"
                      onClick={() => {
                        router.push('/agent/reports');
                        onToggle();
                      }}
                    >
                      View Reports
                    </Button>
                  </>
                )}
                
                <Divider />
                <Button 
                  variant="ghost" 
                  justifyContent="flex-start"
                  colorScheme="red"
                  onClick={() => {
                    handleLogout();
                    onToggle();
                  }}
                >
                  Logout
                </Button>
              </VStack>
            ) : (
              <Button 
                colorScheme="blue" 
                onClick={() => {
                  handleLogin();
                  onToggle();
                }}
                size="sm"
              >
                Login
              </Button>
            )}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'blue.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'blue.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: 'Theme Parks',
    children: [
      {
        label: 'Disneyland',
        subLabel: 'Experience magical adventures in the kingdom',
        href: '#',
      },
      {
        label: 'Universal Studios',
        subLabel: 'Step into the world of movies and thrilling adventures',
        href: '#',
      },
    ],
  },
  {
    label: 'Hotel Booking',
    href: '#',
  },
  {
    label: 'Travel Packages',
    href: '#',
  },
]; 