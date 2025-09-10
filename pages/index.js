import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResponsiveCard from '../components/ResponsiveCard';
import ResponsiveGrid from '../components/ResponsiveGrid';

const features = [
  {
    id: 1,
    title: 'Best Prices',
    description: 'We offer the most competitive ticket prices',
    icon: '💰',
  },
  {
    id: 2,
    title: 'Quick Booking',
    description: 'Simple and fast booking process',
    icon: '⚡',
  },
  {
    id: 3,
    title: 'Secure Payment',
    description: 'Safe and reliable payment system',
    icon: '🔒',
  },
  {
    id: 4,
    title: '24/7 Support',
    description: 'Round-the-clock customer service support',
    icon: '📞',
  },
];

export default function Home() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/tours?limit=3');
        const data = await response.json();
        
        if (response.ok) {
          setTours(data.tours || []);
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
          bgImage="url('https://images.unsplash.com/photo-1548013146-72479768bada')"
          bgSize="cover"
          bgPosition="center"
          height={{ base: '400px', md: '500px', lg: '600px' }}
          position="relative"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.600"
          >
            <Container maxW="container.xl" height="100%">
              <VStack
                height="100%"
                justify="center"
                align={{ base: 'center', md: 'flex-start' }}
                spacing={{ base: 4, md: 6 }}
                color="white"
                textAlign={{ base: 'center', md: 'left' }}
                px={{ base: 4, md: 0 }}
              >
                <Heading 
                  size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                  lineHeight="1.2"
                >
                  Discover the Best Attraction Tickets
                </Heading>
                <Text 
                  fontSize={{ base: 'lg', md: 'xl' }}
                  maxW={{ base: '100%', md: '600px' }}
                >
                  We provide the best prices and excellent service for you
                </Text>
                <Link href="/attractions" passHref>
                  <Button 
                    size={{ base: 'md', md: 'lg' }} 
                    colorScheme="blue"
                    px={{ base: 6, md: 8 }}
                  >
                    Book Now
                  </Button>
                </Link>
              </VStack>
            </Container>
          </Box>
        </Box>

        {/* Popular Destinations */}
        <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
          <VStack spacing={{ base: 8, md: 12 }}>
            <Heading 
              size={{ base: 'lg', md: 'xl', lg: '2xl' }}
              textAlign="center"
            >
              Popular Destinations
            </Heading>
            {loading ? (
              <Flex justify="center" py={8}>
                <Spinner size="xl" />
              </Flex>
            ) : (
              <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }}>
                {tours.map((tour) => (
                  <ResponsiveCard
                    key={tour.id}
                    title={tour.name}
                    description={tour.description}
                    image={tour.image}
                    price={tour.price}
                    href={`/tours/${tour.id}`}
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

        {/* Why Choose Us */}
        <Box bg="gray.50" py={{ base: 8, md: 16 }}>
          <Container maxW="container.xl">
            <VStack spacing={{ base: 8, md: 12 }}>
              <Heading 
                size={{ base: 'lg', md: 'xl', lg: '2xl' }}
                textAlign="center"
              >
                Why Choose Us
              </Heading>
              <ResponsiveGrid columns={{ base: 1, sm: 2, md: 4 }}>
                {features.map((feature) => (
                  <VStack key={feature.id} spacing={4} textAlign="center">
                    <Box
                      w={{ base: '50px', md: '60px' }}
                      h={{ base: '50px', md: '60px' }}
                      borderRadius="full"
                      bg="blue.500"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontSize={{ base: 'lg', md: 'xl' }}
                    >
                      {feature.icon}
                    </Box>
                    <Heading size={{ base: 'sm', md: 'md' }}>{feature.title}</Heading>
                    <Text 
                      textAlign="center" 
                      fontSize={{ base: 'sm', md: 'md' }}
                      color="gray.600"
                    >
                      {feature.description}
                    </Text>
                  </VStack>
                ))}
              </ResponsiveGrid>
            </VStack>
          </Container>
        </Box>

        <Footer />
      </Box>
    </>
  );
} 