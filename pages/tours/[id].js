import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Container,
  Flex,
  Spinner,
  Text,
  Button,
  Grid,
  GridItem,
  VStack,
  HStack,
  Heading,
  Image,
  Badge,
  useToast,

  Card,
  CardBody,
  Divider,
  List,
  ListItem,
  ListIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { StarIcon, CheckIcon, TimeIcon, CalendarIcon, InfoIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt, FaUsers, FaUserFriends } from 'react-icons/fa';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TwoStepBookingModal from '../../components/TwoStepBookingModal';
import ProtectedRoute from '../../components/ProtectedRoute';
import {
  fetchTourDetails,
  calculateTotalPrice,
  createBooking,
  handleInputChange,
  handleNumberChange,
  getDefaultFormData
} from '../../lib/tours/util';

function TourDetailContent() {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(getDefaultFormData());

  // 使用简单的状态管理替代useDisclosure
  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // 重置表单数据
    setFormData(getDefaultFormData());
  };

  useEffect(() => {
    if (id) {
      fetchTour();
    }
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const result = await fetchTourDetails(id);
      
      if (result.success) {
        // 处理 304 Not Modified 响应
        if (result.notModified) {
          console.log('📋 Using cached tour data');
          // 对于 304 响应，我们可以保持当前状态或显示缓存指示
          // 这里我们简单地不更新状态，保持现有的 tour 数据
          return;
        }
        
        // Clean up the tour data to handle mixed types in arrays
        const tourData = result.data;
        
        if (!tourData) {
          setError('No tour data received');
          return;
        }
        
        // Filter features array to only include strings
        if (tourData.features && Array.isArray(tourData.features)) {
          tourData.features = tourData.features.filter(feature => typeof feature === 'string');
        }
        
        // Filter highlights array to only include strings
        if (tourData.highlights && Array.isArray(tourData.highlights)) {
          tourData.highlights = tourData.highlights.filter(highlight => typeof highlight === 'string');
        }
        
        // Filter includes array to only include strings
        if (tourData.includes && Array.isArray(tourData.includes)) {
          tourData.includes = tourData.includes.filter(item => typeof item === 'string');
        }
        
        // Filter excludes array to only include strings
        if (tourData.excludes && Array.isArray(tourData.excludes)) {
          tourData.excludes = tourData.excludes.filter(item => typeof item === 'string');
        }
        
        setTour(tourData);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e) => {
    handleInputChange(e, setFormData);
  };

  const onNumberChange = (name, value) => {
    handleNumberChange(name, value, setFormData);
  };

  const getTotalPrice = () => {
    if (!tour) return '0.00';
    return calculateTotalPrice(tour, formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await createBooking(id, formData, getTotalPrice());

      if (result.success) {
        toast({
          title: 'Booking Successful!',
          description: 'Your tour has been booked successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        handleClose();
        router.push(`/orders/${result.data.booking.id}`);
      } else {
        toast({
          title: 'Booking Failed',
          description: result.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Network Error',
        description: 'Please check your connection and try again.',
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
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center">
          <Text color="red.500" mb={4}>{error}</Text>
          <Button onClick={fetchTour}>Retry</Button>
        </Box>
      </Container>
    );
  }

  if (!tour) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{tour.name} - Clever Tour</title>
        <meta name="description" content={tour.description} />
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          <GridItem>
            <VStack spacing={8} align="stretch">
              {/* Tour Header */}
              <Box>
                <Image
                  src={tour.image}
                  alt={tour.name}
                  borderRadius="lg"
                  width="100%"
                  height="400px"
                  objectFit="cover"
                />
              </Box>

              <Box>
                <Heading size="xl" mb={4}>{tour.name}</Heading>
                <HStack spacing={4} mb={4}>
                  <Badge colorScheme="blue">{tour.category}</Badge>
                  <Badge colorScheme="green">{tour.duration}</Badge>
                  <HStack>
                    <StarIcon color="yellow.400" />
                    <Text fontWeight="bold">
                      {tour.rating} ({tour.reviewCount || 0} reviews)
                    </Text>
                  </HStack>
                </HStack>
                <Text color="gray.600" mb={6}>{tour.description}</Text>
              </Box>

              {/* Tour Tabs */}
              <Tabs>
                <TabList>
                  <Tab>Highlights</Tab>
                  <Tab>Itinerary</Tab>
                  <Tab>Cost Details</Tab>
                  <Tab>Booking Info</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <List spacing={3}>
                      {tour.highlights && tour.highlights.length > 0 ? (
                        tour.highlights.map((highlight, index) => (
                          <ListItem key={index}>
                            <ListIcon as={CheckIcon} color="green.500" />
                            {highlight}
                          </ListItem>
                        ))
                      ) : (
                        <Text color="gray.500">No highlights available</Text>
                      )}
                    </List>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={6} align="stretch">
                      {tour.itinerary && tour.itinerary.length > 0 ? (
                        tour.itinerary.map((day, index) => (
                          <Card key={index}>
                            <CardBody>
                              <Heading size="md" mb={4}>
                                Day {day.day}: {day.title}
                              </Heading>
                              <Text mb={4}>{day.description}</Text>
                              <List spacing={2}>
                                {day.activities && day.activities.length > 0 ? (
                                  day.activities.map((activity, i) => (
                                    <ListItem key={i}>
                                      <ListIcon as={TimeIcon} color="blue.500" />
                                      {activity}
                                    </ListItem>
                                  ))
                                ) : (
                                  <Text color="gray.500">No activities listed</Text>
                                )}
                              </List>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <Text color="gray.500">No itinerary available</Text>
                      )}
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <Heading size="md" mb={4}>What&apos;s Included</Heading>
                        <List spacing={3}>
                          {tour.includes && tour.includes.length > 0 ? (
                            tour.includes.map((item, index) => (
                              <ListItem key={index}>
                                <ListIcon as={CheckIcon} color="green.500" />
                                {item}
                              </ListItem>
                            ))
                          ) : (
                            <Text color="gray.500">No inclusions listed</Text>
                          )}
                        </List>
                      </Box>

                      <Box>
                        <Heading size="md" mb={4}>What&apos;s Not Included</Heading>
                        <List spacing={3}>
                          {tour.excludes && tour.excludes.length > 0 ? (
                            tour.excludes.map((item, index) => (
                              <ListItem key={index}>
                                <ListIcon as={InfoIcon} color="red.500" />
                                {item}
                              </ListItem>
                            ))
                          ) : (
                            <Text color="gray.500">No exclusions listed</Text>
                          )}
                        </List>
                      </Box>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <Heading size="md" mb={4}>Booking Information</Heading>
                        <List spacing={3}>
                          <ListItem>
                            <ListIcon as={FaMapMarkerAlt} color="blue.500" />
                            Departure City: {tour.departureCity || 'Not specified'}
                          </ListItem>
                          <ListItem>
                            <ListIcon as={FaUsers} color="blue.500" />
                            Maximum Group Size: {tour.maxGroupSize || 'Not specified'} people
                          </ListItem>
                          <ListItem>
                            <ListIcon as={FaUserFriends} color="blue.500" />
                            Minimum Age Requirement: {tour.minAge || 'Not specified'} years
                          </ListItem>
                        </List>
                      </Box>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </GridItem>

          <GridItem>
            {/* Tour Sidebar */}
            <Card>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="lg" mb={2}>Price</Heading>
                    <HStack>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                        ${tour.price}
                      </Text>
                      {tour.originalPrice && (
                        <Text color="gray.500" textDecoration="line-through">
                          ${tour.originalPrice}
                        </Text>
                      )}
                    </HStack>
                  </Box>

                  <Button colorScheme="blue" size="lg" onClick={handleOpen}>
                    Book Now
                  </Button>

                  <Divider />

                  <Box>
                    <Heading size="md" mb={4}>Quick Facts</Heading>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text color="gray.600">Duration</Text>
                        <Text fontWeight="bold">{tour.duration}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">Category</Text>
                        <Text fontWeight="bold">{tour.category}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">Rating</Text>
                        <HStack>
                          <StarIcon color="yellow.400" />
                          <Text fontWeight="bold">{tour.rating}/5</Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>

      {/* 使用两步式BookingModal组件 */}
      <TwoStepBookingModal
        isOpen={isModalOpen}
        onClose={handleClose}
        formData={formData}
        onInputChange={onInputChange}
        onNumberChange={onNumberChange}
        calculateTotalPrice={getTotalPrice}
        tourId={id}
        tour={tour}
      />
      <Footer />
    </>
  );
}

export default function TourDetail() {
  return (
    <ProtectedRoute>
      <TourDetailContent />
    </ProtectedRoute>
  );
} 