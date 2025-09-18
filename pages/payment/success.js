import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id, booking_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (session_id) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [session_id]);

  const verifyPayment = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.clever-tour.com';
      
      const response = await fetch(`${API_BASE_URL}/api/payments/checkout/success?session_id=${session_id}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setPaymentData(data);
        
        toast({
          title: '支付成功！',
          description: '您的预订已确认',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError(data.message || '支付验证失败');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('支付验证失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = () => {
    if (paymentData?.bookingId) {
      router.push(`/orders/${paymentData.bookingId}`);
    } else if (booking_id) {
      router.push(`/orders/${booking_id}`);
    } else {
      router.push('/orders');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>支付处理中 - Clever Tour</title>
        </Head>
        <Navbar />
        <Container maxW="container.md" py={10}>
          <VStack spacing={6} align="center">
            <Spinner size="xl" color="blue.500" />
            <Text>正在验证支付信息...</Text>
          </VStack>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>支付成功 - Clever Tour</title>
      </Head>
      <Navbar />
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} align="center">
          {error ? (
            <Alert status="error" maxW="md">
              <AlertIcon />
              <Box>
                <AlertTitle>支付验证失败</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          ) : (
            <>
              {/* 成功图标 */}
              <Icon as={CheckCircleIcon} w={20} h={20} color="green.500" />
              
              {/* 成功标题 */}
              <Heading size="xl" color="green.600" textAlign="center">
                支付成功！
              </Heading>
              
              {/* 成功描述 */}
              <Text fontSize="lg" color="gray.600" textAlign="center" maxW="md">
                感谢您的预订！您的支付已成功处理，预订已确认。
              </Text>

              {/* 预订信息卡片 */}
              {paymentData && (
                <Card w="100%" maxW="md">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Text fontWeight="bold" fontSize="lg">
                        预订确认信息
                      </Text>
                      
                      {paymentData.bookingNumber && (
                        <HStack justify="space-between">
                          <Text color="gray.600">预订编号:</Text>
                          <Text fontWeight="medium">{paymentData.bookingNumber}</Text>
                        </HStack>
                      )}
                      
                      <HStack justify="space-between">
                        <Text color="gray.600">支付状态:</Text>
                        <Text fontWeight="medium" color="green.600">已支付</Text>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text color="gray.600">确认时间:</Text>
                        <Text fontWeight="medium">{new Date().toLocaleString('zh-CN')}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              {/* 操作按钮 */}
              <VStack spacing={4} w="100%" maxW="md">
                <Button
                  colorScheme="blue"
                  size="lg"
                  w="100%"
                  onClick={handleViewBooking}
                  rightIcon={<ExternalLinkIcon />}
                >
                  查看预订详情
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  w="100%"
                  onClick={handleGoHome}
                >
                  返回首页
                </Button>
              </VStack>

              {/* 联系信息 */}
              <Box p={4} bg="blue.50" borderRadius="md" w="100%" maxW="md">
                <Text fontSize="sm" color="blue.700" textAlign="center">
                  📧 我们已向您的邮箱发送确认邮件<br/>
                  📞 如有疑问，请联系客服
                </Text>
              </Box>
            </>
          )}
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
