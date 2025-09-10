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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

export default function BookingModal({ 
  isOpen, 
  onClose, 
  formData, 
  onInputChange, 
  onNumberChange, 
  onSubmit, 
  calculateTotalPrice,
  submitting 
}) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="lg"
      closeOnOverlayClick={true}
      closeOnEsc={true}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Book Your Tour</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={onSubmit}>
            <VStack spacing={4}>
              {/* Personal Information */}
              <Box w="100%">
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
              <Box w="100%">
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
              <Box w="100%">
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
              <Box w="100%" p={4} bg="gray.50" borderRadius="md">
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 