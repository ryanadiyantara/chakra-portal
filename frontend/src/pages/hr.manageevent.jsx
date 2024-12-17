import React, { useState, useEffect } from "react";
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

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CustomModal from "../components/Modal";
import Footer from "../components/Footer";

import { useEventStore } from "../store/event";
import { Link } from "react-router-dom";

const ManageEvent = () => {
  // Utils
  const { events, createEvent, fetchEvent, updateEvent, deleteEvent } = useEventStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");

  const [searchQuery, setSearchQuery] = useState("");
  const [newEvent, setNewEvent] = useState({
    event_name: "",
    poster: "",
    event_startDate: "",
    event_endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedEventName, setSelectedEventName] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedType = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (file) {
      const fileTypeValid = allowedType.some((type) => file.type === type);
      if (!fileTypeValid) {
        toast({
          title: "Error",
          description: "The file must be in JPG, JPEG, or PNG format.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        e.target.value = "";
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "The file size must not exceed 5 MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        e.target.value = "";
        return;
      }

      setNewEvent({ ...newEvent, poster: file });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "event_endDate" && new Date(value) < new Date(newEvent.event_startDate)) {
      toast({
        title: "Error",
        description: "End Date cannot be before Start Date.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      e.target.value = "";
      return;
    }
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleEditClick = (event) => {
    setNewEvent({
      event_name: event.event_name,
      poster: event.poster_path,
      event_startDate: formatDate(event.event_startDate),
      event_endDate: formatDate(event.event_endDate),
      description: event.description,
    });
    setErrors({});
    setIsEditing(true);
    setEditingEventId(event._id);
  };

  const handleCancelEdit = () => {
    setNewEvent({
      event_name: "",
      poster: "",
      event_startDate: "",
      event_endDate: "",
      description: "",
    });
    document.querySelector('input[type="file"]').value = "";
    setErrors({});
    setIsEditing(false);
    setEditingEventId(null);
  };

  const openDeleteModal = (name) => {
    setSelectedEventName(name);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
    setSelectedEventName(null);
  };

  // Services
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleSubmit = async () => {
    const currentErrors = {
      event_name: !newEvent.event_name,
      poster: !newEvent.poster,
      event_startDate: !newEvent.event_startDate,
      event_endDate: !newEvent.event_endDate,
      description: !newEvent.description,
    };

    setErrors(currentErrors);

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
        setIsEditing(false);
        setEditingEventId(null);
        setNewEvent({
          event_name: "",
          poster: "",
          event_startDate: "",
          event_endDate: "",
          description: "",
        });
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
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
        setNewEvent({
          event_name: "",
          poster: "",
          event_startDate: "",
          event_endDate: "",
          description: "",
        });
        document.querySelector('input[type="file"]').value = "";
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteEvent = async (pid) => {
    if (!selectedEventName) return;

    if (inputValue !== selectedEventName) {
      toast({
        title: "Error",
        description: "Input does not match the event name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await deleteEvent(pid);
    if (success) {
      toast({
        title: "Success",
        description: "Event deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
      setInputValue("");
      setSelectedEventName(null);
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
                    Event List
                  </Text>
                  <Flex align="center" justify="space-between" p="0px" gap="20px">
                    <Button
                      fontSize="xs"
                      as={Link}
                      to="/hr/eventhistory"
                      variant="primary"
                      maxH="30px"
                      borderRadius="5px"
                    >
                      Event History
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
                      <Th borderColor={borderColor} color="gray.400">
                        Action
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
                      .filter((event) => new Date(event.event_startDate) > new Date())
                      .sort((a, b) => new Date(a.event_startDate) - new Date(b.event_startDate))
                      .map((event) => (
                        <Tr
                          key={event._id}
                          _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
                        >
                          <Td pl="0px" borderColor={borderColor} py={5}>
                            <Box
                              width="200px"
                              height="100px"
                              position="relative"
                              borderRadius="lg"
                              overflow="hidden"
                            >
                              <Image
                                src={"/public/uploads/" + event.poster_path}
                                alt={event.poster_path}
                                layout="fill"
                                objectFit="cover"
                              />
                            </Box>
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
                          <Td borderColor={borderColor}>
                            <Flex direction="row" p="0px" alignItems="center" gap="4">
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => handleEditClick(event)}
                              >
                                <FaPen size="14" color={iconColor} />
                                <Text fontSize="14px" color={textColor} fontWeight="bold">
                                  EDIT
                                </Text>
                              </Flex>
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => openDeleteModal(event.event_name)}
                              >
                                <FaTrash size="14" color="#E53E3E" />
                                <Text fontSize="14px" color="#E53E3E" fontWeight="bold">
                                  DELETE
                                </Text>
                              </Flex>
                              {/* Modal Delete */}
                              <CustomModal
                                isOpen={isOpen}
                                onClose={handleClose}
                                title="Delete Event"
                                bodyContent={
                                  <p>
                                    To delete a event named{" "}
                                    <span style={{ fontWeight: "bold" }}>{selectedEventName}</span>,
                                    type the name to confirm.
                                  </p>
                                }
                                modalBgColor="blackAlpha.800"
                                modalBackdropFilter="blur(2px)"
                                inputValue={inputValue}
                                onInputChange={(e) => setInputValue(e.target.value)}
                                onConfirm={() => handleDeleteEvent(event._id)}
                              />
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
                    borderColor={errors.event_name ? "red.500" : "gray.200"}
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Poster
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="file"
                    size="lg"
                    name="poster"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 12px",
                    }}
                    onChange={handleFileChange}
                    borderColor={errors.poster ? "red.500" : "gray.200"}
                  />
                  <Text fontSize="xs" color="red.500" ms="4px" fontStyle="italic">
                    * Accepted file types: JPG, JPEG, PNG.
                  </Text>
                  <Text fontSize="xs" color="red.500" ms="4px" mb="24px" fontStyle="italic">
                    * Recommended aspect ratio: 2:1.
                  </Text>
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
                    borderColor={errors.event_startDate ? "red.500" : "gray.200"}
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
                    borderColor={errors.event_endDate ? "red.500" : "gray.200"}
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
                    borderColor={errors.description ? "red.500" : "gray.200"}
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
