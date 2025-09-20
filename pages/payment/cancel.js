import { useRouter } from 'next/router';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
} from '@chakra-ui/react';
import { WarningIcon, ArrowBackIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PaymentCancel() {
  const router = useRouter();
  const { booking_id } = router.query;

  const handleRetryPayment = () => {
    if (booking_id) {
      router.push(`/payment/${booking_id}`);
    } else {
      router.push('/orders');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>支付取消 - Clever Tour</title>
      </Head>
      <Navbar />
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} align="center">
          {/* 警告图标 */}
          <Icon as={WarningIcon} w={20} h={20} color="orange.500" />
          
          {/* 取消标题 */}
          <Heading size="xl" color="orange.600" textAlign="center">
            支付已取消
          </Heading>
          
          {/* 取消描述 */}
          <Text fontSize="lg" color="gray.600" textAlign="center" maxW="md">
            您的支付已被取消。您的预订仍然保留，您可以稍后完成支付。
          </Text>

          {/* 信息提示 */}
          <Alert status="info" maxW="md">
            <AlertIcon />
            <Box>
              <AlertTitle>预订状态</AlertTitle>
              <AlertDescription>
                您的预订已创建但尚未支付。请在24小时内完成支付以确认预订。
              </AlertDescription>
            </Box>
          </Alert>

          {/* 操作按钮 */}
          <VStack spacing={4} w="100%" maxW="md">
            <Button
              colorScheme="blue"
              size="lg"
              w="100%"
              onClick={handleRetryPayment}
              leftIcon={<ArrowBackIcon />}
            >
              重新尝试支付
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
          <Box p={4} bg="gray.50" borderRadius="md" w="100%" maxW="md">
            <Text fontSize="sm" color="gray.600" textAlign="center">
              💡 如果您在支付过程中遇到问题<br/>
              📞 请联系我们的客服团队获取帮助
            </Text>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
