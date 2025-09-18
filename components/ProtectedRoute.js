import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

export default function ProtectedRoute({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  fallback = null 
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('🔍 ProtectedRoute - Token exists:', !!token);
      console.log('🔍 ProtectedRoute - User data exists:', !!userData);
      
      if (!token || !userData) {
        console.log('❌ ProtectedRoute - Missing token or user data, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        console.log('ProtectedRoute - User data:', parsedUser);
        console.log('ProtectedRoute - Required role:', requiredRole);
        console.log('ProtectedRoute - Required permission:', requiredPermission);
        setUser(parsedUser);
        
        // Check role-based access
        if (requiredRole) {
          console.log('ProtectedRoute - Checking role access:', parsedUser.role, 'vs', requiredRole);
          console.log('ProtectedRoute - User object:', parsedUser);
          if (parsedUser.role !== requiredRole && parsedUser.role !== 'admin') {
            console.log('ProtectedRoute - Role access denied');
            setHasAccess(false);
            setLoading(false);
            return;
          }
        }
        
        // Check permission-based access
        if (requiredPermission) {
          console.log('ProtectedRoute - Checking permission:', requiredPermission, '=', parsedUser.permissions?.[requiredPermission]);
          if (!parsedUser.permissions?.[requiredPermission]) {
            console.log('ProtectedRoute - Permission access denied');
            setHasAccess(false);
            setLoading(false);
            return;
          }
        }
        
        console.log('ProtectedRoute - Access granted');
        setHasAccess(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
        return;
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router, requiredRole, requiredPermission]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Checking permissions...</Text>
        </VStack>
      </Box>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold" color="red.500">
            Access Denied
          </Text>
          <Text color="gray.600">
            You don&apos;t have permission to access this page.
          </Text>
        </VStack>
      </Box>
    );
  }

  return children;
}

// Higher-order component for admin-only pages
export function AdminOnly({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

// Higher-order component for agent and admin pages
export function AgentOrAdmin({ children }) {
  return (
    <ProtectedRoute 
      requiredPermission="canManageBookings"
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
          <VStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold" color="red.500">
              Access Denied
            </Text>
            <Text color="gray.600">
              This page is only accessible to agents and administrators.
            </Text>
          </VStack>
        </Box>
      }
    >
      {children}
    </ProtectedRoute>
  );
} 