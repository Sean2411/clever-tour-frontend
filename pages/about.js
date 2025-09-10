import Head from 'next/head';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Image,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaMapMarkedAlt, FaUsers, FaShieldAlt, FaHeart } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    icon: FaMapMarkedAlt,
    title: 'Expert Travel Planning',
    description: 'Our experienced team helps you plan the perfect trip with personalized recommendations and insider knowledge.',
  },
  {
    icon: FaUsers,
    title: 'Dedicated Support',
    description: '24/7 customer support to ensure your travel experience is smooth and enjoyable from start to finish.',
  },
  {
    icon: FaShieldAlt,
    title: 'Safe & Secure',
    description: 'Your safety and security are our top priorities with verified partners and comprehensive travel insurance.',
  },
  {
    icon: FaHeart,
    title: 'Passionate Service',
    description: 'We are passionate about travel and committed to making your journey memorable and extraordinary.',
  },
];

const team = [
  {
    name: 'Lee Li',
    role: 'Founder & CEO',
    image: '',
    description: 'Travel enthusiast with 10+ years of experience in the tourism industry.',
  },
  {
    name: 'Lee Li',
    role: 'Head of Operations',
    image: '',
    description: 'Expert in logistics and customer experience optimization.',
  },
  {
    name: 'Lee Li',
    role: 'Customer Success Manager',
    image: '',
    description: 'Dedicated to ensuring every customer has an exceptional travel experience.',
  },
];

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Clever Tour</title>
        <meta name="description" content="Learn about Clever Tour and our mission to provide exceptional travel experiences" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      {/* Hero Section */}
      <Box 
        bgImage="url('https://images.unsplash.com/photo-1488646953014-85cb44e25828')"
        bgSize="cover"
        bgPosition="center"
        height="400px"
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
              align="center"
              spacing={6}
              color="white"
              textAlign="center"
            >
              <Heading size="2xl">About Clever Tour</Heading>
              <Text fontSize="xl" maxW="2xl">
                We are passionate about creating unforgettable travel experiences and connecting people with the world's most amazing destinations.
              </Text>
            </VStack>
          </Container>
        </Box>
      </Box>

      {/* Mission Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading mb={6}>Our Mission</Heading>
            <Text fontSize="lg" color="gray.600" maxW="3xl">
              At Clever Tour, we believe that travel has the power to transform lives. 
              Our mission is to make extraordinary travel experiences accessible to everyone, 
              providing personalized service, competitive prices, and unforgettable adventures 
              that create lasting memories.
            </Text>
          </Box>

          {/* Features */}
          <Box w="100%">
            <Heading mb={8} textAlign="center">Why Choose Us</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {features.map((feature, index) => (
                <VStack key={index} spacing={4} textAlign="center">
                  <Box
                    w="60px"
                    h="60px"
                    borderRadius="full"
                    bg="blue.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                  >
                    <Icon as={feature.icon} w={6} h={6} />
                  </Box>
                  <Heading size="md">{feature.title}</Heading>
                  <Text color="gray.600">{feature.description}</Text>
                </VStack>
              ))}
            </SimpleGrid>
          </Box>

          {/* Team Section */}
          <Box w="100%">
            <Heading mb={8} textAlign="center">Our Team</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {team.map((member, index) => (
                <Box
                  key={index}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  textAlign="center"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    height="250px"
                    width="100%"
                    objectFit="cover"
                  />
                  <Box p={6}>
                    <Heading size="md" mb={2}>{member.name}</Heading>
                    <Text color="blue.500" fontWeight="bold" mb={4}>{member.role}</Text>
                    <Text color="gray.600">{member.description}</Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Values Section */}
          <Box w="100%" bg="gray.50" p={8} borderRadius="lg">
            <VStack spacing={8}>
              <Heading textAlign="center">Our Values</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="100%">
                <Box>
                  <Heading size="md" mb={4} color="blue.500">Excellence</Heading>
                  <Text color="gray.600">
                    We strive for excellence in everything we do, from customer service to 
                    the quality of our travel experiences.
                  </Text>
                </Box>
                <Box>
                  <Heading size="md" mb={4} color="blue.500">Integrity</Heading>
                  <Text color="gray.600">
                    We conduct our business with honesty, transparency, and ethical practices 
                    that build trust with our customers.
                  </Text>
                </Box>
                <Box>
                  <Heading size="md" mb={4} color="blue.500">Innovation</Heading>
                  <Text color="gray.600">
                    We continuously innovate to provide cutting-edge travel solutions and 
                    enhance the customer experience.
                  </Text>
                </Box>
                <Box>
                  <Heading size="md" mb={4} color="blue.500">Sustainability</Heading>
                  <Text color="gray.600">
                    We are committed to sustainable tourism practices that protect the 
                    environment and support local communities.
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>
      </Container>

      <Footer />
    </>
  );
} 