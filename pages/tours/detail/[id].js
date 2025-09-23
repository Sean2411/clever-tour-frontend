import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  Button,
  useToast,
  Flex,
  Spinner,
  Grid,
  GridItem,
  Divider,
  List,
  ListItem,
  ListIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Stack,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { StarIcon, CheckIcon, TimeIcon, CalendarIcon, InfoIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt, FaUsers, FaUserFriends } from 'react-icons/fa';
import Head from 'next/head';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { ImageGallery } from '../../../components/ResponsiveImage';

// 动态导入可能引起SSR问题的组件
const DynamicTabs = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.Tabs })), { ssr: false });
const DynamicTabList = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.TabList })), { ssr: false });
const DynamicTabPanels = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.TabPanels })), { ssr: false });
const DynamicTab = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.Tab })), { ssr: false });
const DynamicTabPanel = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.TabPanel })), { ssr: false });

// 动态导入Modal相关组件
const DynamicModal = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.Modal })), { ssr: false });
const DynamicModalOverlay = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.ModalOverlay })), { ssr: false });
const DynamicModalContent = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.ModalContent })), { ssr: false });
const DynamicModalHeader = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.ModalHeader })), { ssr: false });
const DynamicModalBody = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.ModalBody })), { ssr: false });
const DynamicModalCloseButton = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.ModalCloseButton })), { ssr: false });

function TourDetailContent() {
  const [tour, setTour] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    adults: 1,
    children: 0,
    specialRequests: ''
  });

  useEffect(() => {
    if (id) {
      fetchTour();
    }
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      // 获取旅游路线基本信息
      const response = await fetch(`${apiUrl}/api/tours/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get tour details');
      }

      setTour(data);
      
      // 获取关联图片
      try {
        const imagesResponse = await fetch(`${apiUrl}/api/upload/entity/tour/${id}`);
        const imagesData = await imagesResponse.json();
        
        if (imagesData.success) {
          const allImages = imagesData.data.images;
          // 过滤出上传的图片对象（排除字符串URL）
          const uploadedImages = allImages.filter(img => typeof img === 'object' && img.fileName);
          
          // 如果有上传的图片，使用上传的图片；否则使用原有的图片
          if (uploadedImages.length > 0) {
            setImages(uploadedImages);
            // 找到主图的索引，如果没有主图则使用第一张
            const primaryIndex = uploadedImages.findIndex(img => img.isPrimary);
            setSelectedImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
          } else {
            // 如果没有上传的图片，创建一个包含原有图片的对象
            const fallbackImage = {
              fileName: 'default',
              original: { url: data.image },
              thumbnails: [
                { size: 'thumbnail', url: data.image },
                { size: 'medium', url: data.image },
                { size: 'large', url: data.image }
              ],
              isPrimary: true
            };
            setImages([fallbackImage]);
            setSelectedImageIndex(0);
          }
        }
      } catch (imageError) {
        console.warn('Failed to fetch images:', imageError);
        // 图片获取失败时使用原有图片
        const fallbackImage = {
          fileName: 'default',
          original: { url: data.image },
          thumbnails: [
            { size: 'thumbnail', url: data.image },
            { size: 'medium', url: data.image },
            { size: 'large', url: data.image }
          ],
          isPrimary: true
        };
        setImages([fallbackImage]);
        setSelectedImageIndex(0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to get tour details:', err);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tourId: id,
          totalPrice: calculateTotalPrice()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      console.log('Booking response:', data); // 添加调试日志

      toast({
        title: 'Booking Successful',
        description: 'We will contact you soon to confirm details',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      
      // 检查bookingId是否存在
      if (data.bookingId) {
        router.push(`/orders/${data.bookingId}`);
      } else {
        console.error('No bookingId in response:', data);
        toast({
          title: 'Warning',
          description: 'Booking created but could not redirect to order page',
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
    }
  };

  const calculateTotalPrice = () => {
    if (!tour) return 0;
    return (formData.adults * tour.price) + (formData.children * tour.price * 0.7);
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

  // 获取当前选中的图片
  const currentImage = images[selectedImageIndex];
  const mainImageSrc = currentImage ? currentImage.original.url : tour.image;

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
              {/* 主图和副图区域 */}
              <Box>
                <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={4}>
                  {/* 主图区域 */}
                  <GridItem>
                    <Image
                      src={mainImageSrc}
                      alt={tour.name}
                      borderRadius="lg"
                      width="100%"
                      height="400px"
                      objectFit="cover"
                      cursor="pointer"
                      _hover={{ transform: 'scale(1.02)' }}
                      transition="transform 0.2s"
                    />
                  </GridItem>
                  
                  {/* 副图区域 */}
                  {images.length > 1 && (
                    <GridItem>
                      <VStack spacing={2} align="stretch">
                        {images.slice(0, 4).map((image, index) => (
                          <Box
                            key={index}
                            position="relative"
                            cursor="pointer"
                            onClick={() => setSelectedImageIndex(index)}
                            borderRadius="md"
                            overflow="hidden"
                            border={selectedImageIndex === index ? "3px solid" : "2px solid"}
                            borderColor={selectedImageIndex === index ? "blue.500" : "gray.200"}
                            _hover={{ borderColor: "blue.300" }}
                            transition="all 0.2s"
                          >
                            <Image
                              src={image.thumbnails.find(t => t.size === 'thumbnail')?.url || image.original.url}
                              alt={`${tour.name} 图片 ${index + 1}`}
                              width="100%"
                              height="90px"
                              objectFit="cover"
                            />
                            {image.isPrimary && (
                              <Box
                                position="absolute"
                                top="2px"
                                right="2px"
                                bg="blue.500"
                                color="white"
                                px={1}
                                py={0.5}
                                borderRadius="sm"
                                fontSize="xs"
                                fontWeight="bold"
                              >
                                主图
                              </Box>
                            )}
                          </Box>
                        ))}
                        {images.length > 4 && (
                          <Box
                            textAlign="center"
                            py={2}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              colorScheme="blue"
                              onClick={() => setSelectedImageIndex(4)}
                              _hover={{ bg: "blue.50" }}
                            >
                              +{images.length - 4} 更多图片
                            </Button>
                          </Box>
                        )}
                      </VStack>
                    </GridItem>
                  )}
                </Grid>
              </Box>

              <Box>
                <Heading size="xl" mb={4}>{tour.name}</Heading>
                <HStack spacing={4} mb={4}>
                  <Badge colorScheme="blue">{tour.category}</Badge>
                  <Badge colorScheme="green">{tour.duration}</Badge>
                  <HStack>
                    <StarIcon color="yellow.400" />
                    <Text fontWeight="bold">
                      {tour.rating} ({tour.reviewCount} reviews)
                    </Text>
                  </HStack>
                </HStack>
                <Text color="gray.600" mb={6}>{tour.description}</Text>
              </Box>

              <DynamicTabs>
                <DynamicTabList>
                  <DynamicTab>Highlights</DynamicTab>
                  <DynamicTab>Itinerary</DynamicTab>
                  <DynamicTab>Cost Details</DynamicTab>
                  <DynamicTab>Booking Info</DynamicTab>
                </DynamicTabList>

                <DynamicTabPanels>
                  <DynamicTabPanel>
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
                  </DynamicTabPanel>

                  <DynamicTabPanel>
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
                  </DynamicTabPanel>

                  <DynamicTabPanel>
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
                  </DynamicTabPanel>

                  <DynamicTabPanel>
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
                  </DynamicTabPanel>
                </DynamicTabPanels>
              </DynamicTabs>
            </VStack>
          </GridItem>

          <GridItem>
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

                  <Button colorScheme="blue" size="lg" onClick={onOpen}>
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

      {/* Booking Modal */}
      <DynamicModal isOpen={isOpen} onClose={onClose} size="lg">
        <DynamicModalOverlay />
        <DynamicModalContent>
          <DynamicModalHeader>Book Your Tour</DynamicModalHeader>
          <DynamicModalCloseButton />
          <DynamicModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Preferred Date</FormLabel>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>

                <HStack spacing={4} w="100%">
                  <FormControl>
                    <FormLabel>Adults</FormLabel>
                    <NumberInput
                      name="adults"
                      value={formData.adults}
                      onChange={(value) => handleNumberChange('adults', value)}
                      min={1}
                      max={10}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Children</FormLabel>
                    <NumberInput
                      name="children"
                      value={formData.children}
                      onChange={(value) => handleNumberChange('children', value)}
                      min={0}
                      max={10}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Special Requests</FormLabel>
                  <Textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any special requests or requirements"
                    rows={3}
                  />
                </FormControl>

                <Box w="100%" p={4} bg="gray.50" borderRadius="md">
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Total Price:</Text>
                    <Text fontWeight="bold" color="blue.500">
                      ${calculateTotalPrice()}
                    </Text>
                  </HStack>
                </Box>

                <Button type="submit" colorScheme="blue" w="100%">
                  Confirm Booking
                </Button>
              </VStack>
            </form>
          </DynamicModalBody>
        </DynamicModalContent>
      </DynamicModal>
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