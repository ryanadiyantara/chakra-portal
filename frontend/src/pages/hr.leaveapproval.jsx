import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
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
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { FaCheckCircle, FaFile, FaTrash } from "react-icons/fa";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useLeaveAppStore } from "../store/leaveapp";
import { useUserStore } from "../store/user";

const LeaveApproval = () => {
  // Utils
  const { leaveapps, fetchLeaveApp, approvalLeaveApp } = useLeaveAppStore();
  const { users, fetchUser } = useUserStore();

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [leaveAppId, setLeaveAppId] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const openApprovalModal = (leaveapp, approval) => {
    setSelectedApproval(approval);
    setLeaveAppId(leaveapp._id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setLeaveAppId(null);
    setSelectedApproval(null);
  };

  // Services
  useEffect(() => {
    fetchLeaveApp();
    fetchUser();
  }, [fetchLeaveApp, fetchUser]);

  const handleApproval = async () => {
    const { success, message } = await approvalLeaveApp(leaveAppId, selectedApproval);
    if (success) {
      toast({
        title: "Success",
        description: `Leave application ${selectedApproval} successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
      setLeaveAppId(null);
      setSelectedApproval(null);
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
                        Employee Name
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
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
                      .map((leaveapp) => {
                        const match = leaveapp.leaveAppId.match(/LEAVE\/(\d+)\/\d+\/\d+/);
                        const extractedId = match ? match[1] : null;
                        const userFind = users.find((user) => user.user_id === extractedId);

                        return (
                          <Tr
                            key={leaveapp._id}
                            _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
                          >
                            <Td width={{ sm: "50px" }} pl="0px" borderColor={borderColor} py={5}>
                              <Text
                                fontSize="md"
                                color={textColor}
                                fontWeight="bold"
                                minWidth="100%"
                              >
                                {leaveapp.leaveAppId}
                              </Text>
                            </Td>
                            <Td borderColor={borderColor}>
                              <Text
                                fontSize="md"
                                color={textColor}
                                fontWeight="bold"
                                minWidth="100%"
                              >
                                {userFind ? userFind.user_name : "User name not found"}
                              </Text>
                            </Td>
                            <Td borderColor={borderColor}>
                              <Text
                                fontSize="md"
                                color={textColor}
                                fontWeight="bold"
                                minWidth="100%"
                              >
                                {leaveapp.type}
                              </Text>
                            </Td>
                            <Td borderColor={borderColor}>
                              <Text
                                fontSize="md"
                                color={textColor}
                                fontWeight="bold"
                                minWidth="100%"
                              >
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
                              <Text
                                fontSize="md"
                                color={textColor}
                                fontWeight="bold"
                                minWidth="100%"
                              >
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
                                    const fullPath = `http://localhost:5000/public/uploads/${filePath}`;

                                    window.open(fullPath, "_blank");
                                  }
                                }}
                                cursor={
                                  !leaveapp.attachment || leaveapp.attachment === "-"
                                    ? "not-allowed"
                                    : "pointer"
                                }
                                opacity={
                                  !leaveapp.attachment || leaveapp.attachment === "-" ? 0.4 : 1
                                }
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
                                  onClick={() => openApprovalModal(leaveapp, "Approved")}
                                  cursor={
                                    leaveapp.leave_status !== "Pending" ? "not-allowed" : "pointer"
                                  }
                                  opacity={leaveapp.leave_status !== "Pending" ? 0.4 : 1}
                                  disabled={leaveapp.leave_status !== "Pending"}
                                >
                                  <FaCheckCircle size="14" color="#48BB78" />
                                  <Text fontSize="14px" color="#48BB78" fontWeight="bold">
                                    APPROVE
                                  </Text>
                                </Flex>
                                <Flex
                                  alignItems="center"
                                  gap="1"
                                  as="button"
                                  onClick={() => openApprovalModal(leaveapp, "Rejected")}
                                  cursor={
                                    leaveapp.leave_status !== "Pending" ? "not-allowed" : "pointer"
                                  }
                                  opacity={leaveapp.leave_status !== "Pending" ? 0.4 : 1}
                                  disabled={leaveapp.leave_status !== "Pending"}
                                >
                                  <FaTrash size="14" color="#E53E3E" />
                                  <Text fontSize="14px" color="#E53E3E" fontWeight="bold">
                                    REJECT
                                  </Text>
                                </Flex>
                                {/* Modal Delete */}
                                <Modal
                                  isOpen={isOpen}
                                  onClose={handleClose}
                                  motionPreset="slideInBottom"
                                >
                                  <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(1px)" />
                                  <ModalContent
                                    borderRadius="15px"
                                    boxShadow="none"
                                    p={4}
                                    maxW="400px"
                                    w="90%"
                                  >
                                    <ModalHeader>{selectedApproval} Leave Application</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <p>
                                        Are you sure you want to{" "}
                                        <span style={{ fontWeight: "bold" }}>
                                          {selectedApproval}?
                                        </span>
                                        <br /> This action cannot be undone.
                                      </p>
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button colorScheme="blue" mr={3} onClick={handleClose}>
                                        Cancel
                                      </Button>
                                      <Button
                                        colorScheme={
                                          selectedApproval == "Approved" ? "green" : "red"
                                        }
                                        onClick={handleApproval}
                                      >
                                        {selectedApproval == "Approved" ? "Approved" : "Rejected"}
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Flex>
                            </Td>
                          </Tr>
                        );
                      })}
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

export default LeaveApproval;
