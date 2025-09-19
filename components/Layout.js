import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, showNavbar = true, showFooter = true }) {
  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      {showNavbar && <Navbar />}
      <Box flex="1">
        {children}
      </Box>
      {showFooter && <Footer />}
    </Box>
  );
}
