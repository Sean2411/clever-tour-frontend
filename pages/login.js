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
  FormErrorMessage,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = t('auth.emailRequired');
    if (!password) newErrors.password = t('auth.passwordRequired');
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.emailInvalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Sending login request...');
      // 直接调用后端API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.clever-tour.com';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Login response:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('auth.loginFailed'),
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
          <Heading>{t('auth.login')}</Heading>
          <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired isInvalid={errors.email}>
                                  <FormLabel>{t('auth.email')}</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.password}>
                                  <FormLabel>{t('auth.password')}</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={loading}
                >
                  {t('auth.login')}
                </Button>
              </VStack>
            </form>
            <Text mt={4} textAlign="center">
              {t('auth.noAccount')}{' '}
              <Link href="/register" passHref>
                <Text as="span" color="blue.500" cursor="pointer">
                  {t('auth.registerNow')}
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