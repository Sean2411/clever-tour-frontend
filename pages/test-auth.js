import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Code,
  Divider,
} from '@chakra-ui/react';

export default function TestAuth() {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // 检查localStorage中的认证数据
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    setAuthData({
      token: token ? token.substring(0, 50) + '...' : 'Not found',
      user: userData ? JSON.parse(userData) : 'Not found',
      hasToken: !!token,
      hasUser: !!userData
    });
  }, []);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'lucius2411@gmail.com',
          password: 'password123'
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 保存到localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: '登录成功',
          description: '认证数据已保存到localStorage',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // 更新显示
        setAuthData({
          token: data.token.substring(0, 50) + '...',
          user: data.user,
          hasToken: true,
          hasUser: true
        });
      } else {
        toast({
          title: '登录失败',
          description: data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: '错误',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const testAdminAPI = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: '错误',
        description: '请先登录',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/admin/attractions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'API测试成功',
          description: `获取到 ${data.attractions?.length || 0} 个景点`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'API测试失败',
          description: data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: '错误',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthData({
      token: 'Not found',
      user: 'Not found',
      hasToken: false,
      hasUser: false
    });
    toast({
      title: '已清除认证数据',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading>认证状态测试</Heading>
        
        <Box p={4} borderWidth={1} borderRadius="md">
          <Text fontWeight="bold" mb={2}>当前认证状态:</Text>
          <VStack align="start" spacing={2}>
            <Text>Token: {authData?.hasToken ? '✅ 存在' : '❌ 不存在'}</Text>
            <Text>用户数据: {authData?.hasUser ? '✅ 存在' : '❌ 不存在'}</Text>
            {authData?.user && typeof authData.user === 'object' && (
              <Box>
                <Text fontWeight="bold">用户信息:</Text>
                <Code p={2} display="block" whiteSpace="pre-wrap">
                  {JSON.stringify(authData.user, null, 2)}
                </Code>
              </Box>
            )}
          </VStack>
        </Box>

        <Divider />

        <VStack spacing={4}>
          <Button 
            colorScheme="blue" 
            onClick={testLogin} 
            isLoading={loading}
            loadingText="登录中..."
          >
            测试登录
          </Button>
          
          <Button 
            colorScheme="green" 
            onClick={testAdminAPI}
            isDisabled={!authData?.hasToken}
          >
            测试管理员API
          </Button>
          
          <Button 
            colorScheme="red" 
            onClick={clearAuth}
          >
            清除认证数据
          </Button>
        </VStack>

        <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <Text fontWeight="bold" mb={2}>使用说明:</Text>
          <VStack align="start" spacing={1}>
            <Text>1. 点击"测试登录"按钮进行登录</Text>
            <Text>2. 登录成功后，点击"测试管理员API"验证权限</Text>
            <Text>3. 如果API测试成功，说明认证配置正确</Text>
            <Text>4. 然后可以访问 /admin/manageAttractions 和 /admin/manageTours</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 