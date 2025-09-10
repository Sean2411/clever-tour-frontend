import {
  List,
  ListItem,
  ListIcon,
  Text,
  VStack,
  Card,
  CardBody,
  Heading,
  Box
} from '@chakra-ui/react';
import { CheckIcon, TimeIcon, InfoIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt, FaUsers, FaUserFriends } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// 动态导入Tabs组件
const DynamicTabs = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.Tabs })), { ssr: false });
const DynamicTabList = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.TabList })), { ssr: false });
const DynamicTabPanels = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.TabPanels })), { ssr: false });
const DynamicTab = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.Tab })), { ssr: false });
const DynamicTabPanel = dynamic(() => import('@chakra-ui/react').then(mod => ({ default: mod.TabPanel })), { ssr: false });

export default function TourTabs({ tour }) {
  return (
    <DynamicTabs>
      <DynamicTabList>
        <DynamicTab>Highlights</DynamicTab>
        <DynamicTab>Itinerary</DynamicTab>
        <DynamicTab>Cost Details</DynamicTab>
        <DynamicTab>Booking Info</DynamicTab>
      </DynamicTabList>

      <DynamicTabPanels>
        <DynamicTabPanel>
          <List spacing={3}>
            {tour.highlights && tour.highlights.length > 0 ? (
              tour.highlights.map((highlight, index) => (
                <ListItem key={index}>
                  <ListIcon as={CheckIcon} color="green.500" />
                  {highlight}
                </ListItem>
              ))
            ) : (
              <Text color="gray.500">No highlights available</Text>
            )}
          </List>
        </DynamicTabPanel>

        <DynamicTabPanel>
          <VStack spacing={6} align="stretch">
            {tour.itinerary && tour.itinerary.length > 0 ? (
              tour.itinerary.map((day, index) => (
                <Card key={index}>
                  <CardBody>
                    <Heading size="md" mb={4}>
                      Day {day.day}: {day.title}
                    </Heading>
                    <Text mb={4}>{day.description}</Text>
                    <List spacing={2}>
                      {day.activities && day.activities.length > 0 ? (
                        day.activities.map((activity, i) => (
                          <ListItem key={i}>
                            <ListIcon as={TimeIcon} color="blue.500" />
                            {activity}
                          </ListItem>
                        ))
                      ) : (
                        <Text color="gray.500">No activities listed</Text>
                      )}
                    </List>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Text color="gray.500">No itinerary available</Text>
            )}
          </VStack>
        </DynamicTabPanel>

        <DynamicTabPanel>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" mb={4}>What's Included</Heading>
              <List spacing={3}>
                {tour.includes && tour.includes.length > 0 ? (
                  tour.includes.map((item, index) => (
                    <ListItem key={index}>
                      <ListIcon as={CheckIcon} color="green.500" />
                      {item}
                    </ListItem>
                  ))
                ) : (
                  <Text color="gray.500">No inclusions listed</Text>
                )}
              </List>
            </Box>

            <Box>
              <Heading size="md" mb={4}>What's Not Included</Heading>
              <List spacing={3}>
                {tour.excludes && tour.excludes.length > 0 ? (
                  tour.excludes.map((item, index) => (
                    <ListItem key={index}>
                      <ListIcon as={InfoIcon} color="red.500" />
                      {item}
                    </ListItem>
                  ))
                ) : (
                  <Text color="gray.500">No exclusions listed</Text>
                )}
              </List>
            </Box>
          </VStack>
        </DynamicTabPanel>

        <DynamicTabPanel>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" mb={4}>Booking Information</Heading>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={FaMapMarkerAlt} color="blue.500" />
                  Departure City: {tour.departureCity || 'Not specified'}
                </ListItem>
                <ListItem>
                  <ListIcon as={FaUsers} color="blue.500" />
                  Maximum Group Size: {tour.maxGroupSize || 'Not specified'} people
                </ListItem>
                <ListItem>
                  <ListIcon as={FaUserFriends} color="blue.500" />
                  Minimum Age Requirement: {tour.minAge || 'Not specified'} years
                </ListItem>
              </List>
            </Box>
          </VStack>
        </DynamicTabPanel>
      </DynamicTabPanels>
    </DynamicTabs>
  );
} 