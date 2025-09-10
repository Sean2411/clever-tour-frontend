import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useToast,
  Flex,
  Spinner,
  Select,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import PaymentForm from '../../../components/PaymentForm';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function BookingStatistics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [statistics, setStatistics] = useState(null);
  const [topAttractions, setTopAttractions] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/bookings/statistics?timeRange=${timeRange}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get statistics');
      }

      setStatistics(data.statistics);
      setTopAttractions(data.topAttractions);
    } catch (err) {
      console.error('Failed to get statistics:', err);
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

  const handleExport = async (type) => {
    try {
      const response = await fetch(`/api/admin/bookings/export?type=${type}&timeRange=${timeRange}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
              a.download = `booking_data_${type}_${new Date().toISOString().split('T')[0]}.${type === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export data:', err);
      toast({
        title: 'Error',
        description: 'Failed to export data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
        <title>Booking Statistics - Clever Tour</title>
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">Booking Statistics</Heading>
            <HStack>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                maxW="200px"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                                  <option value="year">Last Year</option>
              </Select>
              <Button
                leftIcon={<DownloadIcon />}
                onClick={() => handleExport('excel')}
              >
                                  Export Excel
              </Button>
              <Button
                leftIcon={<DownloadIcon />}
                onClick={() => handleExport('csv')}
              >
                                  Export CSV
              </Button>
            </HStack>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Stat>
                              <StatLabel>Total Bookings</StatLabel>
              <StatNumber>{statistics.totalBookings}</StatNumber>
              <StatHelpText>
                <StatArrow type={statistics.bookingGrowth >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(statistics.bookingGrowth)}%
              </StatHelpText>
            </Stat>
            <Stat>
                              <StatLabel>Total Revenue</StatLabel>
              <StatNumber>${statistics.totalRevenue}</StatNumber>
              <StatHelpText>
                <StatArrow type={statistics.revenueGrowth >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(statistics.revenueGrowth)}%
              </StatHelpText>
            </Stat>
            <Stat>
                              <StatLabel>Average Order Value</StatLabel>
              <StatNumber>${statistics.averageOrderValue}</StatNumber>
              <StatHelpText>
                <StatArrow type={statistics.aovGrowth >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(statistics.aovGrowth)}%
              </StatHelpText>
            </Stat>
            <Stat>
                              <StatLabel>Conversion Rate</StatLabel>
              <StatNumber>{statistics.conversionRate}%</StatNumber>
              <StatHelpText>
                <StatArrow type={statistics.conversionGrowth >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(statistics.conversionGrowth)}%
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          <Box>
            <Heading size="md" mb={4}>Popular Attractions</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                                      <Th>Attraction Name</Th>
                    <Th>Booking Count</Th>
                    <Th>Total Revenue</Th>
                    <Th>Average Rating</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topAttractions.map((attraction) => (
                  <Tr key={attraction.id}>
                    <Td>{attraction.name}</Td>
                    <Td>{attraction.bookingCount}</Td>
                    <Td>${attraction.revenue}</Td>
                    <Td>{attraction.averageRating}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <PaymentForm 
            booking={bookingData} 
            onPaymentSuccess={(data) => {
              // Handle payment success
            }} 
          />
        </VStack>
      </Container>
      <Footer />
    </>
  );
} 