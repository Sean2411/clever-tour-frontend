import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Please make sure both passwords match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast({
        title: 'Registration Successful',
        description: 'Please login to continue',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      router.push('/login');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxW="container.sm" py={10}>
        <VStack spacing={8}>
          <Heading>Register</Heading>
          <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={loading}
                >
                  Register
                </Button>
              </VStack>
            </form>
            <Text mt={4} textAlign="center">
              Already have an account?{' '}
              <Link href="/login" passHref>
                <Text as="span" color="blue.500" cursor="pointer">
                  Login now
                </Text>
              </Link>
            </Text>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </>
  );
} 