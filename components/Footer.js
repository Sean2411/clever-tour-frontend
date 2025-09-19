import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTop="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      mt="auto"
    >
      <Container
        as={Stack}
        maxW="container.xl"
        py={{ base: 6, md: 8 }}
        direction={{ base: 'column', md: 'row' }}
        spacing={{ base: 4, md: 6 }}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text 
          fontSize={{ base: 'sm', md: 'md' }}
          textAlign={{ base: 'center', md: 'left' }}
        >
          © 2025 Clever Tour. All rights reserved
        </Text>
        <Stack 
          direction={{ base: 'column', sm: 'row' }} 
          spacing={{ base: 3, sm: 6 }}
          align="center"
        >
          <NextLink href="/about" passHref>
            <Link 
              fontSize={{ base: 'sm', md: 'md' }}
              _hover={{ color: 'blue.500' }}
            >
              About Us
            </Link>
          </NextLink>
          <NextLink href="/contact" passHref>
            <Link 
              fontSize={{ base: 'sm', md: 'md' }}
              _hover={{ color: 'blue.500' }}
            >
              Contact Us
            </Link>
          </NextLink>
          <NextLink href="/terms" passHref>
            <Link 
              fontSize={{ base: 'sm', md: 'md' }}
              _hover={{ color: 'blue.500' }}
            >
              Terms of Service
            </Link>
          </NextLink>
          <NextLink href="/privacy" passHref>
            <Link 
              fontSize={{ base: 'sm', md: 'md' }}
              _hover={{ color: 'blue.500' }}
            >
              Privacy Policy
            </Link>
          </NextLink>
        </Stack>
      </Container>
    </Box>
  );
} 