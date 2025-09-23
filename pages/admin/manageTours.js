import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Flex,
  IconButton,
  Tooltip,
  SimpleGrid,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { AdminOnly } from '../../components/ProtectedRoute';
import AdminCard from '../../components/AdminCard';
import ResponsiveGrid from '../../components/ResponsiveGrid';

export default function ManageTours() {
  const { t } = useTranslation();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTour, setEditingTour] = useState(null);
  const [deleteTour, setDeleteTour] = useState(null);
  
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const toast = useToast();

  // Form state for adding/editing tour
  const [tourForm, setTourForm] = useState({
    name: '',
    description: '',
    duration: '',
    price: 0,
    originalPrice: 0,
    rating: 0,
    reviewCount: 0,
    image: '',
    images: [],
    features: [],
    itinerary: [],
    highlights: [],
    includes: [],
    excludes: [],
    departureCity: '',
    category: '',
    tags: [],
    maxGroupSize: 1,
    minAge: 0,
    status: 'active'
  });

  const categories = [
    { value: 'City Sightseeing', label: t('tours.citySightseeing') },
    { value: 'Natural Landscape', label: t('tours.naturalLandscape') },
    { value: 'Historical Culture', label: t('tours.historicalCulture') },
    { value: 'Theme Park', label: t('tours.themePark') },
    { value: 'Food Tour', label: t('tours.foodTour') },
    { value: 'Shopping Tour', label: t('tours.shoppingTour') }
  ];

  const statusOptions = [
    { value: 'active', label: t('admin.tourStatus.active') },
    { value: 'inactive', label: t('admin.tourStatus.inactive') },
    { value: 'sold_out', label: t('admin.tourStatus.soldOut') }
  ];

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    // Filter tours based on search term
    const filtered = tours.filter(tour =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.departureCity.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTours(filtered);
  }, [tours, searchTerm]);

  const fetchTours = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/admin/tours`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTours(data.tours);
      } else {
        toast({
          title: t('common.error'),
          description: t('admin.fetchToursError'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        title: t('common.error'),
        description: t('admin.fetchToursError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTour = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/admin/tours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tourForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: t('common.success'),
          description: t('admin.tourCreatedSuccess'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onAddClose();
        resetForm();
        fetchTours();
      } else {
        toast({
          title: t('common.error'),
          description: data.message || t('admin.createTourError'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      toast({
        title: t('common.error'),
        description: t('admin.createTourError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditTour = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/admin/tours/${editingTour.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tourForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: t('common.success'),
          description: t('admin.tourUpdatedSuccess'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onEditClose();
        setEditingTour(null);
        resetForm();
        fetchTours();
      } else {
        toast({
          title: t('common.error'),
          description: data.message || t('admin.updateTourError'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating tour:', error);
      toast({
        title: t('common.error'),
        description: t('admin.updateTourError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTour = async () => {
    if (!deleteTour) return;

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/admin/tours/${deleteTour.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: t('common.success'),
          description: t('admin.tourDeletedSuccess'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onDeleteClose();
        setDeleteTour(null);
        fetchTours();
      } else {
        toast({
          title: t('common.error'),
          description: data.message || t('admin.deleteTourError'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast({
        title: t('common.error'),
        description: t('admin.deleteTourError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setTourForm({
      name: '',
      description: '',
      duration: '',
      price: 0,
      originalPrice: 0,
      rating: 0,
      reviewCount: 0,
      image: '',
      images: [],
      features: [],
      itinerary: [],
      highlights: [],
      includes: [],
      excludes: [],
      departureCity: '',
      category: '',
      tags: [],
      maxGroupSize: 1,
      minAge: 0,
      status: 'active'
    });
  };

  const handleEdit = (tour) => {
    setEditingTour(tour);
    setTourForm({
      name: tour.name,
      description: tour.description,
      duration: tour.duration,
      price: tour.price,
      originalPrice: tour.originalPrice,
      rating: tour.rating,
      reviewCount: tour.reviewCount,
      image: tour.image,
      images: tour.images || [],
      features: tour.features || [],
      itinerary: tour.itinerary || [],
      highlights: tour.highlights || [],
      includes: tour.includes || [],
      excludes: tour.excludes || [],
      departureCity: tour.departureCity,
      category: tour.category,
      tags: tour.tags || [],
      maxGroupSize: tour.maxGroupSize,
      minAge: tour.minAge,
      status: tour.status
    });
    onEditOpen();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'gray';
      case 'sold_out':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Define fields for AdminCard
  const tourFields = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'badge', colorScheme: 'blue' },
    { key: 'duration', label: 'Duration', type: 'text' },
    { key: 'price', label: 'Price', type: 'price' },
    { key: 'status', label: 'Status', type: 'status' },
  ];

  const addArrayItem = (field, value) => {
    if (value.trim()) {
      setTourForm(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setTourForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <AdminOnly>
        <Navbar />
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" />
        </Flex>
        <Footer />
      </AdminOnly>
    );
  }

  return (
    <AdminOnly>
      <Head>
        <title>{t('admin.manageTours')} - 智旅</title>
        <meta name="description" content={t('admin.manageToursDescription')} />
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          <VStack spacing={4} align="stretch">
            <Heading 
              size={{ base: "lg", md: "xl" }}
              textAlign={{ base: "center", md: "left" }}
            >
              {t('admin.manageTours')}
            </Heading>
            <Button 
              leftIcon={<AddIcon />} 
              colorScheme="blue" 
              onClick={onAddOpen}
              size={{ base: "md", md: "lg" }}
              width={{ base: "100%", md: "auto" }}
            >
              {t('admin.addTour')}
            </Button>
          </VStack>

          {/* Search Bar */}
          <Box>
            <HStack spacing={{ base: 2, md: 4 }}>
              <Input
                placeholder={t('admin.searchTours')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={{ base: "md", md: "lg" }}
                fontSize={{ base: "sm", md: "md" }}
              />
              <SearchIcon color="gray.400" />
            </HStack>
          </Box>

          {/* Tours Cards/Table */}
          <Box>
            <ResponsiveGrid columns={{ base: 1, md: 1 }} spacing={{ base: 4, md: 6 }}>
              {filteredTours.map((tour) => (
                <AdminCard
                  key={tour.id}
                  item={tour}
                  fields={tourFields}
                  onEdit={handleEdit}
                  onDelete={(tour) => {
                    setDeleteTour(tour);
                    onDeleteOpen();
                  }}
                  getStatusColor={getStatusColor}
                />
              ))}
            </ResponsiveGrid>
          </Box>

          <Text 
            color="gray.600" 
            fontSize={{ base: "sm", md: "md" }}
            textAlign={{ base: "center", md: "left" }}
          >
            {t('admin.totalTours')}: {filteredTours.length}
          </Text>
        </VStack>
      </Container>

      {/* Add/Edit Tour Modal */}
      <Modal isOpen={isAddOpen || isEditOpen} onClose={isAddOpen ? onAddClose : onEditClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="4xl">
          <ModalHeader>{isAddOpen ? t('admin.addNewTour') : t('admin.editTour')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('admin.tourName')}</FormLabel>
                  <Input
                    value={tourForm.name}
                    onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                    placeholder={t('admin.enterTourName')}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{t('admin.category')}</FormLabel>
                  <Select
                    value={tourForm.category}
                    onChange={(e) => setTourForm({ ...tourForm, category: e.target.value })}
                    placeholder={t('admin.selectCategory')}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>{t('admin.description')}</FormLabel>
                <Textarea
                  value={tourForm.description}
                  onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                  placeholder={t('admin.enterTourDescription')}
                  rows={3}
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('admin.duration')}</FormLabel>
                  <Input
                    value={tourForm.duration}
                    onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                    placeholder={t('admin.enterDuration')}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{t('admin.price')} ($)</FormLabel>
                  <NumberInput
                    value={tourForm.price}
                    onChange={(value) => setTourForm({ ...tourForm, price: parseFloat(value) || 0 })}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{t('admin.originalPrice')} ($)</FormLabel>
                  <NumberInput
                    value={tourForm.originalPrice}
                    onChange={(value) => setTourForm({ ...tourForm, originalPrice: parseFloat(value) || 0 })}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('admin.rating')}</FormLabel>
                  <NumberInput
                    value={tourForm.rating}
                    onChange={(value) => setTourForm({ ...tourForm, rating: parseFloat(value) || 0 })}
                    min={0}
                    max={5}
                    step={0.1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('admin.reviewCount')}</FormLabel>
                  <NumberInput
                    value={tourForm.reviewCount}
                    onChange={(value) => setTourForm({ ...tourForm, reviewCount: parseInt(value) || 0 })}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{t('admin.status')}</FormLabel>
                  <Select
                    value={tourForm.status}
                    onChange={(e) => setTourForm({ ...tourForm, status: e.target.value })}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('admin.departureCity')}</FormLabel>
                  <Input
                    value={tourForm.departureCity}
                    onChange={(e) => setTourForm({ ...tourForm, departureCity: e.target.value })}
                    placeholder={t('admin.enterDepartureCity')}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{t('admin.imageUrl')}</FormLabel>
                  <Input
                    value={tourForm.image}
                    onChange={(e) => setTourForm({ ...tourForm, image: e.target.value })}
                    placeholder={t('admin.enterImageUrl')}
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('admin.maxGroupSize')}</FormLabel>
                  <NumberInput
                    value={tourForm.maxGroupSize}
                    onChange={(value) => setTourForm({ ...tourForm, maxGroupSize: parseInt(value) || 1 })}
                    min={1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('admin.minimumAge')}</FormLabel>
                  <NumberInput
                    value={tourForm.minAge}
                    onChange={(value) => setTourForm({ ...tourForm, minAge: parseInt(value) || 0 })}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              {/* Features */}
              <FormControl>
                <FormLabel>{t('admin.features')}</FormLabel>
                <HStack>
                  <Input
                    placeholder={t('admin.addFeature')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('features', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </HStack>
                <Box mt={2}>
                  {tourForm.features
                    .filter(feature => typeof feature === 'string')
                    .map((feature, index) => (
                      <Tag key={index} size="md" colorScheme="blue" mr={2} mb={2}>
                        <TagLabel>{feature}</TagLabel>
                        <TagCloseButton onClick={() => removeArrayItem('features', index)} />
                      </Tag>
                    ))}
                </Box>
              </FormControl>

              {/* Highlights */}
              <FormControl>
                <FormLabel>{t('admin.highlights')}</FormLabel>
                <HStack>
                  <Input
                    placeholder={t('admin.addHighlight')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('highlights', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </HStack>
                <Box mt={2}>
                  {tourForm.highlights
                    .filter(highlight => typeof highlight === 'string')
                    .map((highlight, index) => (
                      <Tag key={index} size="md" colorScheme="green" mr={2} mb={2}>
                        <TagLabel>{highlight}</TagLabel>
                        <TagCloseButton onClick={() => removeArrayItem('highlights', index)} />
                      </Tag>
                    ))}
                </Box>
              </FormControl>

              {/* Includes */}
              <FormControl>
                <FormLabel>{t('admin.whatsIncluded')}</FormLabel>
                <HStack>
                  <Input
                    placeholder={t('admin.addIncludedItem')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('includes', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </HStack>
                <Box mt={2}>
                  {tourForm.includes
                    .filter(item => typeof item === 'string')
                    .map((item, index) => (
                      <Tag key={index} size="md" colorScheme="teal" mr={2} mb={2}>
                        <TagLabel>{item}</TagLabel>
                        <TagCloseButton onClick={() => removeArrayItem('includes', index)} />
                      </Tag>
                    ))}
                </Box>
              </FormControl>

              {/* Excludes */}
              <FormControl>
                <FormLabel>{t('admin.whatsNotIncluded')}</FormLabel>
                <HStack>
                  <Input
                    placeholder={t('admin.addExcludedItem')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('excludes', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </HStack>
                <Box mt={2}>
                  {tourForm.excludes
                    .filter(item => typeof item === 'string')
                    .map((item, index) => (
                      <Tag key={index} size="md" colorScheme="red" mr={2} mb={2}>
                        <TagLabel>{item}</TagLabel>
                        <TagCloseButton onClick={() => removeArrayItem('excludes', index)} />
                      </Tag>
                    ))}
                </Box>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={isAddOpen ? onAddClose : onEditClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="blue" onClick={isAddOpen ? handleAddTour : handleEditTour}>
              {isAddOpen ? t('admin.addTour') : t('admin.updateTour')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Tour Confirmation */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('admin.deleteTour')}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t('admin.deleteTourConfirm', { tourName: deleteTour?.name })}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" onClick={handleDeleteTour} ml={3}>
                {t('common.delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Footer />
    </AdminOnly>
  );
} 