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
        shadow: 'xl',
        transition: 'all 0.3s ease'
      }}
      transition="all 0.3s ease"
      bg="white"
      height="100%"
      display="flex"
      flexDirection="column"
      {...props}
    >
      {/* Image Container - Fixed Height */}
      <Box position="relative" height="220px" flexShrink={0}>
        <Image
          src={image}
          alt={title}
          width="100%"
          height="100%"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/400x220?text=No+Image"
        />
        {badge && (
          <Badge
            position="absolute"
            top={3}
            right={3}
            colorScheme={badgeColor}
            borderRadius="full"
            px={3}
            py={1}
            fontSize="sm"
            fontWeight="medium"
          >
            {badge}
          </Badge>
        )}
      </Box>

      {/* Content - Flexible Height */}
      <Box p={6} flex="1" display="flex" flexDirection="column">
        <VStack spacing={4} align="stretch" flex="1">
          <Heading 
            size="lg" 
            noOfLines={2}
            lineHeight="1.3"
            color="gray.800"
          >
            {title}
          </Heading>
          
          <Text 
            color="gray.600" 
            noOfLines={3}
            fontSize="md"
            lineHeight="1.5"
            flex="1"
          >
            {description}
          </Text>

          {/* Price and Button Section - Fixed at Bottom */}
          <Box mt="auto">
            {price && (
              <HStack justify="space-between" align="center" mb={3}>
                <Text 
                  color="blue.500" 
                  fontWeight="bold"
                  fontSize="xl"
                >
                  ${price}
                </Text>
              </HStack>
            )}
            {children}
          </Box>
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