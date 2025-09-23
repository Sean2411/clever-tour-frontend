import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Spinner,
  Flex,
  HStack,
  Icon,
  Badge,
  useColorModeValue,
  Image,
  SimpleGrid,
  AspectRatio,
  Divider,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { 
  FaPlane, 
  FaMapMarkerAlt, 
  FaStar, 
  FaHeart, 
  FaGlobeAmericas,
  FaCamera,
  FaUsers,
  FaClock,
  FaShieldAlt,
  FaHeadset
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResponsiveCard from '../components/ResponsiveCard';
import ResponsiveGrid from '../components/ResponsiveGrid';

// 动画定义
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Features will be defined inside the component to use translation


export default function Home() {
  const { t } = useTranslation();
  const [tours, setTours] = useState([]);
  const [toursWithImages, setToursWithImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Features with translation - using useMemo to ensure translation is ready
  const features = useMemo(() => [
    {
      id: 1,
      title: t('features.bestPrices'),
      description: t('features.bestPricesDesc'),
      icon: FaShieldAlt,
      color: 'green',
    },
    {
      id: 2,
      title: t('features.quickBooking'),
      description: t('features.quickBookingDesc'),
      icon: FaClock,
      color: 'blue',
    },
    {
      id: 3,
      title: t('features.securePayment'),
      description: t('features.securePaymentDesc'),
      icon: FaShieldAlt,
      color: 'purple',
    },
    {
      id: 4,
      title: t('features.customerSupport'),
      description: t('features.customerSupportDesc'),
      icon: FaHeadset,
      color: 'orange',
    },
  ], [t]);

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

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/tours?limit=6`);
        const data = await response.json();
        
        if (response.ok) {
          const toursData = data.tours || [];
          setTours(toursData);

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
        }
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <>
      <Head>
        <title>Clever Tour - Attraction Tickets and Travel Services</title>
        <meta name="description" content="Providing the best prices for attraction tickets and travel services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="main">
        <Navbar />
        
        {/* Hero Section */}
        <Box 
          position="relative"
          height={{ base: '500px', md: '600px', lg: '700px' }}
          overflow="hidden"
        >
          {/* Animated Background */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bgGradient="linear(135deg, blue.400 0%, purple.500 25%, pink.500 50%, orange.400 75%, red.400 100%)"
            opacity="0.8"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgImage="url('https://images.unsplash.com/photo-1548013146-72479768bada')"
              bgSize="cover"
              bgPosition="center"
              opacity="0.3"
            />
          </Box>

          {/* Floating Elements */}
          <Box
            position="absolute"
            top="10%"
            left="10%"
            animation={`${float} 6s ease-in-out infinite`}
          >
            <Icon as={FaPlane} boxSize={8} color="white" opacity="0.7" />
          </Box>
          <Box
            position="absolute"
            top="20%"
            right="15%"
            animation={`${float} 8s ease-in-out infinite reverse`}
          >
            <Icon as={FaMapMarkerAlt} boxSize={6} color="white" opacity="0.7" />
          </Box>
          <Box
            position="absolute"
            bottom="20%"
            left="20%"
            animation={`${float} 7s ease-in-out infinite`}
          >
            <Icon as={FaStar} boxSize={5} color="white" opacity="0.7" />
          </Box>

          <Container maxW="container.xl" height="100%" position="relative" zIndex="2">
            <VStack
              height="100%"
              justify="center"
              align={{ base: 'center', md: 'flex-start' }}
              spacing={{ base: 6, md: 8 }}
              color="white"
              textAlign={{ base: 'center', md: 'left' }}
              px={{ base: 4, md: 0 }}
            >
              <VStack spacing={4} align={{ base: 'center', md: 'flex-start' }}>
                <Badge
                  colorScheme="whiteAlpha"
                  variant="subtle"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                  animation={`${fadeIn} 1s ease-out`}
                >
                  ✨ {t('home.subtitle')}
                </Badge>
                
                <Heading 
                  size={{ base: 'xl', md: '2xl', lg: '4xl' }}
                  lineHeight="1.1"
                  fontWeight="bold"
                  animation={`${slideIn} 1s ease-out 0.2s both`}
                >
                  {t('home.title')}{' '}
                  <Text as="span" bgGradient="linear(to-r, yellow.300, orange.400)" bgClip="text">
                    Clever Tour
                  </Text>
                </Heading>
                
                <Text 
                  fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
                  maxW={{ base: '100%', md: '700px' }}
                  opacity="0.9"
                  animation={`${fadeIn} 1s ease-out 0.4s both`}
                >
                  {t('home.bestTravelExperience')}
                </Text>
              </VStack>

              <HStack spacing={4} animation={`${fadeIn} 1s ease-out 0.6s both`}>
                <Link href="/tours" passHref>
                  <Button 
                    size={{ base: 'md', md: 'lg' }} 
                    colorScheme="blue"
                    px={{ base: 8, md: 10 }}
                    py={{ base: 6, md: 8 }}
                    fontSize={{ base: 'md', md: 'lg' }}
                    borderRadius="full"
                    _hover={{ 
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl'
                    }}
                    transition="all 0.3s ease"
                    leftIcon={<Icon as={FaPlane} />}
                  >
                    {t('home.exploreTours')}
                  </Button>
                </Link>
                <Link href="/attractions" passHref>
                  <Button 
                    size={{ base: 'md', md: 'lg' }} 
                    variant="outline"
                    colorScheme="whiteAlpha"
                    px={{ base: 8, md: 10 }}
                    py={{ base: 6, md: 8 }}
                    fontSize={{ base: 'md', md: 'lg' }}
                    borderRadius="full"
                    _hover={{ 
                      bg: 'whiteAlpha.200',
                      transform: 'translateY(-2px)'
                    }}
                    transition="all 0.3s ease"
                    leftIcon={<Icon as={FaMapMarkerAlt} />}
                  >
                    {t('home.viewAttractions')}
                  </Button>
                </Link>
              </HStack>
            </VStack>
          </Container>
        </Box>


        {/* Popular Destinations */}
        <Container maxW="container.xl" py={{ base: 16, md: 20 }}>
          <VStack spacing={{ base: 8, md: 12 }}>
            <VStack spacing={4} textAlign="center">
              <Badge
                colorScheme="blue"
                variant="subtle"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
              >
                🌟 Featured Tours
              </Badge>
              <Heading 
                size={{ base: 'lg', md: 'xl', lg: '2xl' }}
                bgGradient="linear(to-r, blue.600, purple.600)"
                bgClip="text"
              >
                {t('home.popularDestinations')}
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" maxW="600px">
                {t('home.bestTravelExperience')}
              </Text>
            </VStack>
            {loading ? (
              <Flex justify="center" py={8}>
                <Spinner size="xl" />
              </Flex>
            ) : (
              <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }}>
                {toursWithImages.map((tour) => (
                  <ResponsiveCard
                    key={tour.id}
                    title={tour.name}
                    description={tour.description}
                    image={tour.primaryImageUrl || tour.image}
                    price={tour.price}
                    href={`/tours/detail/${tour.id}`}
                  >
                    <Button 
                      colorScheme="blue" 
                      size={{ base: 'sm', md: 'md' }}
                      width="100%"
                    >
                      View Details
                    </Button>
                  </ResponsiveCard>
                ))}
              </ResponsiveGrid>
            )}
          </VStack>
        </Container>

        {/* Why Choose Us - Hidden on mobile */}
        <Box 
          bgGradient="linear(135deg, blue.50 0%, purple.50 50%, pink.50 100%)"
          py={{ base: 16, md: 20 }}
          position="relative"
          overflow="hidden"
          display={{ base: 'none', md: 'block' }}
        >
          {/* Background Pattern */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            opacity="0.1"
            bgImage="url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          />
          
          <Container maxW="container.xl" position="relative" zIndex="2">
            <VStack spacing={{ base: 12, md: 16 }}>
              <VStack spacing={4} textAlign="center">
                <Badge
                  colorScheme="purple"
                  variant="subtle"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                >
                  ✨ {t('home.whyChooseUs')}
                </Badge>
                <Heading 
                  size={{ base: 'lg', md: 'xl', lg: '2xl' }}
                  bgGradient="linear(to-r, blue.600, purple.600)"
                  bgClip="text"
                >
                  {t('home.experienceDifference')}
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" maxW="600px">
                  {t('home.bestTravelExperience')}
                </Text>
              </VStack>
              
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
                {features.map((feature, index) => (
                  <Box
                    key={feature.id}
                    p={6}
                    bg="white"
                    borderRadius="xl"
                    boxShadow="lg"
                    textAlign="center"
                    _hover={{
                      transform: 'translateY(-5px)',
                      boxShadow: 'xl'
                    }}
                    transition="all 0.3s ease"
                    animation={`${fadeIn} 1s ease-out ${index * 0.1}s both`}
                  >
                    <VStack spacing={4}>
                      <Box
                        w={{ base: '60px', md: '70px' }}
                        h={{ base: '60px', md: '70px' }}
                        borderRadius="full"
                        bgGradient={`linear(135deg, ${feature.color}.400, ${feature.color}.600)`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                        animation={`${pulse} 3s ease-in-out infinite`}
                        animationDelay={`${index * 0.5}s`}
                      >
                        <Icon as={feature.icon} boxSize={{ base: 6, md: 7 }} />
                      </Box>
                      <VStack spacing={2}>
                        <Heading size={{ base: 'sm', md: 'md' }} color="gray.800">
                          {feature.title}
                        </Heading>
                        <Text 
                          fontSize={{ base: 'sm', md: 'md' }}
                          color="gray.600"
                          lineHeight="1.6"
                        >
                          {feature.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        <Footer />
      </Box>
    </>
  );
} 