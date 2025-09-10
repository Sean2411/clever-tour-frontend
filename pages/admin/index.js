import { Box, Container, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { AdminOnly } from '../../components/ProtectedRoute';

export default function AdminDashboard() {
  return (
    <AdminOnly>
      <Head>
        <title>Admin Dashboard - Clever Tour</title>
        <meta name="description" content="Admin dashboard for Clever Tour" />
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading>Admin Dashboard</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>1,234</StatNumber>
              <StatHelpText>All registered users</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Total Bookings</StatLabel>
              <StatNumber>567</StatNumber>
              <StatHelpText>All time bookings</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Revenue</StatLabel>
              <StatNumber>$12,345</StatNumber>
              <StatHelpText>This month</StatHelpText>
            </Stat>
          </SimpleGrid>

          <Box>
            <Heading size="md" mb={4}>Quick Actions</Heading>
            <Text>Admin dashboard content will be implemented here.</Text>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </AdminOnly>
  );
} 