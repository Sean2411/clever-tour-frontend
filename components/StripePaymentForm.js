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

    // 开发模式：如果没有有效的Stripe配置，使用模拟支付
    if (!isStripeAvailable) {
      setIsLoading(true);
      setError(null);
      
      // 模拟支付延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: '模拟支付成功！',
        description: '开发模式：支付已模拟完成',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      if (onPaymentSuccess) {
        onPaymentSuccess({ success: true, message: 'Mock payment successful' });
      }
      
      setIsLoading(false);
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. 创建支付意图
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.clever-tour.com';
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

  // 开发模式：如果没有有效的Stripe配置，允许使用模拟支付
  const isStripeAvailable = stripe && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('your_stripe_publishable_key_here');
  
  const isDisabled = (!isStripeAvailable && !process.env.NODE_ENV === 'development') || isLoading || isProcessing;

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
        {isStripeAvailable ? (
          <Box p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
              信用卡信息
            </Text>
            {typeof window !== 'undefined' && window.location.protocol === 'http:' && (
              <Box mb={2} p={2} bg="yellow.50" border="1px solid" borderColor="yellow.200" borderRadius="md">
                <Text fontSize="xs" color="yellow.700">
                  ⚠️ 使用HTTP连接时，浏览器可能禁用自动填充功能。建议使用HTTPS进行完整测试。
                </Text>
              </Box>
            )}
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </Box>
        ) : (
          <Box p={4} border="1px solid" borderColor="orange.200" borderRadius="md" bg="orange.50">
            <Text fontSize="sm" fontWeight="medium" mb={2} color="orange.700">
              🚧 开发模式 - 模拟支付
            </Text>
            <Text fontSize="xs" color="orange.600">
              当前使用模拟支付功能。配置真实的Stripe密钥后即可使用真实支付。
            </Text>
          </Box>
        )}

        {/* 支付按钮 */}
        <Button
          type="submit"
          colorScheme={isStripeAvailable ? "blue" : "orange"}
          size="lg"
          isLoading={isLoading}
          loadingText={isStripeAvailable ? "处理支付中..." : "模拟支付中..."}
          disabled={isDisabled}
          w="100%"
        >
          {isLoading ? (
            <Spinner size="sm" mr={2} />
          ) : null}
          {isStripeAvailable ? `确认支付 $${amount}` : `模拟支付 $${amount}`}
        </Button>

        {/* 安全提示 */}
        <Text fontSize="xs" color="gray.500" textAlign="center">
          {isStripeAvailable ? 
            "🔒 您的支付信息通过 Stripe 安全加密处理" : 
            "⚠️ 开发模式：使用模拟支付，不会产生真实费用"
          }
        </Text>
      </VStack>
    </Box>
  );
};

export default StripePaymentForm;
