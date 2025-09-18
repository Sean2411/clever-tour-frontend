import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Card,
  CardBody,
  Divider,
  Flex,
  Spinner,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';

function BookAttractionContent() {
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    adults: 1,
    children: 0,
    specialRequests: '',
    paymentMethod: 'credit_card'
  });
  const [errors, setErrors] = useState({});
  
  const router = useRouter();
  const { attractionId } = router.query;
  const toast = useToast();

  useEffect(() => {
    if (attractionId) {
      fetchAttraction();
    }
  }, [attractionId]);

  const fetchAttraction = async () => {
    try {
      setLoading(true);
      const apiUrl = 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/attractions/${attractionId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get attraction details');
      }

      setAttraction(data);
    } catch (err) {
      console.error('Failed to get attraction details:', err);
      toast({
        title: 'Error',
        description: err.message,
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
    if (!formData.name) newErrors.name = 'Please enter your name';
    if (!formData.email) newErrors.email = 'Please enter your email';
    if (!formData.phone) newErrors.phone = 'Please enter your phone number';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.time) newErrors.time = 'Please select a time';
    if (formData.adults + formData.children < 1) {
      newErrors.adults = 'At least one visitor is required';
    }
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
      const apiUrl = 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/attractions/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          attractionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      console.log('Booking response:', data); // 添加调试日志

      // Redirect to payment page
      if (data.id) {
        router.push(`/orders/${data.id}/payment`);
      } else {
        console.error('No booking id in response:', data);
        toast({
          title: 'Warning',
          description: 'Booking created but could not redirect to payment page',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Booking failed:', err);
      toast({
        title: 'Error',
        description: err.message,
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
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  if (!attraction) {
    return null;
  }

  const totalPrice = (formData.adults * attraction.price) + 
    (formData.children * attraction.price * 0.5);

  return (
    <>
      <Head>
        <title>Book {attraction.name} - Clever Tour</title>
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Booking Form */}
          <Box>
            <Heading size="lg" mb={6}>Booking Information</Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isInvalid={errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.phone}>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
                </FormControl>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl isInvalid={errors.date}>
                    <FormLabel>Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <FormErrorMessage>{errors.date}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.time}>
                    <FormLabel>Time</FormLabel>
                    <Select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="Select time"
                    >
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                    </Select>
                    <FormErrorMessage>{errors.time}</FormErrorMessage>
                  </FormControl>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl isInvalid={errors.adults}>
                    <FormLabel>Number of Adults</FormLabel>
                    <NumberInput
                      min={1}
                      value={formData.adults}
                      onChange={(value) => setFormData({ ...formData, adults: parseInt(value) })}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{errors.adults}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Number of Children</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.children}
                      onChange={(value) => setFormData({ ...formData, children: parseInt(value) })}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>Special Requests</FormLabel>
                  <Input
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder="Please describe any special requests here"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={submitting}
                  loadingText="Submitting..."
                >
                  Confirm Booking
                </Button>
              </VStack>
            </form>
          </Box>

          {/* Booking Summary */}
          <Box>
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={6}>
                  <Heading size="md">Booking Summary</Heading>
                  
                  <Box>
                    <Image
                      src={attraction.image}
                      alt={attraction.name}
                      borderRadius="md"
                      width="100%"
                      height="200px"
                      objectFit="cover"
                    />
                    <Heading size="sm" mt={4}>
                      {attraction.name}
                    </Heading>
                  </Box>

                  <Divider />

                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Text>Adult Tickets ({formData.adults})</Text>
                      <Text>${formData.adults * attraction.price}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Child Tickets ({formData.children})</Text>
                      <Text>${formData.children * attraction.price * 0.5}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between" fontWeight="bold">
                      <Text>Total</Text>
                      <Text>${totalPrice}</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default function BookAttraction() {
  return (
    <ProtectedRoute>
      <BookAttractionContent />
    </ProtectedRoute>
  );
} 