import {
  Box,
  Heading,
  Text,
  Image,
  HStack,
  Badge,
  VStack
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

export default function TourHeader({ tour }) {
  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Image
          src={tour.image}
          alt={tour.name}
          borderRadius="lg"
          width="100%"
          height="400px"
          objectFit="cover"
        />
      </Box>

      <Box>
        <Heading size="xl" mb={4}>{tour.name}</Heading>
        <HStack spacing={4} mb={4}>
          <Badge colorScheme="blue">{tour.category}</Badge>
          <Badge colorScheme="green">{tour.duration}</Badge>
          <HStack>
            <StarIcon color="yellow.400" />
            <Text fontWeight="bold">
              {tour.rating} ({tour.reviewCount} reviews)
            </Text>
          </HStack>
        </HStack>
        <Text color="gray.600" mb={6}>{tour.description}</Text>
      </Box>
    </VStack>
  );
} 