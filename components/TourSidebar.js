import {
  Card,
  CardBody,
  VStack,
  Box,
  Heading,
  Text,
  HStack,
  Button,
  Divider
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

export default function TourSidebar({ tour, onBookNow }) {
  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Price</Heading>
            <HStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                ${tour.price}
              </Text>
              {tour.originalPrice && (
                <Text color="gray.500" textDecoration="line-through">
                  ${tour.originalPrice}
                </Text>
              )}
            </HStack>
          </Box>

          <Button colorScheme="blue" size="lg" onClick={onBookNow}>
            Book Now
          </Button>

          <Divider />

          <Box>
            <Heading size="md" mb={4}>Quick Facts</Heading>
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text color="gray.600">Duration</Text>
                <Text fontWeight="bold">{tour.duration}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text color="gray.600">Category</Text>
                <Text fontWeight="bold">{tour.category}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text color="gray.600">Rating</Text>
                <HStack>
                  <StarIcon color="yellow.400" />
                  <Text fontWeight="bold">{tour.rating}/5</Text>
                </HStack>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
} 