import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Badge,
  Button,
  HStack,
  Input,
  Select,
  useToast,
  Flex,
  Spinner,
  Text,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton
} from '@chakra-ui/react';
import { SearchIcon, DownloadIcon } from '@chakra-ui/icons';
import * as XLSX from 'xlsx';
import Head from 'next/head';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import AdminCard from '../../../components/AdminCard';
import ResponsiveGrid from '../../../components/ResponsiveGrid';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const toast = useToast();
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(
        `${apiUrl}/api/admin/bookings?search=${searchTerm}&status=${statusFilter}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get booking list');
      }

      setBookings(data);
    } catch (err) {
      console.error('Failed to get booking list:', err);
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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking status');
      }

      toast({
        title: 'Success',
        description: 'Booking status updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchBookings();
    } catch (err) {
      console.error('Failed to update booking status:', err);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };



  const getStatusColor = (status) => {
    const colors = {
      pending: 'yellow',
      confirmed: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
    };
    return texts[status] || status;
  };

  const getStatusDisplayText = (status) => {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirm',
      cancelled: 'Cancel',
    };
    return texts[status] || status;
  };

  // Define fields for AdminCard - responsive layout
  const bookingFields = [
    { key: 'bookingNumber', label: 'Booking Number', type: 'text', flex: 1.2 },
    { key: 'attractionName', label: 'Attraction', type: 'text', flex: 1.5 },
    { key: 'customer', label: 'Customer', type: 'text', flex: 1.2 },
    { key: 'date', label: 'Date', type: 'text', flex: 1 },
    { key: 'people', label: 'People', type: 'text', flex: 1 },
    { key: 'totalPrice', label: 'Total Price', type: 'price', flex: 0.8 },
    { key: 'status', label: 'Status', type: 'status', flex: 0.8 },
  ];

  const exportToCSV = (data) => {
    const headers = [
      'Order Number',
      'Attraction/Tour Name',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Booking Date',
      'Booking Time',
      'Visit Date',
      'Adults',
      'Children',
      'Rooms',
      'Total Price',
      'Status',
      'Payment Method',
      'Payment Status',
      'Special Requests',
      'Created At'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(booking => [
        booking.orderNumber || booking.bookingNumber,
        booking.attraction?.name || booking.attractionId?.name || booking.tourId?.name || 'Unknown',
        (booking.customer && typeof booking.customer === 'object') ? booking.customer.name : (booking.customer || booking.name || 'Unknown'),
        (booking.customer && typeof booking.customer === 'object') ? booking.customer.email : (booking.email || 'Unknown'),
        (booking.customer && typeof booking.customer === 'object') ? booking.customer.phone : (booking.phone || 'Unknown'),
        booking.bookingDate || new Date(booking.date || booking.createdAt).toLocaleDateString(),
        booking.bookingTime || booking.time || 'N/A',
        booking.visitDate ? new Date(booking.visitDate).toLocaleDateString() : 'TBD',
        booking.numberOfAdults || booking.adults || 0,
        booking.numberOfChildren || booking.children || 0,
        booking.rooms || 1,
        booking.totalPrice,
        booking.status,
        booking.paymentMethod || 'N/A',
        booking.paymentStatus || 'N/A',
        booking.specialRequests || booking.notes || '',
        new Date(booking.createdAt).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(booking => ({
      'Order Number': booking.orderNumber || booking.bookingNumber,
      'Attraction/Tour Name': booking.attraction?.name || booking.attractionId?.name || booking.tourId?.name || 'Unknown',
      'Customer Name': (booking.customer && typeof booking.customer === 'object') ? booking.customer.name : (booking.customer || booking.name || 'Unknown'),
      'Customer Email': (booking.customer && typeof booking.customer === 'object') ? booking.customer.email : (booking.email || 'Unknown'),
      'Customer Phone': (booking.customer && typeof booking.customer === 'object') ? booking.customer.phone : (booking.phone || 'Unknown'),
      'Booking Date': booking.bookingDate || new Date(booking.date || booking.createdAt).toLocaleDateString(),
      'Booking Time': booking.bookingTime || booking.time || 'N/A',
      'Visit Date': booking.visitDate ? new Date(booking.visitDate).toLocaleDateString() : 'TBD',
      'Adults': booking.numberOfAdults || booking.adults || 0,
      'Children': booking.numberOfChildren || booking.children || 0,
      'Rooms': booking.rooms || 1,
      'Total Price': booking.totalPrice,
      'Status': booking.status,
      'Payment Method': booking.paymentMethod || 'N/A',
      'Payment Status': booking.paymentStatus || 'N/A',
      'Special Requests': booking.specialRequests || booking.notes || '',
      'Created At': new Date(booking.createdAt).toLocaleString()
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
    
    XLSX.writeFile(workbook, `bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      
      // 获取所有预订数据（不应用搜索和过滤）
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/admin/bookings`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get booking data for export');
      }

      if (format === 'csv') {
        exportToCSV(data);
      } else if (format === 'excel') {
        exportToExcel(data);
      }

      toast({
        title: 'Success',
        description: `Bookings exported to ${format.toUpperCase()} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Failed to export bookings:', err);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Booking Management - Smart Tourist</title>
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          <VStack spacing={4} align="stretch">
            <Heading 
              size={{ base: "lg", md: "xl" }}
              textAlign={{ base: "center", md: "left" }}
            >
              Booking Management
            </Heading>
          </VStack>

          <VStack spacing={4} align="stretch">
            <HStack spacing={{ base: 2, md: 4 }} justify="space-between" flexWrap="wrap">
              <VStack spacing={3} align="stretch" flex={1} minW={{ base: "100%", md: "auto" }}>
                <Input
                  placeholder="Search booking number, name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size={{ base: "md", md: "lg" }}
                  fontSize={{ base: "sm", md: "md" }}
                />
                <Select
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size={{ base: "md", md: "lg" }}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </VStack>
              
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button
                    leftIcon={<DownloadIcon />}
                    colorScheme="green"
                    isLoading={exportLoading}
                    loadingText="Exporting..."
                    size={{ base: "md", md: "lg" }}
                    width={{ base: "100%", md: "auto" }}
                  >
                    Export
                  </Button>
                </PopoverTrigger>
                <PopoverContent p={4}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Choose Export Format</PopoverHeader>
                  <PopoverBody>
                    <VStack spacing={3}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleExport('csv')}
                        width="100%"
                      >
                        Export as CSV
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => handleExport('excel')}
                        width="100%"
                      >
                        Export as Excel
                      </Button>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          </VStack>

          {loading ? (
            <Flex justify="center" py={8}>
              <Spinner size="xl" />
            </Flex>
          ) : bookings.length === 0 ? (
            <Text textAlign="center" py={8}>
              No bookings found
            </Text>
          ) : (
            <Box>
              {/* 表头 - 使用AdminCard组件确保完全对齐 */}
              <Box display={{ base: "none", md: "block" }} mb={2}>
                <AdminCard
                  item={{
                    bookingNumber: 'Booking Number',
                    attractionName: 'Attraction',
                    customer: 'Customer', 
                    date: 'Date',
                    people: 'People',
                    totalPrice: 'Total Price', // 这个会按price类型渲染
                    status: 'Status' // 这个会按status类型渲染
                  }}
                  fields={bookingFields} // 使用原始字段类型！
                  actions={false}
                  bg="gray.50"
                  getStatusColor={() => 'gray'} // 为Status徽章提供灰色
                />
              </Box>
              
              <ResponsiveGrid columns={{ base: 1, md: 1 }} spacing={{ base: 4, md: 6 }}>
                {bookings.map((booking) => (
                  <AdminCard
                    key={booking.id}
                    item={{
                      ...booking,
                      attractionName: booking.attraction?.name || booking.attractionId?.name || booking.tourId?.name || 'Unknown Attraction/Tour',
                      customer: (booking.customer && typeof booking.customer === 'object') ? booking.customer.name : (booking.customer || booking.name || 'Unknown Customer'),
                      date: (() => {
                        const dateStr = booking.bookingDate || booking.date || booking.createdAt;
                        if (!dateStr) return 'N/A';
                        const date = new Date(dateStr);
                        const dateOnly = date.toLocaleDateString();
                        const timeOnly = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return `${dateOnly}\n${timeOnly}`;
                      })(),
                      people: `${booking.numberOfAdults || booking.adults || 0} Adults + ${booking.numberOfChildren || booking.children || 0} Children`,
                      totalPrice: booking.totalPrice,
                      status: getStatusText(booking.status)
                    }}
                    fields={bookingFields}
                    onStatusChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                    currentStatus={booking.status}
                    availableStatuses={['pending', 'confirmed', 'cancelled']}
                    getStatusColor={getStatusColor}
                    actions={true}
                    showStatusChange={true}
                  />
                ))}
              </ResponsiveGrid>
            </Box>
          )}
        </VStack>
      </Container>
      <Footer />
    </>
  );
} 