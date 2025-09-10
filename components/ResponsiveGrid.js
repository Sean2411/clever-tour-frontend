import { SimpleGrid, Box } from '@chakra-ui/react';

const ResponsiveGrid = ({ 
  children, 
  columns = { base: 1, md: 2, lg: 3, xl: 4 },
  spacing = { base: 4, md: 6, lg: 8 },
  ...props 
}) => {
  return (
    <SimpleGrid 
      columns={columns}
      spacing={spacing}
      {...props}
    >
      {children}
    </SimpleGrid>
  );
};

export default ResponsiveGrid; 