import { ChakraProvider, extendTheme, Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import '../styles/responsive.css';

// 扩展主题以包含Portal配置
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // 确保Portal容器存在
    if (typeof document !== 'undefined') {
      let portalContainer = document.getElementById('chakra-portal');
      if (!portalContainer) {
        portalContainer = document.createElement('div');
        portalContainer.id = 'chakra-portal';
        document.body.appendChild(portalContainer);
      }
    }
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}

export default MyApp; 