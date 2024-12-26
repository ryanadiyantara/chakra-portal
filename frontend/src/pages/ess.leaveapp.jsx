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
  SimpleGrid,
  Card,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { FaFile, FaPen } from "react-icons/fa";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useLeaveAppStore } from "../store/leaveapp";
import { useUserStore } from "../store/user";
import IconBox from "../components/Icons/IconBox";
import { DateIcon } from "../components/Icons/Icons";

const LeaveApp = () => {
  // Utils
  const { leaveapps, createLeaveApp, fetchLeaveApp, updateLeaveApp } = useLeaveAppStore();
  const { currentUsers, fetchCurrentUser } = useUserStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const iconBlue = useColorModeValue("blue.500", "blue.500");
  const iconBoxInside = useColorModeValue("white", "white");

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
    fetchCurrentUser();
  }, [fetchLeaveApp, fetchCurrentUser]);

  const handleSubmit = async () => {
    const currentErrors = {
      leave_startDate: !newLeaveApp.leave_startDate,
      leave_endDate: !newLeaveApp.leave_endDate,
      type: !newLeaveApp.type,
    };
    setErrors(currentErrors);

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
      const { success, message } = await createLeaveApp(newLeaveApp, currentUsers.user_id);
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

  const calculateDaysInYear = (startDate, endDate, year) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const day = date.getDay();
      const currentYear = date.getFullYear();

      if (currentYear === year && day !== 0 && day !== 6) {
        count++;
      }
    }

    return count;
  };

  const currentYear = new Date().getFullYear();

  // Annual Leave
  const usedLeaveDays = leaveapps
    .filter((leaveapp) => !leaveapp.na)
    .filter((leaveapp) => !leaveapp.del)
    .filter((leaveapp) => leaveapp.leaveAppId.includes(currentUsers.user_id))
    .filter((leaveapp) => leaveapp.leave_status === "Approved" && leaveapp.type === "Annual Leave")
    .reduce(
      (total, leaveapp) =>
        total + calculateDaysInYear(leaveapp.leave_startDate, leaveapp.leave_endDate, currentYear),
      0
    );

  const MAX_LEAVE_DAYS = 12;
  const remainingLeaveDays = Math.max(0, MAX_LEAVE_DAYS - usedLeaveDays);

  // Sick Leave
  const sickLeaveDays = leaveapps
    .filter((leaveapp) => !leaveapp.na)
    .filter((leaveapp) => !leaveapp.del)
    .filter((leaveapp) => leaveapp.leaveAppId.includes(currentUsers.user_id))
    .filter((leaveapp) => leaveapp.leave_status === "Approved" && leaveapp.type === "Sick Leave")
    .reduce(
      (total, leaveapp) =>
        total + calculateDaysInYear(leaveapp.leave_startDate, leaveapp.leave_endDate, currentYear),
      0
    );

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

    if (newLeaveApp.leave_startDate && (name === "leave_endDate" || name === "leave_startDate")) {
      const startDate = name === "leave_startDate" ? value : newLeaveApp.leave_startDate;
      const endDate = name === "leave_endDate" ? value : newLeaveApp.leave_endDate;

      if (startDate && endDate) {
        if (newLeaveApp.type === "Annual Leave") {
          const selectedDays = calculateDaysInYear(startDate, endDate, currentYear);

          if (selectedDays > remainingLeaveDays) {
            toast({
              title: "Error",
              description: `You have selected ${selectedDays} leave days, which exceeds your remaining leave allowance of ${remainingLeaveDays} days. Please adjust the dates accordingly.`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            e.target.value = "";
            return;
          }
        }
      }
    }

    setNewLeaveApp({ ...newLeaveApp, [name]: value });
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

        <Box px={{ base: "30px", xl: "40px" }} w="100%">
          <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px" mb="20px">
            <Card borderRadius="16px" p="20px">
              <Flex direction="column">
                <Flex flexDirection="row" align="center" justify="center" w="100%" mb="5px">
                  <Stat me="5px">
                    <StatLabel
                      fontSize="xs"
                      color="gray.400"
                      fontWeight="bold"
                      textTransform="uppercase"
                    >
                      REMAINING LEAVE DAYS
                    </StatLabel>
                    <Flex>
                      <StatNumber fontSize="xl" color={textColor} fontWeight="bold">
                        {remainingLeaveDays} DAYS
                      </StatNumber>
                    </Flex>
                  </Stat>
                  <IconBox borderRadius="8px" as="box" h={"45px"} w={"45px"} bg={iconBlue}>
                    <DateIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                  </IconBox>
                </Flex>
                <Text color="gray.400" fontSize="sm">
                  <Text as="span" color="green.400" fontWeight="bold">
                    {usedLeaveDays} Leave days{" "}
                  </Text>
                  have been used this year
                </Text>
              </Flex>
            </Card>
            <Card borderRadius="16px" p="20px">
              <Flex direction="column">
                <Flex flexDirection="row" align="center" justify="center" w="100%" mb="5px">
                  <Stat me="5px">
                    <StatLabel
                      fontSize="xs"
                      color="gray.400"
                      fontWeight="bold"
                      textTransform="uppercase"
                    >
                      TOTAL SICK LEAVE
                    </StatLabel>
                    <Flex>
                      <StatNumber fontSize="xl" color={textColor} fontWeight="bold">
                        {sickLeaveDays} Days
                      </StatNumber>
                    </Flex>
                  </Stat>
                  <IconBox borderRadius="8px" as="box" h={"45px"} w={"45px"} bg={iconBlue}>
                    <DateIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                  </IconBox>
                </Flex>
                <Text color="gray.400" fontSize="sm">
                  This year
                </Text>
              </Flex>
            </Card>
          </SimpleGrid>
        </Box>

        {/* Content */}
        <HStack
          flexDirection={{
            base: "column",
            lg: "row",
          }}
          justifyContent="space-between"
          px={{ base: "30px", xl: "40px" }}
          w="100%"
          spacing={{ base: "20px", xl: "30px" }}
          alignItems={{ base: "center", lg: "start" }}
          minHeight="85vh"
        >
          {/* Table Data */}
          <VStack
            spacing={2}
            alignItems={"left"}
            w="100%"
            background="white"
            p="20px"
            borderRadius="16px"
            bg={bgForm}
            overflowX={{ base: "scroll", "2xl": "hidden" }}
          >
            <Flex align="center" justify="space-between" p="6px 0px 22px 0px">
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                Leave Application History
              </Text>
              <Box>
                <Input
                  placeholder="Search on list.."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  size="sm"
                  borderRadius="5px"
                  w={{ base: "85%", md: "100%" }}
                  ml={{ base: "15%", md: "0%" }}
                />
              </Box>
            </Flex>
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
                    .filter((leaveapp) => leaveapp.leaveAppId.includes(currentUsers.user_id))
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
                      <Tr
                        key={leaveapp._id}
                        _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
                      >
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
                              if (leaveapp.attachment && leaveapp.attachment !== "-") {
                                const filePath = leaveapp.attachment.replace("/ess", "");
                                const fullPath = `${window.location.origin}/public/uploads/${filePath}`;

                                window.open(fullPath, "_blank");
                              }
                            }}
                            cursor={
                              !leaveapp.attachment || leaveapp.attachment === "-"
                                ? "not-allowed"
                                : "pointer"
                            }
                            opacity={!leaveapp.attachment || leaveapp.attachment === "-" ? 0.4 : 1}
                          >
                            <Text fontSize="14px" color={textColor} fontWeight="bold">
                              SEE
                            </Text>
                            <FaFile size="14" color={iconColor} />
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
                              disabled={leaveapp.leave_status !== "Pending"}
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
          </VStack>

          {/* Input Form */}
          <VStack>
            <Flex direction="column" w="325px" borderRadius="15px" p="40px" bg={bgForm} mb="60px">
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
                  onChange={(e) => {
                    setNewLeaveApp({
                      ...newLeaveApp,
                      type: e.target.value,
                      leave_startDate: e.target.value === null,
                      leave_endDate: e.target.value === null,
                    });
                  }}
                  borderColor={errors.type ? "red.500" : "gray.200"}
                >
                  <option value="Annual Leave" disabled={remainingLeaveDays === 0}>
                    Annual Leave
                  </option>
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
                  isDisabled={!newLeaveApp.type}
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
                  isDisabled={!newLeaveApp.type}
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
          </VStack>
        </HStack>

        <Footer />
      </Box>
    </>
  );
};

export default LeaveApp;
