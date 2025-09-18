import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

const StripeCheckoutButton = ({ 
  amount, 
  bookingId, 
  onPaymentSuccess, 
  onPaymentError,
  tourName,
  customerName,
  customerEmail 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.clever-tour.com';
      
      // 创建Checkout会话
      const response = await fetch(`${API_BASE_URL}/api/payments/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          successUrl: `${window.location.origin}/payment/success?booking_id=${bookingId}`,
          cancelUrl: `${window.location.origin}/payment/cancel?booking_id=${bookingId}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      // 重定向到Stripe Checkout页面
      window.location.href = data.url;

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
      
      toast({
        title: '支付失败',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      if (onPaymentError) {
        onPaymentError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="100%">
      <VStack spacing={6} align="stretch">
        {/* 支付金额显示 */}
        <Box p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
          <Text fontSize="lg" fontWeight="bold" color="blue.700">
            支付金额: ${amount}
          </Text>
          {tourName && (
            <Text fontSize="sm" color="blue.600" mt={1}>
              预订项目: {tourName}
            </Text>
          )}
        </Box>

        {/* 错误提示 */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>支付错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stripe Checkout 说明 */}
        <Box p={4} border="1px solid" borderColor="green.200" borderRadius="md" bg="green.50">
          <Text fontSize="sm" fontWeight="medium" mb={2} color="green.700">
            🔒 安全支付 - Stripe Checkout
          </Text>
          <Text fontSize="xs" color="green.600" mb={2}>
            点击下方按钮将跳转到Stripe的安全支付页面，在那里您可以安全地输入信用卡信息。
          </Text>
          <Text fontSize="xs" color="green.600">
            • 支持所有主要信用卡和借记卡<br/>
            • 银行级别的安全加密<br/>
            • 无需在我们的网站上输入敏感信息
          </Text>
        </Box>

        {/* 支付按钮 */}
        <Button
          onClick={handleCheckout}
          colorScheme="green"
          size="lg"
          isLoading={isLoading}
          loadingText="跳转到支付页面..."
          disabled={isLoading}
          w="100%"
        >
          {isLoading ? (
            <Spinner size="sm" mr={2} />
          ) : null}
          使用Stripe安全支付 ${amount}
        </Button>

        {/* 安全提示 */}
        <Text fontSize="xs" color="gray.500" textAlign="center">
          🔒 您的支付信息通过 Stripe 安全加密处理，我们不会存储您的信用卡信息
        </Text>
      </VStack>
    </Box>
  );
};

export default StripeCheckoutButton;
