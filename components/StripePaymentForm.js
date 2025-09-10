import React, { useState, useEffect } from 'react';
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
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const StripePaymentForm = ({ 
  amount, 
  bookingId, 
  onPaymentSuccess, 
  onPaymentError,
  isProcessing = false 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. 创建支付意图
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const createPaymentResponse = await fetch(`${API_BASE_URL}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          paymentMethod: 'card',
          amount,
        }),
      });

      const paymentData = await createPaymentResponse.json();

      if (!createPaymentResponse.ok) {
        throw new Error(paymentData.message || 'Failed to create payment');
      }

      // 2. 确认支付
      const { error: confirmError } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              // 可以添加账单详情
            },
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // 3. 验证支付状态
      const confirmResponse = await fetch(`${API_BASE_URL}/api/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentData.paymentId,
        }),
      });

      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok) {
        throw new Error(confirmData.message || 'Payment confirmation failed');
      }

      if (confirmData.success) {
        toast({
          title: '支付成功！',
          description: '您的预订已确认',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        if (onPaymentSuccess) {
          onPaymentSuccess(confirmData);
        }
      } else {
        throw new Error(confirmData.message || 'Payment failed');
      }

    } catch (err) {
      console.error('Payment error:', err);
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

  const isDisabled = !stripe || isLoading || isProcessing;

  return (
    <Box as="form" onSubmit={handleSubmit} w="100%">
      <VStack spacing={6} align="stretch">
        {/* 支付金额显示 */}
        <Box p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
          <Text fontSize="lg" fontWeight="bold" color="blue.700">
            支付金额: ${amount}
          </Text>
        </Box>

        {/* 错误提示 */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>支付错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 信用卡输入框 */}
        <Box p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
            信用卡信息
          </Text>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </Box>

        {/* 支付按钮 */}
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isLoading}
          loadingText="处理支付中..."
          disabled={isDisabled}
          w="100%"
        >
          {isLoading ? (
            <Spinner size="sm" mr={2} />
          ) : null}
          确认支付 ${amount}
        </Button>

        {/* 安全提示 */}
        <Text fontSize="xs" color="gray.500" textAlign="center">
          🔒 您的支付信息通过 Stripe 安全加密处理
        </Text>
      </VStack>
    </Box>
  );
};

export default StripePaymentForm;
