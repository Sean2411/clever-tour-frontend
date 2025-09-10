import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Image,
  Badge,
  Button,
  useToast,
  Spinner,
  Flex,
  Divider,
  Grid
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/api/bookings/my-bookings`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      console.log('📋 Orders data received:', data.length, 'orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container maxW="container.xl" py={8}>
          <Flex justify="center" align="center" minH="60vh">
            <Spinner size="xl" />
          </Flex>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>My Orders - Smart Tourist</title>
      </Head>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Heading size="lg" mb={6}>My Orders</Heading>

        {orders.length === 0 ? (
          <Card>
            <CardBody>
              <Text textAlign="center" color="gray.500">
                You don't have any orders yet
              </Text>
                              <Button
                  mt={4}
                  colorScheme="blue"
                  onClick={() => router.push('/tours')}
                >
                  Browse Tours
                </Button>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {orders.map((order) => (
              <Card key={order.id}>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    {(order.tourId && typeof order.tourId === 'object') || (order.attractionId && typeof order.attractionId === 'object') ? (
                      <>
                        <Image
                          src={(order.tourId && order.tourId.image) || (order.attractionId && order.attractionId.image) || 'https://via.placeholder.com/400x200?text=No+Image'}
                          alt={(order.tourId && order.tourId.name) || (order.attractionId && order.attractionId.name) || 'Booking'}
                          borderRadius="md"
                          height="200px"
                          objectFit="cover"
                        />
                        
                        <Box>
                          <Heading size="md">
                            {(order.tourId && order.tourId.name) || (order.attractionId && order.attractionId.name)}
                          </Heading>
                          <Badge colorScheme={getStatusColor(order.status)} mt={2}>
                            {getStatusText(order.status)}
                          </Badge>
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <Heading size="md">Booking #{order.orderNumber || order.bookingNumber}</Heading>
                        <Badge colorScheme={getStatusColor(order.status)} mt={2}>
                          {getStatusText(order.status)}
                        </Badge>
                      </Box>
                    )}

                    <Divider />

                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text color="gray.500">Order Number</Text>
                        <Text fontWeight="bold">{order.orderNumber || order.bookingNumber}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.500">Booking Date</Text>
                        <Text>{order.bookingDate || new Date(order.createdAt).toLocaleDateString()}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.500">Booking Time</Text>
                        <Text>{order.bookingTime || new Date(order.createdAt).toLocaleTimeString()}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.500">Visit Date</Text>
                        <Text>{order.visitDate ? new Date(order.visitDate).toLocaleDateString() : 'TBD'}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.500">People</Text>
                        <Text>{order.numberOfAdults || order.adults || 0}A + {order.numberOfChildren || order.children || 0}C</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.500">Rooms</Text>
                        <Text>{order.rooms || 1}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.500">Payment</Text>
                        <Badge colorScheme={order.paymentStatus === 'paid' ? 'green' : 'yellow'} size="sm">
                          {order.paymentStatus || 'Pending'}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.500">Total Price</Text>
                        <Text color="blue.500" fontWeight="bold">
                          ${order.totalPrice}
                        </Text>
                      </HStack>
                    </VStack>

                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
} 