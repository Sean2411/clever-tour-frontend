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
import { useTranslation } from 'react-i18next';
import { useTourTranslation } from '../../hooks/useTourTranslation';

export default function ToursList() {
  const { t, i18n } = useTranslation();
  const [tours, setTours] = useState([]);
  const [toursWithImages, setToursWithImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const toast = useToast();

  // 使用翻译hook
  const { translatedTours, loading: translationLoading } = useTourTranslation(tours);
  
  // 合并翻译后的数据和图片数据
  const [finalTours, setFinalTours] = useState([]);

  // 合并翻译后的数据和图片数据
  useEffect(() => {
    if (translatedTours.length > 0 && toursWithImages.length > 0) {
      const mergedTours = translatedTours.map(translatedTour => {
        const tourWithImage = toursWithImages.find(tour => tour.id === translatedTour.id);
        return {
          ...translatedTour,
          primaryImageUrl: tourWithImage?.primaryImageUrl || translatedTour.image
        };
      });
      setFinalTours(mergedTours);
    }
  }, [translatedTours, toursWithImages]);

  // Categories with translation
  const categories = [
    { value: '', label: t('tours.all') },
    { value: 'City Sightseeing', label: t('tours.citySightseeing') },
    { value: 'Natural Landscape', label: t('tours.naturalLandscape') },
    { value: 'Historical Culture', label: t('tours.historicalCulture') },
    { value: 'Theme Park', label: t('tours.themePark') },
    { value: 'Food Tour', label: t('tours.foodTour') },
    { value: 'Shopping Tour', label: t('tours.shoppingTour') }
  ];

  // Durations with translation
  const durations = [
    { value: '', label: t('tours.all') },
    { value: '1-3 Days', label: t('tours.duration1to3') },
    { value: '4-7 Days', label: t('tours.duration4to7') },
    { value: '8+ Days', label: t('tours.duration8plus') }
  ];

  // 获取tour的主图
  const getTourPrimaryImage = async (tourId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/upload/entity/tour/${tourId}`);
      const data = await response.json();
      
      if (data.success) {
        const uploadedImages = data.data.images.filter(img => typeof img === 'object' && img.fileName);
        const primaryImage = uploadedImages.find(img => img.isPrimary);
        // 如果有主图，返回主图；否则返回第一张上传的图片
        return primaryImage ? primaryImage.original.url : (uploadedImages.length > 0 ? uploadedImages[0].original.url : null);
      }
    } catch (error) {
      console.warn(`Failed to get images for tour ${tourId}:`, error);
    }
    return null;
  };

  const fetchTours = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(
        `${apiUrl}/api/tours?page=${page}&search=${searchTerm}&category=${category}&duration=${duration}&language=${i18n.language}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get tours list');
      }

      const toursData = data.tours || [];
      setTours(toursData);
      setTotalPages(data.totalPages || 1);
      setError(null);

      // 获取每个tour的主图
      const toursWithImagesData = await Promise.all(
        toursData.map(async (tour) => {
          const primaryImageUrl = await getTourPrimaryImage(tour.id);
          return {
            ...tour,
            primaryImageUrl: primaryImageUrl || tour.image // 如果没有主图，使用原有图片
          };
        })
      );
      
      setToursWithImages(toursWithImagesData);
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
        <title>{t('tours.title')} - Clever Tour</title>
        <meta name="description" content={t('tours.metaDescription')} />
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Stack spacing={8}>
          <Box>
            <Heading mb={4}>{t('tours.exploreTours')}</Heading>
            <Text color="gray.600">
              {t('tours.discoverExperiences')}
            </Text>
          </Box>

          <Box as="form" onSubmit={handleSearch}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Input
                placeholder={t('tours.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder={t('tours.selectCategory')}
                value={category}
                onChange={handleCategoryChange}
                width={{ base: '100%', md: '200px' }}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
              <Select
                placeholder={t('tours.selectDuration')}
                value={duration}
                onChange={handleDurationChange}
                width={{ base: '100%', md: '200px' }}
              >
                {durations.map((dur) => (
                  <option key={dur.value} value={dur.value}>
                    {dur.label}
                  </option>
                ))}
              </Select>
              <Button type="submit" colorScheme="blue">
                {t('common.search')}
              </Button>
            </Stack>
          </Box>

          {loading || translationLoading ? (
            renderSkeleton()
          ) : error ? (
            <Box textAlign="center" py={10}>
              <Text color="red.500">{error}</Text>
              <Button mt={4} onClick={() => fetchTours()}>
                {t('common.retry')}
              </Button>
            </Box>
          ) : finalTours.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text>{t('tours.noToursFound')}</Text>
            </Box>
          ) : (
            <>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {finalTours.map((tour) => (
                  <Box
                    key={tour.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => router.push(`/tours/detail/${tour.id}`)}
                    _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    <Image
                      src={tour.primaryImageUrl || tour.image}
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
                            {t('tours.price')}
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
                            {t('tours.rating')}
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
                      {t('common.previous')}
                    </Button>
                    <Text>
                      {t('common.page')} {page} {t('common.of')} {totalPages}
                    </Text>
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      isDisabled={page === totalPages}
                    >
                      {t('common.next')}
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