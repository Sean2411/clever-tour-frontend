import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';

const ResponsiveCard = ({
  title,
  description,
  image,
  price,
  badge,
  badgeColor = 'blue',
  href,
  onClick,
  children,
  ...props
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  const CardContent = (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      _hover={{ 
        transform: 'translateY(-4px)', 
        shadow: 'lg',
        transition: 'all 0.2s'
      }}
      transition="all 0.2s"
      bg="white"
      {...props}
    >
      {/* Image Container */}
      <Box position="relative" height={{ base: '200px', md: '250px', lg: '200px' }}>
        <Image
          src={image}
          alt={title}
          width="100%"
          height="100%"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/400x200?text=No+Image"
        />
        {badge && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme={badgeColor}
            borderRadius="full"
            px={2}
            py={1}
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            {badge}
          </Badge>
        )}
      </Box>

      {/* Content */}
      <Box p={{ base: 4, md: 6 }}>
        <VStack spacing={3} align="stretch">
          <Heading 
            size={{ base: 'md', md: 'lg' }} 
            noOfLines={2}
            lineHeight="1.2"
          >
            {title}
          </Heading>
          
          <Text 
            color="gray.600" 
            noOfLines={{ base: 2, md: 3 }}
            fontSize={{ base: 'sm', md: 'md' }}
            lineHeight="1.4"
          >
            {description}
          </Text>

          {price && (
            <HStack justify="space-between" align="center">
              <Text 
                color="blue.500" 
                fontWeight="bold"
                fontSize={{ base: 'lg', md: 'xl' }}
              >
                ${price}
              </Text>
              {children}
            </HStack>
          )}

          {!price && children}
        </VStack>
      </Box>
    </Box>
  );

  if (href) {
    return (
      <Link href={href} passHref>
        {CardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <Box onClick={onClick}>
        {CardContent}
      </Box>
    );
  }

  return CardContent;
};

export default ResponsiveCard; 