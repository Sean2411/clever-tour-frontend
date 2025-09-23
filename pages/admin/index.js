import { Box, Container, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { AdminOnly } from '../../components/ProtectedRoute';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { t } = useTranslation();
  return (
    <AdminOnly>
      <Head>
        <title>{t('admin.dashboardTitle')} - Clever Tour</title>
        <meta name="description" content={t('admin.dashboardDescription')} />
      </Head>

      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading>{t('admin.dashboardTitle')}</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Stat>
              <StatLabel>{t('admin.totalUsers')}</StatLabel>
              <StatNumber>1,234</StatNumber>
              <StatHelpText>{t('admin.allRegisteredUsers')}</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>{t('admin.totalBookings')}</StatLabel>
              <StatNumber>567</StatNumber>
              <StatHelpText>{t('admin.allTimeBookings')}</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>{t('admin.revenue')}</StatLabel>
              <StatNumber>$12,345</StatNumber>
              <StatHelpText>{t('admin.thisMonth')}</StatHelpText>
            </Stat>
          </SimpleGrid>

          <Box>
            <Heading size="md" mb={4}>{t('admin.quickActions')}</Heading>
            <Text>{t('admin.dashboardContent')}</Text>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </AdminOnly>
  );
} 