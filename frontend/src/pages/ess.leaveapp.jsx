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
  Select,
  Badge,
} from "@chakra-ui/react";
import { FaAddressBook, FaDochub, FaFile, FaPen, FaTrash } from "react-icons/fa";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useLeaveAppStore } from "../store/leaveapp";

const LeaveApp = () => {
  // Utils
  const { leaveapps, currentUser, createLeaveApp, fetchLeaveApp, updateLeaveApp, deleteLeaveApp } =
    useLeaveAppStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");

  const statusColors = {
    Approved: "green.400",
    Pending: "#ED8936",
    Rejected: "#E53E3E",
  };

  const [searchQuery, setSearchQuery] = useState("");

  const [newLeaveApp, setNewLeaveApp] = useState({
    leave_startDate: "",
    leave_endDate: "",
    type: "",
    attachment: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingLeaveAppId, setEditingLeaveAppId] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedType = "application/pdf";
    const maxSize = 5 * 1024 * 1024;

    if (file) {
      if (file.type !== allowedType) {
        toast({
          title: "Error",
          description: "The file must be in PDF format.",
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

      setNewLeaveApp({ ...newLeaveApp, attachment: file });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "leave_endDate" && new Date(value) < new Date(newLeaveApp.leave_startDate)) {
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
    setNewLeaveApp({ ...newLeaveApp, [name]: value });
  };

  const handleEditClick = (leaveapp) => {
    setNewLeaveApp({
      leave_startDate: formatDate(leaveapp.leave_startDate),
      leave_endDate: formatDate(leaveapp.leave_endDate),
      type: leaveapp.type,
      attachment: leaveapp.attachment,
    });
    setErrors({});
    setIsEditing(true);
    setEditingLeaveAppId(leaveapp._id);
  };

  const handleCancelEdit = () => {
    setNewLeaveApp({
      leave_startDate: "",
      leave_endDate: "",
      type: "",
      attachment: "",
    });
    document.querySelector('input[type="file"]').value = "";
    setErrors({});
    setIsEditing(false);
    setEditingLeaveAppId(null);
  };

  // Services
  useEffect(() => {
    fetchLeaveApp();
  }, [fetchLeaveApp]);

  const handleSubmit = async () => {
    const currentErrors = {
      leave_startDate: !newLeaveApp.leave_startDate,
      leave_endDate: !newLeaveApp.leave_endDate,
      type: !newLeaveApp.type,
    };
    setErrors(currentErrors);

    const currentId = currentUser.user_id;

    if (isEditing && editingLeaveAppId) {
      // Update leave app
      const { success, message } = await updateLeaveApp(editingLeaveAppId, newLeaveApp);
      if (success) {
        toast({
          title: "Success",
          description: "Leave Application updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        setEditingLeaveAppId(null);
        setNewLeaveApp({
          leave_startDate: "",
          leave_endDate: "",
          type: "",
          attachment: "",
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
      // Create new leave app
      const { success, message } = await createLeaveApp(newLeaveApp, currentId);
      if (success) {
        toast({
          title: "Success",
          description: message,
          status: "success",
          isClosable: true,
        });
        setNewLeaveApp({
          leave_startDate: "",
          leave_endDate: "",
          type: "",
          attachment: "",
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
                    Leave Application History
                  </Text>
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
              </Box>
              <Box>
                <Table variant="simple" color={textColor}>
                  <Thead>
                    <Tr my=".8rem" pl="0px" color="gray.400">
                      <Th pl="0px" borderColor={borderColor} color="gray.400">
                        Leave Application Id
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Types of Leave
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Leave Start Date
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Leave End Date
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Attachment
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Status
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {leaveapps
                      .filter((leaveapp) => !leaveapp.na)
                      .filter((leaveapp) => !leaveapp.del)
                      .filter((leaveapp) => leaveapp.leaveAppId.includes(currentUser.user_id))
                      .filter((leaveapp) => {
                        const startDate = new Date(leaveapp.leave_startDate);
                        const endDate = new Date(leaveapp.leave_endDate);

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
                          leaveapp.leaveAppId.toLowerCase().includes(searchQuery) ||
                          leaveapp.type.toLowerCase().includes(searchQuery) ||
                          formattedStartDate.includes(searchQuery.toLowerCase()) ||
                          formattedEndDate.includes(searchQuery.toLowerCase()) ||
                          leaveapp.leave_status.toLowerCase().includes(searchQuery)
                        );
                      })
                      .map((leaveapp, index) => (
                        <Tr key={leaveapp._id}>
                          <Td width={{ sm: "50px" }} pl="0px" borderColor={borderColor} py={5}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {leaveapp.leaveAppId}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {leaveapp.type}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {new Date(leaveapp.leave_startDate)
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
                              {new Date(leaveapp.leave_endDate)
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
                            <Flex
                              alignItems="center"
                              gap="1"
                              as="button"
                              onClick={() => {
                                if (leaveapp.attachment) {
                                  const filePath = leaveapp.attachment.replace("/ess", "");
                                  const fullPath = `http://localhost:5000/public/uploads/${filePath}`;

                                  window.open(fullPath, "_blank");
                                } else {
                                  alert("Attachment not available.");
                                }
                              }}
                            >
                              <FaFile size="14" color={iconColor} />
                              <Text fontSize="14px" color={textColor} fontWeight="bold">
                                EDIT
                              </Text>
                              <Text fontSize="14px" color={textColor} fontWeight="bold">
                                {leaveapp.attachment}
                              </Text>
                            </Flex>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Badge
                              bg={statusColors[leaveapp.leave_status] || "gray.400"}
                              color={"white"}
                              fontSize="16px"
                              p="3px 10px"
                              borderRadius="8px"
                            >
                              {leaveapp.leave_status}
                            </Badge>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex direction="row" p="0px" alignItems="center" gap="4">
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => {
                                  if (leaveapp.leave_status == "Pending") {
                                    handleEditClick(leaveapp);
                                  }
                                }}
                                cursor={
                                  leaveapp.leave_status !== "Pending" ? "not-allowed" : "pointer"
                                }
                                opacity={leaveapp.leave_status !== "Pending" ? 0.4 : 1}
                              >
                                <FaPen size="14" color={iconColor} />
                                <Text fontSize="14px" color={textColor} fontWeight="bold">
                                  EDIT
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
                  {isEditing ? "Edit Leave Application" : "Request Leave Application"}
                </Text>
                <FormControl>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Types of Leave
                  </FormLabel>
                  <Select
                    fontSize="sm"
                    ms="4px"
                    mb="24px"
                    size="lg"
                    placeholder="Select Leave Type"
                    name="type"
                    value={newLeaveApp.type}
                    onChange={(e) => setNewLeaveApp({ ...newLeaveApp, type: e.target.value })}
                    borderColor={errors.type ? "red.500" : "gray.200"}
                  >
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                  </Select>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Leave Start Date
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="date"
                    mb="24px"
                    size="lg"
                    placeholder="Leave Start Date"
                    name="leave_startDate"
                    value={newLeaveApp.leave_startDate}
                    onChange={handleDateChange}
                    borderColor={errors.leave_startDate ? "red.500" : "gray.200"}
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Leave End Date
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="date"
                    mb="24px"
                    size="lg"
                    placeholder="End Date"
                    name="leave_endDate"
                    value={newLeaveApp.leave_endDate}
                    onChange={handleDateChange}
                    borderColor={errors.leave_endDate ? "red.500" : "gray.200"}
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Attachment (optional)
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="file"
                    size="lg"
                    name="attachment"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 12px",
                    }}
                    onChange={handleFileChange}
                    borderColor={errors.attachment ? "red.500" : "gray.200"}
                  />
                  <Text fontSize="xs" color="red.500" ms="4px" mb="24px" fontStyle="italic">
                    * File must be in PDF format.
                  </Text>
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

export default LeaveApp;
