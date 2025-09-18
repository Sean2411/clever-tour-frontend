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
  Stack,
  Skeleton,
  SimpleGrid
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ToursList() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const toast = useToast();

  const categories = [
    'All',
    'City Sightseeing',
    'Natural Landscape',
    'Historical Culture',
    'Theme Park',
    'Food Tour',
    'Shopping Tour'
  ];

  const durations = [
    'All',
    '1-3 Days',
    '4-7 Days',
    '8+ Days'
  ];

  const fetchTours = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.clever-tour.com';
      const response = await fetch(
        `${apiUrl}/api/tours?page=${page}&search=${searchTerm}&category=${category}&duration=${duration}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get tours list');
      }

      setTours(data.tours || []);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Failed to get tours list:', err);
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
    fetchTours();
  }, [page, searchTerm, category, duration]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTours();
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderSkeleton = () => (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Box key={i} borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Skeleton height="200px" />
          <Box p={6}>
            <Skeleton height="20px" mb={4} />
            <Skeleton height="60px" mb={4} />
            <Skeleton height="20px" width="60%" />
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );

  return (
    <>
      <Head>
        <title>Tours List - Clever Tour</title>
        <meta name="description" content="Browse our curated selection of tours" />
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Stack spacing={8}>
          <Box>
            <Heading mb={4}>Explore Tours</Heading>
            <Text color="gray.600">
              Discover amazing travel experiences and unforgettable journeys
            </Text>
          </Box>

          <Box as="form" onSubmit={handleSearch}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Input
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="Select category"
                value={category}
                onChange={handleCategoryChange}
                width={{ base: '100%', md: '200px' }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === 'All' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Duration"
                value={duration}
                onChange={handleDurationChange}
                width={{ base: '100%', md: '200px' }}
              >
                {durations.map((dur) => (
                  <option key={dur} value={dur === 'All' ? '' : dur}>
                    {dur}
                  </option>
                ))}
              </Select>
              <Button type="submit" colorScheme="blue">
                Search
              </Button>
            </Stack>
          </Box>

          {loading ? (
            renderSkeleton()
          ) : error ? (
            <Box textAlign="center" py={10}>
              <Text color="red.500">{error}</Text>
              <Button mt={4} onClick={() => fetchTours()}>
                Retry
              </Button>
            </Box>
          ) : tours.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text>No tours found</Text>
            </Box>
          ) : (
            <>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {tours.map((tour) => (
                  <Box
                    key={tour.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => router.push(`/tours/${tour.id}`)}
                    _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      height="200px"
                      width="100%"
                      objectFit="cover"
                    />
                    <Box p={6}>
                      <Heading size="md" mb={2}>
                        {tour.name}
                      </Heading>
                      <Text color="gray.600" mb={4} noOfLines={2}>
                        {tour.description}
                      </Text>
                      <HStack spacing={2} mb={4}>
                        <Badge colorScheme="blue">{tour.category}</Badge>
                        <Badge colorScheme="green">{tour.duration}</Badge>
                      </HStack>
                      <Flex justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                          <Text color="gray.500" fontSize="sm">
                            Price
                          </Text>
                          <HStack>
                            <Text fontWeight="bold" color="blue.500">
                              ${tour.price}
                            </Text>
                            <Text color="gray.500" textDecoration="line-through">
                              ${tour.originalPrice}
                            </Text>
                          </HStack>
                        </VStack>
                        <VStack align="end" spacing={1}>
                          <Text color="gray.500" fontSize="sm">
                            Rating
                          </Text>
                          <HStack>
                            <StarIcon color="yellow.400" />
                            <Text fontWeight="bold">
                              {tour.rating} ({tour.reviewCount})
                            </Text>
                          </HStack>
                        </VStack>
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>

              {totalPages > 1 && (
                <Flex justify="center" mt={8}>
                  <HStack spacing={2}>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      isDisabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Text>
                      Page {page} of {totalPages}
                    </Text>
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      isDisabled={page === totalPages}
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