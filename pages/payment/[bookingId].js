import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StripePaymentForm from '../../components/StripePaymentForm';

// 加载 Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const router = useRouter();
  const { bookingId } = router.query;
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch booking details');
      }

      setBooking(data);
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    setPaymentSuccess(true);
    // 可以在这里添加重定向到成功页面或订单详情页
    setTimeout(() => {
      router.push(`/orders/${bookingId}`);
    }, 2000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // 错误处理已在组件内部完成
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>支付处理中 - Smart Tourist</title>
        </Head>
        <Navbar />
        <Container maxW="container.md" py={8}>
          <VStack spacing={8} align="center">
            <Spinner size="xl" />
            <Text>正在加载预订信息...</Text>
          </VStack>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>支付错误 - Smart Tourist</title>
        </Head>
        <Navbar />
        <Container maxW="container.md" py={8}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>加载失败</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button mt={4} onClick={() => router.back()}>
            返回上一页
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  if (paymentSuccess) {
    return (
      <>
        <Head>
          <title>支付成功 - Smart Tourist</title>
        </Head>
        <Navbar />
        <Container maxW="container.md" py={8}>
          <VStack spacing={6} align="center">
            <Alert status="success">
              <AlertIcon />
              <AlertTitle>支付成功！</AlertTitle>
              <AlertDescription>
                您的预订已确认，正在跳转到订单详情页...
              </AlertDescription>
            </Alert>
          </VStack>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>支付 - Smart Tourist</title>
      </Head>
      <Navbar />
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} align="center">
            <Heading size="lg">完成支付</Heading>
            <Text color="gray.600" textAlign="center">
              请完成支付以确认您的预订
            </Text>
          </VStack>

          {booking && (
            <Box p={6} border="1px solid" borderColor="gray.200" borderRadius="lg">
              <VStack spacing={6} align="stretch">
                {/* 预订信息 */}
                <Box>
                  <Heading size="md" mb={4}>预订信息</Heading>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="medium">预订编号:</Text>
                      <Text>{booking.orderNumber || booking.bookingNumber}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">旅游项目:</Text>
                      <Text>{booking.tourId?.name || booking.attractionId?.name || 'Unknown'}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">访问日期:</Text>
                      <Text>{new Date(booking.visitDate || booking.date).toLocaleDateString()}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">人数:</Text>
                      <Text>{booking.numberOfAdults || booking.adults} 成人 + {booking.numberOfChildren || booking.children} 儿童</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">房间数:</Text>
                      <Text>{booking.rooms || 1}</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                {/* 支付表单 */}
                <Box>
                  <Heading size="md" mb={4}>支付信息</Heading>
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm
                      amount={booking.totalPrice}
                      bookingId={booking.id}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                  </Elements>
                </Box>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
      <Footer />
    </>
  );
};

export default PaymentPage;
