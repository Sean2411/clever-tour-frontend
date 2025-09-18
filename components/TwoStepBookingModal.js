import { useState, useEffect } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Button,
  Box,
  Text,
  Divider,
  IconButton,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useToast,
  Select
} from '@chakra-ui/react';
import { CloseIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from './StripePaymentForm';
import StripeCheckoutButton from './StripeCheckoutButton';

// 加载 Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function TwoStepBookingModal({ 
  isOpen, 
  onClose, 
  formData, 
  onInputChange, 
  onNumberChange, 
  calculateTotalPrice,
  tourId,
  tour
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const toast = useToast();

  // 内部价格计算函数
  const getTotalPrice = () => {
    if (!tour) return '0.00';
    
    const totalPersons = formData.adults + formData.children;
    const costMethod = tour.costMethod || 'ByNumberOfPersons';
    
    if (costMethod === 'ByNumberOfPersons') {
      // 按人数计算：总价 = (大人数 + 小孩数) x 单价
      return (totalPersons * tour.price).toFixed(2);
    } else if (costMethod === 'Mayi') {
      return calculateMayiPrice(totalPersons, formData.rooms, tour.price, tour.singlePrice);
    }
    
    // 默认按人数计算
    return (totalPersons * tour.price).toFixed(2);
  };

  // Mayi 特殊定价逻辑
  const calculateMayiPrice = (totalPersons, rooms, basePrice, singlePrice) => {
    if (totalPersons === rooms) {
      // 1人：总价 = 单人价
      return (singlePrice * totalPersons).toFixed(2);
    } else if (totalPersons === 2) {
      if (rooms === 1) {
        // 2人1房：总价 = 单价 x 2
        return (basePrice * 2).toFixed(2);
      } else if (rooms === 2) {
        // 2人2房：总价 = 单人价 x 2
        return (singlePrice * 2).toFixed(2);
      }
    } else if (totalPersons >= 3 && totalPersons <= 4) {
      // 3-4人：总价 = 单价 x 2（2人付费，其余免费）
      return (basePrice * 2).toFixed(2);
    } else if (totalPersons === 5) {
      if (rooms === 2) {
        // 5人2房：取较小值
        const option1 = basePrice * 2 + singlePrice; // 单价 x 2 + 单人价 x 1
        const option2 = basePrice * 2 * 2; // 单价 x 2 x 2
        return Math.min(option1, option2).toFixed(2);
      }
    } else if (totalPersons >= 6) {
      // 6人及以上：按房间数计算
      return calculateMayiPriceForLargeGroups(totalPersons, rooms, basePrice, singlePrice);
    }
    
    // 默认情况
    return (basePrice * totalPersons).toFixed(2);
  };

  // 处理6人及以上的Mayi定价
  const calculateMayiPriceForLargeGroups = (totalPersons, rooms, basePrice, singlePrice) => {
    const personsPerRoom = Math.ceil(totalPersons / rooms);
    
    if (personsPerRoom <= 4) {
      if (rooms === 1) {
        return (basePrice * 2).toFixed(2);
      } else {
        return (basePrice * 2 * rooms).toFixed(2);
      }
    } else {
      const extraPersons = totalPersons - (rooms * 4);
      const baseCost = basePrice * 2 * rooms;
      const extraCost = extraPersons * singlePrice;
      return (baseCost + extraCost).toFixed(2);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(1);
      setBookingId(null);
      setBookingError(null);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCreateBooking = async () => {
    setSubmitting(true);
    setBookingError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.clever-tour.com';
      
      // 获取当前用户信息
      const userData = localStorage.getItem('user');
      let userId = null;
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id;
          console.log('👤 Current user ID:', userId);
        } catch (error) {
          console.error('❌ Error parsing user data:', error);
        }
      }
      
      const bookingData = {
        tourId,
        ...formData,
        totalPrice: getTotalPrice()
      };
      
      // 添加用户ID字段（尝试不同的字段名称）
      if (userId) {
        bookingData.user_id = userId;
        bookingData.userId = userId;
        bookingData.customerId = userId;
      }
      
      console.log('📊 Booking data with user_id:', bookingData);
      
      // 获取认证 token
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // 添加 Authorization header 如果 token 存在
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔐 Using JWT token for authentication');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create booking');
      }

      setBookingId(result.booking.id);
      setCurrentStep(2);
      
      toast({
        title: 'Booking Created!',
        description: 'Please complete payment to confirm your booking.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingError(error.message);
      
      // 提供更友好的错误信息
      let errorMessage = error.message;
      if (error.message.includes('Missing required fields')) {
        errorMessage = 'Please check that all required fields are filled correctly. If the problem persists, please contact support.';
      }
      
      toast({
        title: 'Booking Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    toast({
      title: 'Payment Successful!',
      description: 'Your booking has been confirmed.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // 关闭模态框并跳转到订单详情页
    onClose();
    window.location.href = `/orders/${bookingId}`;
  };

  const handlePaymentError = (error) => {
    toast({
      title: 'Payment Failed',
      description: error.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    
    // 关闭模态框并跳转到订单详情页（显示未支付状态）
    onClose();
    window.location.href = `/orders/${bookingId}`;
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setBookingId(null);
    setBookingError(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
        }}
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* 头部 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '16px'
        }}>
          <HStack spacing={4}>
            {currentStep === 2 && (
              <IconButton
                icon={<ArrowBackIcon />}
                onClick={handleBackToStep1}
                variant="ghost"
                size="sm"
                aria-label="Back to booking form"
              />
            )}
            <Text fontSize="xl" fontWeight="bold">
              {currentStep === 1 ? 'Book Your Tour' : 'Complete Payment'}
            </Text>
          </HStack>
          <IconButton
            icon={<CloseIcon />}
            onClick={onClose}
            variant="ghost"
            size="sm"
            aria-label="Close modal"
          />
        </div>

        {/* 进度条 */}
        <Box mb={6}>
          <Progress value={currentStep * 50} colorScheme="blue" size="sm" />
          <HStack justify="space-between" mt={2}>
            <Text fontSize="sm" color={currentStep >= 1 ? 'blue.500' : 'gray.400'}>
              Step 1: Booking Details
            </Text>
            <Text fontSize="sm" color={currentStep >= 2 ? 'blue.500' : 'gray.400'}>
              Step 2: Payment
            </Text>
          </HStack>
        </Box>

        {/* 步骤内容 */}
        {currentStep === 1 && (
          <VStack spacing={4} align="stretch">
            {/* 错误提示 */}
            {bookingError && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>Booking Error</AlertTitle>
                <AlertDescription>{bookingError}</AlertDescription>
              </Alert>
            )}

            {/* 预订表单 */}
            <form onSubmit={(e) => { e.preventDefault(); handleCreateBooking(); }}>
              <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={onInputChange}
                      placeholder="Your full name"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={onInputChange}
                      placeholder="your.email@example.com"
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    placeholder="Your phone number"
                  />
                </FormControl>

                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Visit Date</FormLabel>
                    <Input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={onInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Departure time and location</FormLabel>
                    <Select
                      name="time"
                      value={formData.time}
                      onChange={onInputChange}
                      placeholder="Select departure time and location"
                    >
                      {tour?.departureTimeAndLocation?.map((option, index) => (
                        <option key={index} value={`${option.time} - ${option.location}`}>
                          {option.time} - {option.location}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>

                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Adults</FormLabel>
                    <NumberInput
                      name="adults"
                      value={formData.adults}
                      onChange={(value) => onNumberChange('adults', value)}
                      min={1}
                      max={20}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Children</FormLabel>
                    <NumberInput
                      name="children"
                      value={formData.children}
                      onChange={(value) => onNumberChange('children', value)}
                      min={0}
                      max={20}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Rooms</FormLabel>
                    <NumberInput
                      name="rooms"
                      value={formData.rooms}
                      onChange={(value) => onNumberChange('rooms', value)}
                      min={1}
                      max={10}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Special Requests</FormLabel>
                  <Textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={onInputChange}
                    placeholder="Any special requests or requirements..."
                    rows={3}
                  />
                </FormControl>

                <Divider />

                {/* 价格显示 */}
                <Box p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Total Price:</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      ${getTotalPrice()}
                    </Text>
                  </HStack>
                </Box>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={submitting}
                  loadingText="Creating Booking..."
                  w="100%"
                >
                  Create Booking & Continue to Payment
                </Button>
              </VStack>
            </form>
          </VStack>
        )}

        {currentStep === 2 && bookingId && (
          <VStack spacing={6} align="stretch">
            {/* 预订信息摘要 */}
            <Box p={4} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
              <Text fontWeight="bold" mb={2}>Booking Summary</Text>
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.600">Tour:</Text>
                  <Text fontWeight="medium">{tour?.name}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Date:</Text>
                  <Text>{formData.date}</Text>
                </HStack>
                {formData.time && (
                  <HStack justify="space-between">
                    <Text color="gray.600">Departure:</Text>
                    <Text>{formData.time}</Text>
                  </HStack>
                )}
                <HStack justify="space-between">
                  <Text color="gray.600">People:</Text>
                  <Text>{formData.adults} Adults + {formData.children} Children</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Total Amount:</Text>
                  <Text fontWeight="bold" color="blue.600">${getTotalPrice()}</Text>
                </HStack>
              </VStack>
            </Box>

            {/* 支付表单 */}
            <StripeCheckoutButton
              amount={getTotalPrice()}
              bookingId={bookingId}
              tourName={tour?.name}
              customerName={formData.name}
              customerEmail={formData.email}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </VStack>
        )}
      </div>
    </>
  );
}
