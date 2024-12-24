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
} from "@chakra-ui/react";
import { FaPen, FaTrash } from "react-icons/fa";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CustomModal from "../components/Modal";
import Footer from "../components/Footer";

import { usePositionStore } from "../store/position";
import { useDepartmentStore } from "../store/department";

const MasterPosition = () => {
  // Utils
  const { positions, createPosition, fetchPosition, updatePosition, deletePosition } =
    usePositionStore();
  const { departments, fetchDepartment } = useDepartmentStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const [searchQuery, setSearchQuery] = useState("");
  const [newPosition, setNewPosition] = useState({
    position_name: "",
    department_id: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingPositionId, setEditingPositionId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedPositionName, setSelectedPositionName] = useState(null);
  const [selectedPositionPid, setSelectedPositionPid] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleEditClick = (position) => {
    setNewPosition({
      position_name: position.position_name,
      department_id: position.department_id._id,
    });
    setErrors({});
    setIsEditing(true);
    setEditingPositionId(position._id);
  };

  const handleCancelEdit = () => {
    setNewPosition({ position_name: "", department_id: "" });
    setErrors({});
    setIsEditing(false);
    setEditingPositionId(null);
  };

  const openDeleteModal = (names, pid) => {
    setSelectedPositionName(names);
    setSelectedPositionPid(pid);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
    setSelectedPositionName(null);
    setSelectedPositionPid(null);
  };

  // Services
  useEffect(() => {
    fetchPosition();
    fetchDepartment();
  }, [fetchPosition, fetchDepartment]);

  const handleSubmit = async () => {
    const currentErrors = {
      position_name: !newPosition.position_name,
      department_id: !newPosition.department_id,
    };

    setErrors(currentErrors);

    if (isEditing && editingPositionId) {
      // Update position
      const { success, message } = await updatePosition(editingPositionId, newPosition);

      if (success) {
        toast({
          title: "Success",
          description: "Position updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        setEditingPositionId(null);
        setNewPosition({ position_name: "", department_id: "" });
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
    } else {
      // Create new position
      const { success, message } = await createPosition(newPosition);

      if (success) {
        toast({
          title: "Success",
          description: message,
          status: "success",
          isClosable: true,
        });
        setNewPosition({ position_name: "", department_id: "" });
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

  const handleDeletePosition = async (pid) => {
    if (!selectedPositionName) return;

    if (inputValue !== selectedPositionName) {
      toast({
        title: "Error",
        description: "Input does not match the position name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await deletePosition(pid);

    if (success) {
      toast({
        title: "Success",
        description: "Position deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
      setInputValue("");
      setSelectedPositionName(null);
      setSelectedPositionPid(null);
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
          alignItems={{ base: "center", xl: "start" }}
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
            overflowX={{ base: "scroll", md: "hidden" }}
          >
            <Flex align="center" justify="space-between" p="6px 0px 22px 0px">
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                Position List
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
                      No.
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Position Name
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Department Name
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {positions
                    .filter((position) => !position.na)
                    .filter((position) => !position.del)
                    .filter(
                      (position) =>
                        position.position_name.toLowerCase().includes(searchQuery) ||
                        departments.some(
                          (department) =>
                            department._id === position.department_id._id &&
                            department.department_name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                        )
                    )
                    .map((position, index) => {
                      return (
                        <Tr
                          key={position._id}
                          _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
                        >
                          <Td width={{ sm: "50px" }} pl="0px" borderColor={borderColor} py={5}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {index + 1}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {position.position_name}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {position.department_id.department_name}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex direction="row" p="0px" alignItems="center" gap="4">
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => handleEditClick(position)}
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
                                onClick={() =>
                                  openDeleteModal(position.position_name, position._id)
                                }
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
                                title="Delete Position"
                                bodyContent={
                                  <p>
                                    To delete a position named{" "}
                                    <span style={{ fontWeight: "bold" }}>
                                      {selectedPositionName}
                                    </span>
                                    , type the name to confirm.
                                  </p>
                                }
                                modalBgColor="blackAlpha.200"
                                modalBackdropFilter="blur(0.6px)"
                                inputValue={inputValue}
                                onInputChange={(e) => setInputValue(e.target.value)}
                                onConfirm={() => handleDeletePosition(selectedPositionPid)}
                              />
                            </Flex>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </Box>
          </VStack>

          {/* Input Form */}
          <VStack>
            <Flex direction="column" w="325px" borderRadius="15px" p="40px" bg={bgForm} mb="60px">
              <Text fontSize="xl" color={textColor} fontWeight="bold" mb="22px">
                {isEditing ? "Edit Position" : "Add New Position"}
              </Text>
              <FormControl>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Position Name
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Position name"
                  name="position_name"
                  value={newPosition.position_name}
                  onChange={(e) =>
                    setNewPosition({ ...newPosition, position_name: e.target.value })
                  }
                  borderColor={errors.position_name ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Department Name
                </FormLabel>
                <Select
                  fontSize="sm"
                  ms="4px"
                  mb="24px"
                  size="lg"
                  placeholder="Select Department"
                  name="department_id"
                  value={newPosition.department_id}
                  onChange={(e) => {
                    setNewPosition({ ...newPosition, department_id: e.target.value });
                  }}
                  borderColor={errors.department_id ? "red.500" : "gray.200"}
                >
                  {departments
                    .filter((department) => !department.na)
                    .filter((department) => !department.del)
                    .map((department) => (
                      <option key={department._id} value={department._id}>
                        {department.department_name}
                      </option>
                    ))}
                </Select>
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

export default MasterPosition;
