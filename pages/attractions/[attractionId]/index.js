import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Flex,
  Spinner,
  useToast,
  Divider,
  List,
  ListItem,
  ListIcon,
  Card,
  CardBody,
  Stack,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { CheckCircleIcon, StarIcon, TimeIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Head from 'next/head';
import mongoose from 'mongoose';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function AttractionDetail() {
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { attractionId } = router.query;
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (attractionId) {
      if (!mongoose.Types.ObjectId.isValid(attractionId)) {
        setError('Invalid attraction id');
        setLoading(false);
        return;
      }
      fetchAttraction();
    }
  }, [attractionId]);

  const fetchAttraction = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/attractions/${attractionId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch attraction information');
      }

      setAttraction(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch attraction information:', err);
      setError(err.message);
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

  const handleBookNow = () => {
    router.push(`/attractions/${attractionId}/book`);
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center" py={10}>
          <Text color="red.500" fontSize="lg" mb={4}>{error}</Text>
                      <Button onClick={() => fetchAttraction()}>Retry</Button>
        </Box>
      </Container>
    );
  }

  if (!attraction) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center" py={10}>
          <Text>Attraction not found</Text>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>{attraction.name} - Clever Tour</title>
        <meta name="description" content={attraction.description} />
      </Head>

      <Navbar />
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.xl" py={8}>
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            {/* Main Content Area */}
            <GridItem>
              <Stack spacing={6}>
                                  {/* Attraction Image */}
                <Box borderRadius="lg" overflow="hidden" shadow="lg">
                  <Image
                    src={attraction.image}
                    alt={attraction.name}
                    width="100%"
                    height="400px"
                    objectFit="cover"
                  />
                </Box>

                                  {/* Attraction Title and Basic Info */}
                <Card bg={cardBg}>
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <Heading size="lg">{attraction.name}</Heading>
                      
                      <HStack spacing={4} wrap="wrap">
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                          {attraction.category}
                        </Badge>
                        <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                          {attraction.duration}
                        </Badge>
                        <HStack spacing={1}>
                          <StarIcon color="yellow.400" />
                          <Text fontWeight="bold">{attraction.rating} / 5</Text>
                        </HStack>
                      </HStack>

                      <HStack spacing={6} color="gray.600">
                        <HStack spacing={2}>
                          <Icon as={FaMapMarkerAlt} />
                          <Text>{attraction.location}</Text>
                        </HStack>
                        <HStack spacing={2}>
                          <TimeIcon />
                          <Text>{attraction.duration}</Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                                  {/* Attraction Description */}
                <Card bg={cardBg}>
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <Heading size="md">Attraction Introduction</Heading>
                      <Text lineHeight="tall" fontSize="md">
                        {attraction.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                                  {/* Attraction Features */}
                {attraction.features && attraction.features.length > 0 && (
                  <Card bg={cardBg}>
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Attraction Features</Heading>
                        <List spacing={3}>
                          {attraction.features.map((feature, index) => (
                            <ListItem key={index}>
                              <ListIcon as={CheckCircleIcon} color="green.500" />
                              {feature}
                            </ListItem>
                          ))}
                        </List>
                      </VStack>
                    </CardBody>
                  </Card>
                )}
              </Stack>
            </GridItem>

                            {/* Sidebar - Booking Information */}
            <GridItem>
              <Card bg={cardBg} position="sticky" top={4}>
                <CardBody>
                  <VStack spacing={6}>
                    <Heading size="md">Booking Information</Heading>
                    
                    <VStack spacing={4} width="100%">
                      <HStack justify="space-between" width="100%">
                        <Text color="gray.600">Original Price</Text>
                        <Text textDecoration="line-through" color="gray.500">
                          ${attraction.originalPrice}
                        </Text>
                      </HStack>
                      
                      <HStack justify="space-between" width="100%">
                        <Text fontWeight="bold" fontSize="lg">Current Price</Text>
                        <Text fontWeight="bold" fontSize="xl" color="red.500">
                          ${attraction.price}
                        </Text>
                      </HStack>

                      {attraction.originalPrice > attraction.price && (
                                                  <Badge colorScheme="red" fontSize="sm">
                            Save ${attraction.originalPrice - attraction.price}
                          </Badge>
                      )}
                    </VStack>

                    <Divider />

                    <VStack spacing={4} width="100%">
                      <Button
                        colorScheme="blue"
                        size="lg"
                        width="100%"
                        onClick={handleBookNow}
                      >
                        Book Now
                      </Button>
                      
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        Click the book button to start your amazing journey
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
} 