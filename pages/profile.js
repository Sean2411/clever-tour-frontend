import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Avatar,
  Badge,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
  Flex,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({
        username: parsedUser.username,
        email: parsedUser.email,
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch orders
      const ordersResponse = await fetch('/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

      // Fetch bookings
      const bookingsResponse = await fetch('/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({
      username: user.username,
      email: user.email,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local storage
      const updatedUser = { ...user, ...editForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
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
        return 'Administrator';
      case 'agent':
        return 'Agent';
      case 'member':
        return 'Member';
      default:
        return 'User';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" />
        </Flex>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile - Clever Tour</title>
        <meta name="description" content="Manage your profile and view your bookings" />
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Profile Header */}
          <Card>
            <CardBody>
              <HStack spacing={6} align="start">
                <Avatar size="xl" name={user.username} />
                <VStack align="start" spacing={2} flex={1}>
                  <HStack justify="space-between" width="100%">
                    <VStack align="start" spacing={1}>
                      <Heading size="lg">{user.username}</Heading>
                      <Text color="gray.600">{user.email}</Text>
                      <Text fontSize="lg" fontWeight="bold" color={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)} <Text as="span" fontSize="md" color="gray.500">({user.role})</Text>
                      </Text>
                      <Badge colorScheme={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </VStack>
                    <VStack spacing={2}>
                      {!editing ? (
                        <Button colorScheme="blue" onClick={handleEdit}>
                          Edit Profile
                        </Button>
                      ) : (
                        <HStack>
                          <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>
                            Save
                          </Button>
                          <Button variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </HStack>
                      )}
                      <Button variant="outline" colorScheme="red" onClick={handleLogout}>
                        Logout
                      </Button>
                    </VStack>
                  </HStack>
                  
                  {editing && (
                    <Box width="100%" mt={4}>
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel>Username</FormLabel>
                          <Input
                            value={editForm.username}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          />
                        </FormControl>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Stat>
              <StatLabel>Total Orders</StatLabel>
              <StatNumber>{orders.length}</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Active Bookings</StatLabel>
              <StatNumber>{bookings.filter(b => b.status === 'confirmed').length}</StatNumber>
              <StatHelpText>Confirmed bookings</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Member Since</StatLabel>
              <StatNumber>{formatDate(user.createdAt)}</StatNumber>
              <StatHelpText>Account created</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Tabs for Orders and Bookings */}
          <Tabs variant="enclosed">
            <TabList>
              <Tab>My Orders</Tab>
              <Tab>My Bookings</Tab>
            </TabList>

            <TabPanels>
              {/* Orders Tab */}
              <TabPanel>
                {orders.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    No orders found. Start exploring our tours and attractions!
                  </Alert>
                ) : (
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Order ID</Th>
                          <Th>Type</Th>
                          <Th>Amount</Th>
                          <Th>Status</Th>
                          <Th>Date</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {orders.map((order) => (
                          <Tr key={order.id}>
                            <Td>{order.id.slice(-8)}</Td>
                            <Td>{order.type}</Td>
                            <Td>${order.totalAmount}</Td>
                            <Td>
                              <Badge colorScheme={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </Td>
                            <Td>{formatDate(order.createdAt)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>

              {/* Bookings Tab */}
              <TabPanel>
                {bookings.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    No bookings found. Start booking tours and attractions!
                  </Alert>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {bookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <HStack justify="space-between" width="100%">
                              <VStack align="start" spacing={1}>
                                <Heading size="md">{booking.tourName || booking.attractionName}</Heading>
                                <Text color="gray.600">
                                  {booking.tourId ? 'Tour' : 'Attraction'} Booking
                                </Text>
                              </VStack>
                              <Badge colorScheme={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </HStack>
                            
                            <Divider />
                            
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="bold">Booking Details</Text>
                                <Text>Date: {formatDate(booking.date)}</Text>
                                <Text>Adults: {booking.adults}</Text>
                                <Text>Children: {booking.children}</Text>
                                <Text>Total: ${booking.totalPrice}</Text>
                              </VStack>
                              
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="bold">Contact Info</Text>
                                <Text>Name: {booking.name}</Text>
                                <Text>Email: {booking.email}</Text>
                                <Text>Phone: {booking.phone}</Text>
                              </VStack>
                            </SimpleGrid>
                            
                            {booking.specialRequests && (
                              <Box width="100%">
                                <Text fontWeight="bold">Special Requests:</Text>
                                <Text>{booking.specialRequests}</Text>
                              </Box>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
      <Footer />
    </>
  );
} 