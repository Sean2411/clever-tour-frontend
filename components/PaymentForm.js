import {
  Box,
  VStack,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  HStack,
  Image,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function PaymentForm({ booking, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });
  const toast = useToast();

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          paymentMethod,
          amount: booking.totalPrice,
          cardDetails: paymentMethod === 'credit' ? cardDetails : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      if (paymentMethod === 'credit') {
        // Credit card payment directly processes the result
        if (data.status === 'success') {
          toast({
            title: 'Payment Successful',
            description: 'Your booking has been confirmed',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          onPaymentSuccess(data);
        } else {
          throw new Error('Payment failed, please try again');
        }
      } else {
        // Alipay or WeChat payment, redirect to payment page
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      console.error('Payment processing failed:', err);
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

  return (
    <Box p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Payment Method</Text>
        
        <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
          <VStack align="stretch" spacing={4}>
            <Radio value="credit">
              <HStack>
                <Image src="/images/credit-card.png" alt="Credit Card" boxSize="24px" />
                <Text>Credit Card Payment</Text>
              </HStack>
            </Radio>
            
            <Radio value="alipay">
              <HStack>
                <Image src="/images/alipay.png" alt="Alipay" boxSize="24px" />
                <Text>Alipay Payment</Text>
              </HStack>
            </Radio>
            
            <Radio value="wechat">
              <HStack>
                <Image src="/images/wechat-pay.png" alt="WeChat Pay" boxSize="24px" />
                <Text>WeChat Pay</Text>
              </HStack>
            </Radio>
          </VStack>
        </RadioGroup>

        {paymentMethod === 'credit' && (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Card Number</FormLabel>
              <Input
                name="number"
                value={cardDetails.number}
                onChange={handleCardInputChange}
                placeholder="Enter card number"
                maxLength={16}
              />
            </FormControl>
            
            <HStack>
              <FormControl isRequired>
                <FormLabel>Expiry Date</FormLabel>
                <Input
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardInputChange}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>CVC</FormLabel>
                <Input
                  name="cvc"
                  value={cardDetails.cvc}
                  onChange={handleCardInputChange}
                  placeholder="CVC"
                  maxLength={3}
                />
              </FormControl>
            </HStack>
          </VStack>
        )}

        <Divider />

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>Payment Amount</Text>
          <Text fontSize="2xl" color="blue.500">${booking.totalPrice}</Text>
        </Box>

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handlePayment}
          isLoading={loading}
          loadingText="Processing..."
        >
          Pay Now
        </Button>
      </VStack>
    </Box>
  );
} 