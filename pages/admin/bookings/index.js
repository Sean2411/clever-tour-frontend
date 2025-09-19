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
import Layout from '../../../components/Layout';
import AdminCard from '../../../components/AdminCard';
import ResponsiveGrid from '../../../components/ResponsiveGrid';
import { AdminOnly } from '../../../components/ProtectedRoute';
import { api } from '../../../lib/api';

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
      const data = await api.get(`/api/admin/bookings?search=${searchTerm}&status=${statusFilter}`);
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
      await api.patch(`/api/admin/bookings/${bookingId}`, { status: newStatus });

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

  // 统一的数据处理函数，用于显示和导出
  const processBookingData = (booking) => {
    // 处理 Sequelize 实例结构，优先使用 dataValues
    const cleanBooking = booking.dataValues || booking;
    
    return {
      id: cleanBooking.id || booking.id || booking._id || cleanBooking.bookingNumber,
      bookingNumber: cleanBooking.bookingNumber || booking.bookingNumber,
      attractionName: cleanBooking.attraction?.name || booking.attraction?.name || cleanBooking.tour?.name || booking.tour?.name || cleanBooking.attractionId?.name || cleanBooking.tourId?.name || 'Unknown Attraction/Tour',
      customer: (cleanBooking.customer && typeof cleanBooking.customer === 'object') ? cleanBooking.customer.name : (cleanBooking.customer || cleanBooking.name || booking.name || 'Unknown Customer'),
      customerEmail: (cleanBooking.customer && typeof cleanBooking.customer === 'object') ? cleanBooking.customer.email : (cleanBooking.email || booking.email || 'Unknown'),
      customerPhone: (cleanBooking.customer && typeof cleanBooking.customer === 'object') ? cleanBooking.customer.phone : (cleanBooking.phone || booking.phone || 'Unknown'),
      date: (() => {
        const dateStr = cleanBooking.bookingDate || cleanBooking.date || booking.date || cleanBooking.createdAt || booking.createdAt;
        if (!dateStr) return 'N/A';
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return 'N/A';
          const dateOnly = date.toLocaleDateString();
          const timeOnly = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return `${dateOnly}\n${timeOnly}`;
        } catch (e) {
          return 'N/A';
        }
      })(),
      dateForExport: (() => {
        const dateStr = cleanBooking.bookingDate || cleanBooking.date || booking.date || cleanBooking.createdAt || booking.createdAt;
        if (!dateStr) return 'N/A';
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return 'N/A';
          return date.toLocaleDateString();
        } catch (e) {
          return 'N/A';
        }
      })(),
      timeForExport: (() => {
        const dateStr = cleanBooking.bookingDate || cleanBooking.date || booking.date || cleanBooking.createdAt || booking.createdAt;
        if (!dateStr) return 'N/A';
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return 'N/A';
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
          return 'N/A';
        }
      })(),
      people: `${cleanBooking.numberOfAdults || cleanBooking.adults || booking.adults || 0} Adults + ${cleanBooking.numberOfChildren || cleanBooking.children || booking.children || 0} Children`,
      adults: cleanBooking.numberOfAdults || cleanBooking.adults || booking.adults || 0,
      children: cleanBooking.numberOfChildren || cleanBooking.children || booking.children || 0,
      totalPrice: cleanBooking.totalPrice || cleanBooking.total_price || booking.totalPrice || booking.total_price || 'N/A',
      status: getStatusText(cleanBooking.status || booking.status),
      paymentMethod: cleanBooking.paymentMethod || booking.paymentMethod || 'N/A',
      paymentStatus: cleanBooking.paymentStatus || booking.paymentStatus || 'N/A',
      specialRequests: cleanBooking.specialRequests || booking.specialRequests || '',
      createdAt: (() => {
        const dateStr = cleanBooking.createdAt || booking.createdAt;
        if (!dateStr) return 'N/A';
        try {
          return new Date(dateStr).toLocaleString();
        } catch (e) {
          return 'N/A';
        }
      })()
    };
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
      'Adults',
      'Children',
      'Total Price',
      'Status',
      'Payment Method',
      'Payment Status',
      'Special Requests',
      'Created At'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(booking => {
        const processed = processBookingData(booking);
        return [
          processed.bookingNumber,
          processed.attractionName,
          processed.customer,
          processed.customerEmail,
          processed.customerPhone,
          processed.dateForExport,
          processed.timeForExport,
          processed.adults,
          processed.children,
          processed.totalPrice,
          processed.status,
          processed.paymentMethod,
          processed.paymentStatus,
          processed.specialRequests,
          processed.createdAt
        ].join(',');
      })
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
    const worksheet = XLSX.utils.json_to_sheet(data.map(booking => {
      const processed = processBookingData(booking);
      return {
        'Order Number': processed.bookingNumber,
        'Attraction/Tour Name': processed.attractionName,
        'Customer Name': processed.customer,
        'Customer Email': processed.customerEmail,
        'Customer Phone': processed.customerPhone,
        'Booking Date': processed.dateForExport,
        'Booking Time': processed.timeForExport,
        'Adults': processed.adults,
        'Children': processed.children,
        'Total Price': processed.totalPrice,
        'Status': processed.status,
        'Payment Method': processed.paymentMethod,
        'Payment Status': processed.paymentStatus,
        'Special Requests': processed.specialRequests,
        'Created At': processed.createdAt
      };
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
    
    XLSX.writeFile(workbook, `bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      
      // 获取所有预订数据（不应用搜索和过滤）
      const data = await api.get('/api/admin/bookings');

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
    <AdminOnly>
      <Head>
        <title>Booking Management - Smart Tourist</title>
      </Head>

      <Layout>
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
                {bookings.map((booking, index) => {
                  const processedItem = processBookingData(booking);
                  
                  return (
                    <AdminCard
                      key={processedItem.id || booking.bookingNumber || `booking-${index}`}
                      item={processedItem}
                      fields={bookingFields}
                      onStatusChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                      currentStatus={booking.status}
                      availableStatuses={['pending', 'confirmed', 'cancelled']}
                      getStatusColor={getStatusColor}
                      actions={true}
                      showStatusChange={true}
                    />
                  );
                })}
              </ResponsiveGrid>
            </Box>
          )}
        </VStack>
        </Container>
      </Layout>
    </AdminOnly>
  );
} 