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
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { AdminOnly } from '../../components/ProtectedRoute';
import AdminCard from '../../components/AdminCard';
import ResponsiveGrid from '../../components/ResponsiveGrid';

export default function ManageAttractions() {
  const [attractions, setAttractions] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAttraction, setEditingAttraction] = useState(null);
  const [deleteAttraction, setDeleteAttraction] = useState(null);
  
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const toast = useToast();

  // Form state for adding/editing attraction
  const [attractionForm, setAttractionForm] = useState({
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
    location: '',
    category: '',
    tags: [],
    status: 'active'
  });

  const categories = [
    'Natural Landscape',
    'Historical Landmark',
    'Theme Park',
    'Museum',
    'Cultural Site',
    'National Park',
    'Other'
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Under Maintenance' }
  ];

  useEffect(() => {
    fetchAttractions();
  }, []);

  useEffect(() => {
    // Filter attractions based on search term
    const filtered = attractions.filter(attraction =>
      attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAttractions(filtered);
  }, [attractions, searchTerm]);

  const fetchAttractions = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: 'Authentication Error',
          description: 'Please login to access this page',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/admin/attractions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAttractions(data.attractions);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        
        if (response.status === 401) {
          toast({
            title: 'Authentication Error',
            description: 'Please login again',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } else if (response.status === 403) {
          toast({
            title: 'Access Denied',
            description: 'Admin access required',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Error',
            description: errorData.message || 'Failed to fetch attractions',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching attractions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch attractions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttraction = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/admin/attractions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(attractionForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Attraction created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onAddClose();
        resetForm();
        fetchAttractions();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to create attraction',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating attraction:', error);
      toast({
        title: 'Error',
        description: 'Failed to create attraction',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditAttraction = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/admin/attractions/${editingAttraction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(attractionForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Attraction updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onEditClose();
        resetForm();
        fetchAttractions();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to update attraction',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating attraction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update attraction',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAttraction = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://smart-tourist-backend-alb-149914387.us-east-1.elb.amazonaws.com';
      const response = await fetch(`${apiUrl}/api/admin/attractions/${deleteAttraction.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Attraction deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onDeleteClose();
        setDeleteAttraction(null);
        fetchAttractions();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete attraction',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting attraction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete attraction',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setAttractionForm({
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
      location: '',
      category: '',
      tags: [],
      status: 'active'
    });
  };

  const handleEdit = (attraction) => {
    setEditingAttraction(attraction);
    setAttractionForm({
      name: attraction.name,
      description: attraction.description,
      duration: attraction.duration,
      price: attraction.price,
      originalPrice: attraction.originalPrice,
      rating: attraction.rating,
      reviewCount: attraction.reviewCount,
      image: attraction.image,
      images: attraction.images || [],
      features: attraction.features || [],
      location: attraction.location,
      category: attraction.category,
      tags: attraction.tags || [],
      status: attraction.status
    });
    onEditOpen();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'maintenance':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  // Define fields for AdminCard
  const attractionFields = [
    { key: 'image', label: 'Image', type: 'image' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'badge', colorScheme: 'blue' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'price', label: 'Price', type: 'price' },
    { key: 'rating', label: 'Rating', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
  ];

  const addArrayItem = (field, value) => {
    if (value.trim()) {
      setAttractionForm(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setAttractionForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <Head>
        <title>Manage Attractions - Clever Tour</title>
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          <VStack spacing={4} align="stretch">
            <Heading 
              size={{ base: "lg", md: "xl" }}
              textAlign={{ base: "center", md: "left" }}
            >
              Manage Attractions
            </Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={onAddOpen}
              size={{ base: "md", md: "lg" }}
              width={{ base: "100%", md: "auto" }}
            >
              Add Attraction
            </Button>
          </VStack>

          <Box>
            <HStack spacing={{ base: 2, md: 4 }}>
              <Input
                placeholder="Search attractions by name, category, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={{ base: "md", md: "lg" }}
                fontSize={{ base: "sm", md: "md" }}
              />
              <SearchIcon color="gray.400" />
            </HStack>
          </Box>

          <Box>
            <ResponsiveGrid columns={{ base: 1, md: 1 }} spacing={{ base: 4, md: 6 }}>
              {filteredAttractions.map((attraction) => (
                <AdminCard
                  key={attraction.id}
                  item={{
                    ...attraction,
                    rating: `${attraction.rating} (${attraction.reviewCount} reviews)`
                  }}
                  fields={attractionFields}
                  onEdit={handleEdit}
                  onDelete={(attraction) => {
                    setDeleteAttraction(attraction);
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
            Total attractions: {filteredAttractions.length}
          </Text>
        </VStack>
      </Container>

      {/* Add Attraction Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Attraction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <SimpleGrid columns={2} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={attractionForm.name}
                    onChange={(e) => setAttractionForm({...attractionForm, name: e.target.value})}
                    placeholder="Attraction name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={attractionForm.category}
                    onChange={(e) => setAttractionForm({...attractionForm, category: e.target.value})}
                    placeholder="Select category"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={attractionForm.description}
                  onChange={(e) => setAttractionForm({...attractionForm, description: e.target.value})}
                  placeholder="Attraction description"
                  rows={3}
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={attractionForm.location}
                    onChange={(e) => setAttractionForm({...attractionForm, location: e.target.value})}
                    placeholder="Location"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Duration</FormLabel>
                  <Input
                    value={attractionForm.duration}
                    onChange={(e) => setAttractionForm({...attractionForm, duration: e.target.value})}
                    placeholder="e.g., 2-3 hours"
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={3} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <NumberInput
                    value={attractionForm.price}
                    onChange={(value) => setAttractionForm({...attractionForm, price: parseFloat(value)})}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Original Price</FormLabel>
                  <NumberInput
                    value={attractionForm.originalPrice}
                    onChange={(value) => setAttractionForm({...attractionForm, originalPrice: parseFloat(value)})}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Rating</FormLabel>
                  <NumberInput
                    value={attractionForm.rating}
                    onChange={(value) => setAttractionForm({...attractionForm, rating: parseFloat(value)})}
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
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={attractionForm.image}
                  onChange={(e) => setAttractionForm({...attractionForm, image: e.target.value})}
                  placeholder="Image URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Features</FormLabel>
                <VStack spacing={2} align="stretch">
                  <HStack>
                    <Input
                      placeholder="Add feature"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('features', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        addArrayItem('features', input.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </Button>
                  </HStack>
                  <Box>
                    {attractionForm.features.map((feature, index) => (
                      <Tag key={index} size="md" m={1}>
                        <TagLabel>{feature}</TagLabel>
                        <TagCloseButton onClick={() => removeArrayItem('features', index)} />
                      </Tag>
                    ))}
                  </Box>
                </VStack>
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={attractionForm.status}
                  onChange={(e) => setAttractionForm({...attractionForm, status: e.target.value})}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddAttraction}>
              Add Attraction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Attraction Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Attraction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <SimpleGrid columns={2} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={attractionForm.name}
                    onChange={(e) => setAttractionForm({...attractionForm, name: e.target.value})}
                    placeholder="Attraction name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={attractionForm.category}
                    onChange={(e) => setAttractionForm({...attractionForm, category: e.target.value})}
                    placeholder="Select category"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={attractionForm.description}
                  onChange={(e) => setAttractionForm({...attractionForm, description: e.target.value})}
                  placeholder="Attraction description"
                  rows={3}
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={attractionForm.location}
                    onChange={(e) => setAttractionForm({...attractionForm, location: e.target.value})}
                    placeholder="Location"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Duration</FormLabel>
                  <Input
                    value={attractionForm.duration}
                    onChange={(e) => setAttractionForm({...attractionForm, duration: e.target.value})}
                    placeholder="e.g., 2-3 hours"
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={3} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <NumberInput
                    value={attractionForm.price}
                    onChange={(value) => setAttractionForm({...attractionForm, price: parseFloat(value)})}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Original Price</FormLabel>
                  <NumberInput
                    value={attractionForm.originalPrice}
                    onChange={(value) => setAttractionForm({...attractionForm, originalPrice: parseFloat(value)})}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Rating</FormLabel>
                  <NumberInput
                    value={attractionForm.rating}
                    onChange={(value) => setAttractionForm({...attractionForm, rating: parseFloat(value)})}
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
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={attractionForm.image}
                  onChange={(e) => setAttractionForm({...attractionForm, image: e.target.value})}
                  placeholder="Image URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Features</FormLabel>
                <VStack spacing={2} align="stretch">
                  <HStack>
                    <Input
                      placeholder="Add feature"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('features', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        addArrayItem('features', input.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </Button>
                  </HStack>
                  <Box>
                    {attractionForm.features.map((feature, index) => (
                      <Tag key={index} size="md" m={1}>
                        <TagLabel>{feature}</TagLabel>
                        <TagCloseButton onClick={() => removeArrayItem('features', index)} />
                      </Tag>
                    ))}
                  </Box>
                </VStack>
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={attractionForm.status}
                  onChange={(e) => setAttractionForm({...attractionForm, status: e.target.value})}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleEditAttraction}>
              Update Attraction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={undefined}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Attraction
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone. This will permanently delete the
              attraction &quot;{deleteAttraction?.name}&quot;.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAttraction} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Footer />
    </>
  );
} 