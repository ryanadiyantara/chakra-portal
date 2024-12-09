import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
  Td,
  Image,
  Input,
} from "@chakra-ui/react";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useEventStore } from "../store/event";
import { Link } from "react-router-dom";

const EventHistory = () => {
  // Utils
  const { events, fetchEvent } = useEventStore();

  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Services
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return (
    <>
      <Background />
      <Sidebar />

      <Box
        w={{
          base: "100%",
          xl: "calc(100% - 275px)",
        }}
        float="right"
        maxWidth="100%"
        overflow="auto"
        position="relative"
        maxHeight="100%"
        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        transitionDuration=".2s, .2s, .35s"
        transitionProperty="top, bottom, width"
        transitionTimingFunction="linear, linear, ease"
      >
        <Navbar />

        {/* Content */}
        <HStack
          flexDirection={{
            base: "column",
            xl: "row",
          }}
          justifyContent="space-between"
          px={{ base: "30px", xl: "40px" }}
          w="100%"
          spacing={{ base: "20px", xl: "30px" }}
          alignItems="start"
          minHeight="85vh"
        >
          {/* Table Data */}
          <VStack
            spacing={2}
            alignItems={"left"}
            w="100%"
            background="white"
            px={{ base: "10px", xl: "20px" }}
            py="20px"
            borderRadius="16px"
            bg={bgForm}
          >
            <Box overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
              <Box p="6px 0px 22px 0px">
                <Flex align="center" justify="space-between" p="0px">
                  <Text fontSize="xl" color={textColor} fontWeight="bold">
                    Event History
                  </Text>
                  <Flex align="center" justify="space-between" p="0px" gap="20px">
                    <Button
                      fontSize="xs"
                      as={Link}
                      to="/hr/manageevent"
                      variant="primary"
                      maxH="30px"
                      borderRadius="5px"
                    >
                      Manage Event
                    </Button>
                    {/* Search Input */}
                    <Box>
                      <Input
                        placeholder="Search on list..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        size="sm"
                        borderRadius="5px"
                        w="100%"
                      />
                    </Box>
                  </Flex>
                </Flex>
              </Box>
              <Box>
                <Table variant="simple" color={textColor}>
                  <Thead>
                    <Tr my=".8rem" pl="0px" color="gray.400">
                      <Th pl="0px" borderColor={borderColor} color="gray.400">
                        Poster
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Event Name
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Start Date
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        End Date
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Description
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {events
                      .filter((event) => !event.na)
                      .filter((event) => !event.del)
                      .filter((event) => {
                        const startDate = new Date(event.event_startDate);
                        const endDate = new Date(event.event_endDate);

                        const formattedStartDate = startDate
                          .toLocaleDateString("en-GB", {
                            weekday: "long",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                          .toLowerCase();

                        const formattedEndDate = endDate
                          .toLocaleDateString("en-GB", {
                            weekday: "long",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                          .toLowerCase();

                        return (
                          event.event_name.toLowerCase().includes(searchQuery) ||
                          formattedStartDate.includes(searchQuery.toLowerCase()) ||
                          formattedEndDate.includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery)
                        );
                      })
                      .sort((a, b) => new Date(a.event_startDate) - new Date(b.event_startDate))
                      .map((event) => (
                        <Tr key={event._id}>
                          <Td pl="0px" borderColor={borderColor} py={5}>
                            <Image
                              src={"/" + event.poster_path}
                              alt={event.poster_path}
                              boxSize="200px"
                              objectFit="cover"
                              borderRadius="lg"
                              width="200px"
                              height="100px"
                            />
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {event.event_name}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {new Date(event.event_startDate)
                                .toLocaleDateString("en-GB", {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                                .replace(" ", ", ")}
                            </Text>
                          </Td>

                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {new Date(event.event_endDate)
                                .toLocaleDateString("en-GB", {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                                .replace(" ", ", ")}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {event.description}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </VStack>
        </HStack>

        <Footer />
      </Box>
    </>
  );
};

export default EventHistory;
