import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Text,
  Link,
  useToast,
  Spinner,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import NextLink from 'next/link';

const ResponsiveForm = ({
  title,
  subtitle,
  fields,
  onSubmit,
  submitText = 'Submit',
  loading = false,
  error = null,
  links = [],
  ...props
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
      
      if (field.type === 'password' && field.confirmPassword && formData[field.name]) {
        if (formData[field.name] !== formData[field.confirmPassword]) {
          newErrors[field.confirmPassword] = 'Passwords do not match';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW={{ base: '100%', sm: '400px', md: '500px' }}
      mx="auto"
      p={{ base: 6, md: 8 }}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      {...props}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <VStack spacing={2} textAlign="center">
          <Text 
            fontSize={{ base: '2xl', md: '3xl' }} 
            fontWeight="bold"
            color="gray.800"
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              fontSize={{ base: 'sm', md: 'md' }} 
              color="gray.600"
            >
              {subtitle}
            </Text>
          )}
        </VStack>

        {/* Error Message */}
        {error && (
          <Box
            bg="red.50"
            border="1px"
            borderColor="red.200"
            borderRadius="md"
            p={3}
          >
            <Text color="red.600" fontSize="sm">
              {error}
            </Text>
          </Box>
        )}

        {/* Form */}
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            {fields.map((field) => (
              <FormControl 
                key={field.name} 
                isInvalid={!!errors[field.name]}
                isRequired={field.required}
              >
                <FormLabel 
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="medium"
                >
                  {field.label}
                </FormLabel>
                <Input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  size={{ base: 'md', md: 'lg' }}
                  fontSize={{ base: 'sm', md: 'md' }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                  }}
                />
                <FormErrorMessage fontSize="sm">
                  {errors[field.name]}
                </FormErrorMessage>
              </FormControl>
            ))}

            {/* Submit Button */}
            <Button
              type="submit"
              colorScheme="blue"
              size={{ base: 'md', md: 'lg' }}
              width="100%"
              isLoading={loading}
              loadingText="Submitting..."
              mt={4}
            >
              {submitText}
            </Button>
          </VStack>
        </Box>

        {/* Links */}
        {links.length > 0 && (
          <VStack spacing={3}>
            <Divider />
            {links.map((link, index) => (
              <HStack key={index} spacing={1} justify="center">
                <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
                  {link.text}
                </Text>
                <NextLink href={link.href} passHref>
                  <Link 
                    color="blue.500" 
                    fontWeight="medium"
                    fontSize={{ base: 'sm', md: 'md' }}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {link.linkText}
                  </Link>
                </NextLink>
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default ResponsiveForm; 