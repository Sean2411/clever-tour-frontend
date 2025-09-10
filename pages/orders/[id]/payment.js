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
  Grid,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../../components/Navbar';

export default function Payment() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });
  const [errors, setErrors] = useState({});
  
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
      const response = await fetch(`/api/bookings/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch order details');
      }

      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
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

  const validateForm = () => {
    const newErrors = {};
    if (!cardInfo.number) newErrors.number = 'Please enter card number';
    if (!cardInfo.expiry) newErrors.expiry = 'Please enter expiry date';
    if (!cardInfo.cvc) newErrors.cvc = 'Please enter CVC';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: id,
          paymentMethod: 'credit',
          cardInfo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      // Redirect to order details page after successful payment
      router.push(`/orders/${id}`);
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
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
        <title>Payment - {order.attractionId.name} - Clever Tour</title>
      </Head>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Order Information */}
          <Box>
            <Heading size="lg" mb={6}>Order Information</Heading>
            <Card mb={6}>
              <CardBody>
                <VStack align="stretch" spacing={6}>
                  <Image
                    src={order.attractionId.image}
                    alt={order.attractionId.name}
                    borderRadius="md"
                    height="300px"
                    objectFit="cover"
                  />
                  
                  <Box>
                    <Heading size="md">{order.attractionId.name}</Heading>
                    <Badge colorScheme="yellow" mt={2}>
                      Pending Payment
                    </Badge>
                  </Box>

                  <Divider />

                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.500">Order Number</Text>
                      <Text fontWeight="bold">{order.bookingNumber}</Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.500">Booking Date</Text>
                      <Text fontWeight="bold">{new Date(order.date).toLocaleDateString()}</Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.500">Booking Time</Text>
                      <Text fontWeight="bold">{order.time}</Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.500">Total Price</Text>
                      <Text fontWeight="bold" color="blue.500">${order.totalPrice}</Text>
                    </VStack>
                  </Grid>
                </VStack>
              </CardBody>
            </Card>
          </Box>

                      {/* Payment Form */}
          <Box>
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={6}>
                  <Heading size="md">Payment Information</Heading>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                      <FormControl isInvalid={errors.number}>
                        <FormLabel>Card Number</FormLabel>
                        <Input
                          value={cardInfo.number}
                          onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                          placeholder="Please enter card number"
                        />
                        <FormErrorMessage>{errors.number}</FormErrorMessage>
                      </FormControl>

                      <HStack spacing={4}>
                        <FormControl isInvalid={errors.expiry}>
                          <FormLabel>Expiry Date</FormLabel>
                          <Input
                            value={cardInfo.expiry}
                            onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                            placeholder="MM/YY"
                          />
                          <FormErrorMessage>{errors.expiry}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.cvc}>
                          <FormLabel>CVC</FormLabel>
                          <Input
                            value={cardInfo.cvc}
                            onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                            placeholder="CVC"
                          />
                          <FormErrorMessage>{errors.cvc}</FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        isLoading={submitting}
                        loadingText="Processing"
                      >
                        Pay ${order.totalPrice}
                      </Button>
                    </VStack>
                  </form>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </Grid>
      </Container>
    </>
  );
} 