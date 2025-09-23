import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  InputGroup,
  InputRightElement,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Flex,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { AdminOnly } from '../../components/ProtectedRoute';
import { api } from '../../lib/api';
import AdminCard from '../../components/AdminCard';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useTranslation } from 'react-i18next';

export default function ManageUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const toast = useToast();

  // Form state for adding new user
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'member'
  });

  // Form state for editing user
  const [editUser, setEditUser] = useState({
    username: '',
    email: '',
    role: 'member'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/admin/users');
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t('common.error'),
        description: t('admin.fetchUsersError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleAddUser = useCallback(async () => {
    try {
      const data = await api.post('/api/admin/users', newUser);
      toast({
        title: t('common.success'),
        description: t('admin.userCreatedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onAddClose();
      setNewUser({ username: '', email: '', password: '', role: 'member' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: t('common.error'),
        description: t('admin.createUserError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [newUser, toast, onAddClose, fetchUsers]);

  const handleEditUser = (user) => {
    // 检查当前用户是否为 admin
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.role !== 'admin') {
      toast({
        title: t('admin.accessDenied'),
        description: t('admin.adminOnlyEdit'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedUser(user);
    setEditUser({
      username: user.username,
      email: user.email,
      role: user.role
    });
    onViewOpen();
  };

  const handleUpdateUser = useCallback(async () => {
    if (!selectedUser) return;

    try {
      await api.put(`/api/admin/users/${selectedUser.id}`, editUser);
      toast({
        title: t('common.success'),
        description: t('admin.userUpdatedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onViewClose();
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: t('common.error'),
        description: t('admin.updateUserError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [selectedUser, editUser, toast, onViewClose, fetchUsers]);

  const handleDeleteUser = async () => {
    if (!deleteUser) return;

    try {
      await api.delete(`/api/admin/users/${deleteUser.id}`);
      toast({
        title: t('common.success'),
        description: t('admin.userDeletedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      setDeleteUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: t('common.error'),
        description: t('admin.deleteUserError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'agent':
        return 'orange';
      case 'member':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return t('admin.roleAdmin');
      case 'agent':
        return t('admin.roleAgent');
      case 'member':
        return t('admin.roleMember');
      default:
        return t('admin.roleUser');
    }
  };

  // Define fields for AdminCard
  const userFields = [
    { key: 'username', label: 'Username', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Role', type: 'badge' },
  ];

  const canDeleteUser = (user) => {
    return user.username !== 'lucius2411';
  };

  if (loading) {
    return (
      <AdminOnly>
        <Layout>
          <Box display="flex" justify="center" align="center" minH="60vh">
            <Spinner size="xl" />
          </Box>
        </Layout>
      </AdminOnly>
    );
  }

  return (
    <AdminOnly>
      <Head>
        <title>{t('admin.manageUsers')} - Clever Tour</title>
        <meta name="description" content={t('admin.manageUsersDescription')} />
      </Head>

      <Layout>
        <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          <VStack spacing={4} align="stretch">
            <Heading 
              size={{ base: "lg", md: "xl" }}
              textAlign={{ base: "center", md: "left" }}
            >
              {t('admin.manageUsers')}
            </Heading>
            <Button 
              leftIcon={<AddIcon />} 
              colorScheme="blue" 
              onClick={onAddOpen}
              size={{ base: "md", md: "lg" }}
              width={{ base: "100%", md: "auto" }}
            >
              {t('admin.addUser')}
            </Button>
          </VStack>

          {/* Search Bar */}
          <Box>
            <HStack spacing={{ base: 2, md: 4 }}>
              <Input
                placeholder={t('admin.searchUsers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={{ base: "md", md: "lg" }}
                fontSize={{ base: "sm", md: "md" }}
              />
              <SearchIcon color="gray.400" />
            </HStack>
          </Box>

          {/* Users Cards */}
          <Box>
            <ResponsiveGrid columns={{ base: 1, md: 1 }} spacing={{ base: 4, md: 6 }}>
              {filteredUsers.map((user) => (
                <AdminCard
                  key={user.id}
                  item={{
                    ...user,
                    role: getRoleLabel(user.role),
                    createdAt: new Date(user.createdAt).toLocaleDateString()
                  }}
                  fields={[
                    { key: 'username', label: t('admin.username'), type: 'text' },
                    { key: 'email', label: t('admin.email'), type: 'text' },
                    { key: 'role', label: t('admin.role'), type: 'badge', colorScheme: getRoleColor(user.role) },
                    { key: 'createdAt', label: t('admin.created'), type: 'text' },
                  ]}
                  onEdit={handleEditUser}
                  onDelete={canDeleteUser(user) ? () => {
                    setDeleteUser(user);
                    onDeleteOpen();
                  } : null}
                  actions={canDeleteUser(user)}
                />
              ))}
            </ResponsiveGrid>
          </Box>

          <Text 
            color="gray.600" 
            fontSize={{ base: "sm", md: "md" }}
            textAlign={{ base: "center", md: "left" }}
          >
            {t('admin.totalUsers')}: {filteredUsers.length}
          </Text>
        </VStack>
        </Container>

        {/* Add User Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('admin.addNewUser')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                <FormLabel>{t('admin.username')}</FormLabel>
                <Input
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder={t('admin.enterUsername')}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('admin.email')}</FormLabel>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder={t('admin.enterEmail')}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('admin.password')}</FormLabel>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder={t('admin.enterPassword')}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('admin.role')}</FormLabel>
                <Select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="member">{t('admin.member')}</option>
                  <option value="agent">{t('admin.agent')}</option>
                  <option value="admin">{t('admin.admin')}</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="blue" onClick={handleAddUser}>
              {t('admin.addUser')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit User Details Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('admin.editUserDetails')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" color="gray.600">{t('admin.userId')}</Text>
                  <Text>{selectedUser.id}</Text>
                </Box>
                
                <FormControl isRequired>
                  <FormLabel>{t('admin.username')}</FormLabel>
                  <Input
                    value={editUser.username}
                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                    placeholder={t('admin.enterUsername')}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('admin.email')}</FormLabel>
                  <Input
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    placeholder={t('admin.enterEmail')}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('admin.role')}</FormLabel>
                  <Select
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  >
                    <option value="member">{t('admin.roleMember')}</option>
                    <option value="agent">{t('admin.roleAgent')}</option>
                    <option value="admin">{t('admin.roleAdmin')}</option>
                  </Select>
                </FormControl>

                <Box>
                  <Text fontWeight="bold" color="gray.600">{t('admin.createdAt')}</Text>
                  <Text>{new Date(selectedUser.createdAt).toLocaleString()}</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onViewClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="blue" onClick={handleUpdateUser}>
              {t('admin.updateUser')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete User Confirmation */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('admin.deleteUser')}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t('admin.deleteUserConfirm', { username: deleteUser?.username })}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" onClick={handleDeleteUser} ml={3}>
                {t('common.delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      </Layout>
    </AdminOnly>
  );
} 