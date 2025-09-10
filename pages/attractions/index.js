import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Input,
  Select,
  Button,
  VStack,
  HStack,
  Image,
  Badge,
  useToast,
  Flex,
  Spinner,
  Stack,
  Skeleton,
  Divider
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SearchIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import mongoose from 'mongoose';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AttractionsList() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const toast = useToast();

  const categories = [
    'All',
    'Natural Landscape',
    'Historical Landmark',
    'Theme Park',
    'Museum',
    'Cultural Site',
    'Other'
  ];

  const fetchAttractions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/attractions?page=${page}&search=${searchTerm}&category=${category}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch attractions list');
      }

      const processedAttractions = data.attractions.map(attraction => ({
        ...attraction,
        attractionId: attraction.id
      }));

      setAttractions(processedAttractions || []);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch attractions list:', err);
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

  useEffect(() => {
    fetchAttractions();
  }, [page, searchTerm, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAttractions();
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderSkeleton = () => (
    <Grid 
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
      gap={{ base: 4, md: 6 }}
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Box key={i} borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Skeleton height={{ base: "150px", md: "200px" }} />
          <Box p={{ base: 4, md: 6 }}>
            <Skeleton height="20px" mb={4} />
            <Skeleton height="60px" mb={4} />
            <Skeleton height="20px" width="60%" />
          </Box>
        </Box>
      ))}
    </Grid>
  );

  return (
    <>
      <Head>
        <title>Attractions List - Clever Tour</title>
        <meta name="description" content="Browse our curated selection of tourist attractions" />
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 6, md: 8 }}>
          <Box>
            <Heading 
              size={{ base: "lg", md: "xl" }} 
              mb={{ base: 2, md: 4 }}
              textAlign={{ base: "center", md: "left" }}
            >
              Explore Attractions
            </Heading>
            <Text 
              color="gray.600"
              fontSize={{ base: "sm", md: "md" }}
              textAlign={{ base: "center", md: "left" }}
            >
              Discover amazing tourist destinations and exciting experiences
            </Text>
          </Box>

          <Box as="form" onSubmit={handleSearch}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 3, md: 4 }}>
              <Input
                placeholder="Search attractions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={{ base: "md", md: "lg" }}
                fontSize={{ base: "sm", md: "md" }}
              />
              <Select
                placeholder="Select category"
                value={category}
                onChange={handleCategoryChange}
                width={{ base: '100%', md: '200px' }}
                size={{ base: "md", md: "lg" }}
                fontSize={{ base: "sm", md: "md" }}
              >
                <option value="">All Categories</option>
                <option value="Natural Landscape">Natural Landscape</option>
                <option value="Historical Landmark">Historical Landmark</option>
                <option value="National Park">National Park</option>
              </Select>
              <Button 
                type="submit" 
                colorScheme="blue"
                size={{ base: "md", md: "lg" }}
                width={{ base: "100%", md: "auto" }}
              >
                Search
              </Button>
            </Stack>
          </Box>

          {loading ? (
            renderSkeleton()
          ) : error ? (
            <Box textAlign="center" py={10}>
              <Text color="red.500">{error}</Text>
              <Button mt={4} onClick={() => fetchAttractions()}>
                Retry
              </Button>
            </Box>
          ) : attractions.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text>No attractions found</Text>
            </Box>
          ) : (
            <>
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
                gap={{ base: 4, md: 6 }}
              >
                {attractions
                  .filter(attraction => mongoose.Types.ObjectId.isValid(attraction.attractionId))
                  .map((attraction) => (
                  <Box
                    key={attraction.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => router.push(`/attractions/${attraction.attractionId}`)}
                    _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    <Image
                      src={attraction.image}
                      alt={attraction.name}
                      height={{ base: "150px", md: "200px" }}
                      width="100%"
                      objectFit="cover"
                    />
                    <Box p={{ base: 4, md: 6 }}>
                      <Heading size={{ base: "sm", md: "md" }} mb={2}>
                        {attraction.name}
                      </Heading>
                      <Text 
                        color="gray.600" 
                        mb={4} 
                        noOfLines={{ base: 2, md: 3 }}
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {attraction.description}
                      </Text>
                      <HStack spacing={2} mb={4} flexWrap="wrap">
                        <Badge colorScheme="blue" fontSize={{ base: "xs", md: "sm" }}>
                          {attraction.category}
                        </Badge>
                        <Badge colorScheme="green" fontSize={{ base: "xs", md: "sm" }}>
                          {attraction.duration}
                        </Badge>
                      </HStack>
                      <Flex justify="space-between" align="center" mb={4}>
                        <VStack align="start" spacing={1}>
                          <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                            Price
                          </Text>
                          <Text fontWeight="bold" color="blue.500" fontSize={{ base: "sm", md: "md" }}>
                            ${attraction.price}
                          </Text>
                        </VStack>
                        <VStack align="end" spacing={1}>
                          <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                            Rating
                          </Text>
                          <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                            {attraction.rating} / 5
                          </Text>
                        </VStack>
                      </Flex>
                      <Button 
                        colorScheme="blue"
                        size={{ base: "sm", md: "md" }}
                        width="100%"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/attractions/${attraction.attractionId}`);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Flex justify="center" mt={{ base: 6, md: 8 }}>
                  <HStack spacing={{ base: 2, md: 4 }}>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      isDisabled={page === 1}
                      size={{ base: "sm", md: "md" }}
                    >
                      Previous
                    </Button>
                    <Text 
                      fontSize={{ base: "sm", md: "md" }}
                      px={{ base: 2, md: 4 }}
                    >
                      Page {page} of {totalPages}
                    </Text>
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      isDisabled={page === totalPages}
                      size={{ base: "sm", md: "md" }}
                    >
                      Next
                    </Button>
                  </HStack>
                </Flex>
              )}
            </>
          )}
        </Stack>
      </Container>
      <Footer />
    </>
  );
} 