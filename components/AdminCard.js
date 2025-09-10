import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Image,
  IconButton,
  Tooltip,
  useBreakpointValue,
  Flex,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ChevronDownIcon } from '@chakra-ui/icons';

const AdminCard = ({
  item,
  onEdit,
  onDelete,
  onStatusChange,
  currentStatus,
  availableStatuses = [],
  fields = [],
  imageField = 'image',
  nameField = 'name',
  statusField = 'status',
  getStatusColor = () => 'blue',
  actions = true,
  showStatusChange = false,
  ...props
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const renderField = (field) => {
    const value = item[field.key];
    
    if (field.type === 'header') {
      return (
        <Text 
          fontSize="sm" 
          fontWeight="bold" 
          color="gray.700"
        >
          {value}
        </Text>
      );
    }
    
    if (field.type === 'badge') {
      return (
        <Badge colorScheme={field.colorScheme || 'blue'} fontSize="xs">
          {value}
        </Badge>
      );
    }
    
    if (field.type === 'status') {
      // 检查是否为表头
      const isStatusHeader = value === 'Status';
      return (
        <Badge colorScheme={getStatusColor(value)} fontSize="xs">
          {value}
        </Badge>
      );
    }
    
    if (field.type === 'price') {
      // 检查是否为表头
      const isPriceHeader = value === 'Total Price';
      return (
        <Text 
          fontWeight="bold" 
          color={isPriceHeader ? "gray.700" : "blue.500"} 
          fontSize="sm"
        >
          {isPriceHeader ? value : `$${value}`}
        </Text>
      );
    }
    
    if (field.type === 'image') {
      return (
        <Box
          w="60px"
          h="40px"
          borderRadius="md"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
          flexShrink={0}
        >
          {value ? (
            <Image
              src={value}
              alt={item[nameField]}
              w="100%"
              h="100%"
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/60x40?text=No+Image"
            />
          ) : (
            <Box
              w="100%"
              h="100%"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              color="gray.500"
            >
              No Image
            </Box>
          )}
        </Box>
      );
    }
    
    // 检查是否为表头文本类型字段
    const isTextHeader = ['Booking Number', 'Attraction', 'Customer', 'Date', 'People'].includes(value);
    
    return (
      <Text 
        fontSize="sm" 
        color={isTextHeader ? "gray.700" : "gray.600"} 
        fontWeight={isTextHeader ? "bold" : "normal"}
        whiteSpace="pre-line" 
        noOfLines={3}
      >
        {value}
      </Text>
    );
  };

  if (isMobile) {
    // Mobile card layout
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        bg="white"
        shadow="sm"
        _hover={{ shadow: 'md' }}
        transition="all 0.2s"
        {...props}
      >
        <VStack spacing={3} align="stretch">
          {/* Header with image and name */}
          <HStack spacing={3} align="start">
            {fields.find(f => f.key === imageField) && (
              renderField({ key: imageField, type: 'image' })
            )}
            <VStack align="start" spacing={1} flex={1}>
              <Text fontWeight="bold" fontSize="md" noOfLines={2}>
                {item[nameField]}
              </Text>
              {fields.find(f => f.key === statusField) && (
                renderField({ key: statusField, type: 'status' })
              )}
            </VStack>
          </HStack>

          <Divider />

          {/* Fields */}
          <VStack spacing={2} align="stretch">
            {fields
              .filter(field => field.key !== imageField && field.key !== nameField && field.key !== statusField)
              .map((field, index) => (
                <HStack key={index} justify="space-between" align="start">
                  <Text fontSize="xs" color="gray.500" fontWeight="medium" minW="80px">
                    {field.label}:
                  </Text>
                  <Box flex={1} textAlign="right">
                    {renderField(field)}
                  </Box>
                </HStack>
              ))}
          </VStack>

          {/* Actions */}
          {actions && (
            <>
              <Divider />
              <HStack justify="space-between" pt={2}>
                <Text fontSize="xs" color="gray.500">
                  ID: {item.id}
                </Text>
                                <HStack spacing={2}>
                  {onEdit && (
                    <Tooltip label="View Details">
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        aria-label="View Details"
                      />
                    </Tooltip>
                  )}
                  {showStatusChange && onStatusChange && (
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<ChevronDownIcon />}
                        colorScheme="green"
                        variant="ghost"
                        size="sm"
                        aria-label="Change Status"
                      />
                      <MenuList>
                        {availableStatuses.map((status) => (
                          <MenuItem
                            key={status}
                            onClick={() => onStatusChange(status)}
                            isDisabled={status === currentStatus}
                            color={status === currentStatus ? 'gray.400' : 'inherit'}
                          >
                            {status === 'confirmed' ? 'Confirm' : 
                             status === 'cancelled' ? 'Cancel' : 
                             status.charAt(0).toUpperCase() + status.slice(1)}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  )}
                  {!showStatusChange && onDelete && (
                    <Tooltip label="Delete">
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item)}
                        aria-label="Delete"
                      />
                    </Tooltip>
                  )}
                </HStack>
              </HStack>
            </>
          )}
        </VStack>
      </Box>
    );
  }

  // Desktop table row layout
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      bg="white"
      shadow="sm"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
      {...props}
    >
      <HStack spacing={4} align="center">
        {fields.map((field, index) => (
          <Box key={index} flex={field.flex || 1} minW="80px">
            {renderField(field)}
          </Box>
        ))}
        {actions && (
          <HStack spacing={2} flexShrink={0}>
            {onEdit && (
              <Tooltip label="View Details">
                <IconButton
                  icon={<EditIcon />}
                  colorScheme="blue"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  aria-label="View Details"
                />
              </Tooltip>
            )}
            {showStatusChange && onStatusChange && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<ChevronDownIcon />}
                  colorScheme="green"
                  variant="ghost"
                  size="sm"
                  aria-label="Change Status"
                />
                <MenuList>
                  {availableStatuses.map((status) => (
                    <MenuItem
                      key={status}
                      onClick={() => onStatusChange(status)}
                      isDisabled={status === currentStatus}
                      color={status === currentStatus ? 'gray.400' : 'inherit'}
                    >
                      {status === 'confirmed' ? 'Confirm' : 
                       status === 'cancelled' ? 'Cancel' : 
                       status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )}
            {!showStatusChange && onDelete && (
              <Tooltip label="Delete">
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item)}
                  aria-label="Delete"
                />
              </Tooltip>
            )}
          </HStack>
        )}
      </HStack>
    </Box>
  );
};

export default AdminCard; 