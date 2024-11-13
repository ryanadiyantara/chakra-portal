import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  useColorModeValue,
  VStack,
  Td,
  Image,
} from "@chakra-ui/react";
import { FaPen, FaTrash } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useEventStore } from "../store/event";

const ManageEvent = () => {
  // BE
  const { events, createEvent, fetchEvent, updateEvent, deleteEvent } = useEventStore();

  const [newEvent, setNewEvent] = useState({
    event_name: "",
    poster: "",
    event_startDate: "",
    event_endDate: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  const handleSubmit = async () => {
    if (isEditing && editingEventId) {
      // Update event
      const { success, message } = await updateEvent(editingEventId, newEvent);
      if (success) {
        toast({
          title: "Success",
          description: "Event updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
      setIsEditing(false);
      setEditingEventId(null);
    } else {
      // Create new event
      const { success, message } = await createEvent(newEvent);
      if (success) {
        toast({
          title: "Success",
          description: message,
          status: "success",
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
    }
    setNewEvent({
      event_name: "",
      poster: "",
      event_startDate: "",
      event_endDate: "",
      description: "",
    });
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleEditClick = (event) => {
    setNewEvent({
      event_name: event.event_name,
      poster: event.poster,
      event_startDate: formatDate(event.event_startDate),
      event_endDate: formatDate(event.event_endDate),
      description: event.description,
    });
    setIsEditing(true);
    setEditingEventId(event._id);
  };

  const handleCancelEdit = () => {
    setNewEvent({ event_name: "" });
    setIsEditing(false);
    setEditingEventId(null);
  };

  const handleDeleteEvent = async (pid) => {
    const { success, message } = await deleteEvent(pid);
    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "event_endDate" && new Date(value) < new Date(newEvent.event_startDate)) {
      alert("End Date cannot be before Start Date");
      return;
    }
    setNewEvent({ ...newEvent, [name]: value });
  };

  // FE
  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");

  return (
    <>
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
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Event List
                </Text>
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
                        Event Date
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Description
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Action
                      </Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {events.map((event) => (
                      <Tr key={event._id}>
                        <Td pl="0px" borderColor={borderColor} py={5}>
                          <Image
                            // src="/uploads/event/shenhe.png" read public folder
                            src={event.poster}
                            alt={event.poster}
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
                              .replace(" ", ", ")}{" "}
                            {" - "}
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

                        {/* Action */}
                        <Td borderColor={borderColor}>
                          <Flex direction="row" p="0px" alignItems="center" gap="4">
                            {/* Button for Edit */}
                            <Flex
                              alignItems="center"
                              gap="1"
                              as="button"
                              onClick={() => handleEditClick(event)}
                            >
                              <FaPen size="14" color={textColor} />
                              <Text fontSize="14px" color={textColor} fontWeight="bold">
                                EDIT
                              </Text>
                            </Flex>

                            {/* Button for Delete */}
                            <Flex
                              alignItems="center"
                              gap="1"
                              as="button"
                              onClick={() => handleDeleteEvent(event._id)}
                            >
                              <FaTrash size="14" color="#E53E3E" />
                              <Text fontSize="14px" color="#E53E3E" fontWeight="bold">
                                DELETE
                              </Text>
                            </Flex>
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </VStack>

          {/* Input Form */}
          <VStack w="400px">
            <Flex alignItems="center" justifyContent="center" mb="60px">
              <Flex
                direction="column"
                w="400px"
                background="transparent"
                borderRadius="15px"
                p="40px"
                bg={bgForm}
              >
                <Text fontSize="xl" color={textColor} fontWeight="bold" mb="22px">
                  {isEditing ? "Edit Event" : "Add New Event"}
                </Text>
                <FormControl>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Event Name
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="text"
                    mb="24px"
                    size="lg"
                    placeholder="Event name"
                    name="event_name"
                    value={newEvent.event_name}
                    onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Poster
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="text"
                    mb="24px"
                    size="lg"
                    placeholder="Poster"
                    name="poster"
                    value={newEvent.poster}
                    onChange={(e) => setNewEvent({ ...newEvent, poster: e.target.value })}
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Start Date
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="date"
                    mb="24px"
                    size="lg"
                    placeholder="Start Date"
                    name="event_startDate"
                    value={newEvent.event_startDate}
                    onChange={handleDateChange}
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    End Date
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="date"
                    mb="24px"
                    size="lg"
                    placeholder="End Date"
                    name="event_endDate"
                    value={newEvent.event_endDate}
                    onChange={handleDateChange}
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Description
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="text"
                    mb="24px"
                    size="lg"
                    placeholder="Description"
                    name="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />

                  <Button
                    fontSize="14px"
                    variant="dark"
                    fontWeight="bold"
                    w="100%"
                    h="45"
                    mt="24px"
                    onClick={handleSubmit}
                  >
                    {isEditing ? "Update" : "Submit"}
                  </Button>
                  {isEditing && (
                    <Button
                      fontSize="14px"
                      variant="solid"
                      fontWeight="bold"
                      w="100%"
                      h="45"
                      mt="4"
                      onClick={handleCancelEdit}
                      colorScheme="gray"
                    >
                      Cancel
                    </Button>
                  )}
                </FormControl>
              </Flex>
            </Flex>
          </VStack>
        </HStack>

        <Footer />
      </Box>
    </>
  );
};

export default ManageEvent;
