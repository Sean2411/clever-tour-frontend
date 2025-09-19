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

export default function ManageUsers() {
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
        title: 'Error',
        description: 'Failed to fetch users',
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
        title: 'Success',
        description: 'User created successfully',
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
        title: 'Error',
        description: 'Failed to create user',
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
        title: 'Access Denied',
        description: 'Only admin users can edit user details',
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
        title: 'Success',
        description: 'User updated successfully',
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
        title: 'Error',
        description: 'Failed to update user',
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
        title: 'Success',
        description: 'User deleted successfully',
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
        title: 'Error',
        description: 'Failed to delete user',
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
        return 'Admin';
      case 'agent':
        return 'Agent';
      case 'member':
        return 'Member';
      default:
        return 'User';
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
        <title>Manage Users - Clever Tour</title>
        <meta name="description" content="Manage users for administrators" />
      </Head>

      <Layout>
        <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          <VStack spacing={4} align="stretch">
            <Heading 
              size={{ base: "lg", md: "xl" }}
              textAlign={{ base: "center", md: "left" }}
            >
              Manage Users
            </Heading>
            <Button 
              leftIcon={<AddIcon />} 
              colorScheme="blue" 
              onClick={onAddOpen}
              size={{ base: "md", md: "lg" }}
              width={{ base: "100%", md: "auto" }}
            >
              Add User
            </Button>
          </VStack>

          {/* Search Bar */}
          <Box>
            <HStack spacing={{ base: 2, md: 4 }}>
              <Input
                placeholder="Search users by username, email, or role..."
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
                    { key: 'username', label: 'Username', type: 'text' },
                    { key: 'email', label: 'Email', type: 'text' },
                    { key: 'role', label: 'Role', type: 'badge', colorScheme: getRoleColor(user.role) },
                    { key: 'createdAt', label: 'Created', type: 'text' },
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
            Total users: {filteredUsers.length}
          </Text>
        </VStack>
        </Container>

        {/* Add User Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="member">Member</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddUser}>
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit User Details Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" color="gray.600">User ID</Text>
                  <Text>{selectedUser.id}</Text>
                </Box>
                
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={editUser.username}
                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                    placeholder="Enter username"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  >
                    <option value="member">Member</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </Select>
                </FormControl>

                <Box>
                  <Text fontWeight="bold" color="gray.600">Created At</Text>
                  <Text>{new Date(selectedUser.createdAt).toLocaleString()}</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onViewClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpdateUser}>
              Update User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete User Confirmation */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete user &quot;{deleteUser?.username}&quot;? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteUser} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      </Layout>
    </AdminOnly>
  );
} 