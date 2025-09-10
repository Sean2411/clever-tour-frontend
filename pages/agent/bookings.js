import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { AgentOrAdmin } from '../../components/ProtectedRoute';

export default function AgentBookings() {
  return (
    <AgentOrAdmin>
      <Head>
        <title>Manage Bookings - Clever Tour</title>
        <meta name="description" content="Manage bookings for agents" />
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading>Manage Bookings</Heading>
          
          <Box>
            <Text>Agent booking management interface will be implemented here.</Text>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </AgentOrAdmin>
  );
} 