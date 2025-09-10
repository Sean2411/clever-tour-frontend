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

export default function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get order details');
      }

      console.log('📋 Order data received:', data);
      setOrder(data);
    } catch (error) {
      console.error('Failed to get order details:', error);
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

  if (!order) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Order Details - {(order.tourId && order.tourId.name) || (order.attractionId && order.attractionId.name) || `Booking #${order.bookingNumber}`} - Smart Tourist</title>
      </Head>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Order Information */}
          <Box>
            <Heading size="lg" mb={6}>Order Details</Heading>
            
            <Card mb={6}>
              <CardBody>
                <VStack align="stretch" spacing={6}>
                  {order.tourId || order.attractionId ? (
                    <>
                      <Image
                        src={(order.tourId && order.tourId.image) || (order.attractionId && order.attractionId.image) || 'https://via.placeholder.com/800x300?text=No+Image'}
                        alt={(order.tourId && order.tourId.name) || (order.attractionId && order.attractionId.name) || 'Booking'}
                        borderRadius="md"
                        height="300px"
                        objectFit="cover"
                      />
                      
                      <Box>
                        <Heading size="md">
                          {(order.tourId && order.tourId.name) || (order.attractionId && order.attractionId.name) || `Booking #${order.bookingNumber}`}
                        </Heading>
                        <Badge colorScheme={getStatusColor(order.status)} mt={2}>
                          {getStatusText(order.status)}
                        </Badge>
                        {(order.tourId && order.tourId.description) || (order.attractionId && order.attractionId.description) ? (
                          <Text mt={2} color="gray.600">
                            {(order.tourId && order.tourId.description) || (order.attractionId && order.attractionId.description)}
                          </Text>
                        ) : null}
                      </Box>
                    </>
                  ) : (
                    <Box>
                      <Heading size="md">Booking #{order.bookingNumber}</Heading>
                      <Badge colorScheme={getStatusColor(order.status)} mt={2}>
                        {getStatusText(order.status)}
                      </Badge>
                    </Box>
                  )}

                  <Divider />

                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.500">Order Number</Text>
                      <Text fontWeight="bold">{order.orderNumber || order.bookingNumber}</Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.500">Booking Date</Text>
                      <Text fontWeight="bold">{order.bookingDate || new Date(order.createdAt).toLocaleDateString()}</Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.500">Booking Time</Text>
                      <Text fontWeight="bold">{order.bookingTime || new Date(order.createdAt).toLocaleTimeString()}</Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.500">Visit Date</Text>
                      <Text fontWeight="bold">{order.visitDate ? new Date(order.visitDate).toLocaleDateString() : 'TBD'}</Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.500">Total Price</Text>
                      <Text fontWeight="bold" color="blue.500">${order.totalPrice}</Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.500">Payment Status</Text>
                      <Badge colorScheme={order.paymentStatus === 'paid' ? 'green' : 'yellow'}>
                        {order.paymentStatus || 'Pending'}
                      </Badge>
                    </VStack>
                  </Grid>

                  <Divider />

                  <VStack align="stretch" spacing={4}>
                    <Heading size="sm">Visitor Information</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <VStack align="start" spacing={2}>
                        <Text color="gray.500">Name</Text>
                        <Text>{order.name}</Text>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text color="gray.500">Email</Text>
                        <Text>{order.email}</Text>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text color="gray.500">Phone</Text>
                        <Text>{order.phone}</Text>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text color="gray.500">Number of People</Text>
                        <Text>{order.numberOfAdults || order.adults || 0} Adults + {order.numberOfChildren || order.children || 0} Children</Text>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text color="gray.500">Number of Rooms</Text>
                        <Text>{order.rooms || 1} Room{(order.rooms || 1) > 1 ? 's' : ''}</Text>
                      </VStack>
                    </Grid>
                  </VStack>

                  {order.specialRequests && (
                    <>
                      <Divider />
                      <VStack align="stretch" spacing={2}>
                        <Text color="gray.500">Special Requests</Text>
                        <Text>{order.specialRequests}</Text>
                      </VStack>
                    </>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </Box>

          {/* E-Ticket */}
          {order.status === 'confirmed' && (
            <Box>
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={6}>
                    <Heading size="md">E-Ticket</Heading>
                    <Box
                      p={4}
                      border="1px"
                      borderColor="gray.200"
                      borderRadius="md"
                      bg="white"
                      textAlign="center"
                    >
                      <Text fontSize="lg" fontWeight="bold" mb={2}>
                        Ticket #{order.orderNumber || order.bookingNumber}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {(order.tourId && order.tourId.name) || (order.attractionId && order.attractionId.name) || 'Booking'}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={2}>
                        Visit Date: {order.visitDate ? new Date(order.visitDate).toLocaleDateString() : 'TBD'}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Booked on: {order.bookingDate} at {order.bookingTime}
                      </Text>
                    </Box>
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      Please show this QR code when entering the park
                    </Text>
                    <Button
                      colorScheme="blue"
                      onClick={() => window.print()}
                    >
                      Print Ticket
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          )}
        </Grid>
      </Container>
    </>
  );
} 