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
  IconButton
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

export default function CustomBookingModal({ 
  isOpen, 
  onClose, 
  formData, 
  onInputChange, 
  onNumberChange, 
  onSubmit, 
  calculateTotalPrice,
  submitting 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      // 恢复背景滚动
      document.body.style.overflow = 'unset';
    }

    // 清理函数
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
          <Text fontSize="xl" fontWeight="bold">Book Your Tour</Text>
          <IconButton
            icon={<CloseIcon />}
            onClick={onClose}
            variant="ghost"
            size="sm"
            aria-label="Close modal"
          />
        </div>

        {/* 表单内容 */}
        <form onSubmit={onSubmit}>
          <VStack spacing={4} align="stretch">
            {/* Personal Information */}
            <Box>
              <Text fontWeight="bold" mb={3} color="blue.600">Personal Information</Text>
              <VStack spacing={3}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={onInputChange}
                    placeholder="Enter your full name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onInputChange}
                    placeholder="Enter your email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    placeholder="Enter your phone number"
                  />
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            {/* Tour Details */}
            <Box>
              <Text fontWeight="bold" mb={3} color="blue.600">Tour Details</Text>
              <VStack spacing={3}>
                <FormControl isRequired>
                  <FormLabel>Preferred Date</FormLabel>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={onInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>

                <HStack spacing={4} w="100%">
                  <FormControl>
                    <FormLabel>Adults</FormLabel>
                    <NumberInput
                      name="adults"
                      value={formData.adults}
                      onChange={(value) => onNumberChange('adults', value)}
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

                  <FormControl>
                    <FormLabel>Children</FormLabel>
                    <NumberInput
                      name="children"
                      value={formData.children}
                      onChange={(value) => onNumberChange('children', value)}
                      min={0}
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
                  <FormLabel>Number of Rooms</FormLabel>
                  <NumberInput
                    name="rooms"
                    value={formData.rooms}
                    onChange={(value) => onNumberChange('rooms', value)}
                    min={1}
                    max={5}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            {/* Special Requests */}
            <Box>
              <Text fontWeight="bold" mb={3} color="blue.600">Additional Information</Text>
              <FormControl>
                <FormLabel>Special Requests</FormLabel>
                <Textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={onInputChange}
                  placeholder="Any special requests, dietary requirements, accessibility needs, or other requirements"
                  rows={3}
                />
              </FormControl>
            </Box>

            {/* Price Summary */}
            <Box p={4} bg="gray.50" borderRadius="md">
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="bold">Total Price:</Text>
                  <Text fontWeight="bold" color="blue.500" fontSize="lg">
                    ${calculateTotalPrice()}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  * Price calculation method: {formData.costMethod === 'ByNumberOfPersons' ? 'By Number of Persons' : 'Mayi Special Pricing'}
                </Text>
              </VStack>
            </Box>

            <Button type="submit" colorScheme="blue" w="100%" isLoading={submitting}>
              Confirm Booking
            </Button>
          </VStack>
        </form>
      </div>
    </>
  );
}
