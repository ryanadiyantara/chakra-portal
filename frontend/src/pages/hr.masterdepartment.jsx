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
} from "@chakra-ui/react";
import { FaPen, FaTrash } from "react-icons/fa";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CustomModal from "../components/Modal";
import Footer from "../components/Footer";

import { useDepartmentStore } from "../store/department";

const MasterDepartment = () => {
  // Utils
  const { departments, createDepartment, fetchDepartment, updateDepartment, deleteDepartment } =
    useDepartmentStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");

  const [searchQuery, setSearchQuery] = useState("");
  const [newDepartment, setNewDepartment] = useState({
    department_name: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedDepartmentName, setSelectedDepartmentName] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleEditClick = (department) => {
    setNewDepartment({ department_name: department.department_name });
    setErrors({});
    setIsEditing(true);
    setEditingDepartmentId(department._id);
  };

  const handleCancelEdit = () => {
    setNewDepartment({ department_name: "" });
    setErrors({});
    setIsEditing(false);
    setEditingDepartmentId(null);
  };

  const openDeleteModal = (name) => {
    setSelectedDepartmentName(name);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
    setSelectedDepartmentName(null);
  };

  // Services
  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  const handleSubmit = async () => {
    const currentErrors = {
      department_name: !newDepartment.department_name,
    };

    setErrors(currentErrors);

    if (isEditing && editingDepartmentId) {
      // Update department
      const { success, message } = await updateDepartment(editingDepartmentId, newDepartment);
      if (success) {
        toast({
          title: "Success",
          description: "Department updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        setEditingDepartmentId(null);
        setNewDepartment({ department_name: "" });
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
    } else {
      // Create new department
      const { success, message } = await createDepartment(newDepartment);
      if (success) {
        toast({
          title: "Success",
          description: message,
          status: "success",
          isClosable: true,
        });
        setNewDepartment({ department_name: "" });
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

  const handleDeleteDepartment = async (pid) => {
    if (!selectedDepartmentName) return;

    if (inputValue !== selectedDepartmentName) {
      toast({
        title: "Error",
        description: "Input does not match the department name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await deleteDepartment(pid);
    if (success) {
      toast({
        title: "Success",
        description: "Department deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
      setInputValue("");
      setSelectedDepartmentName(null);
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
              <Flex align="center" justify="space-between" p="0px">
                <Box p="6px 0px 22px 0px">
                  <Text fontSize="xl" color={textColor} fontWeight="bold">
                    Department List
                  </Text>
                </Box>
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
              <Box>
                <Table variant="simple" color={textColor}>
                  <Thead>
                    <Tr my=".8rem" pl="0px" color="gray.400">
                      <Th pl="0px" borderColor={borderColor} color="gray.400">
                        No.
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
                    {departments
                      .filter((department) => !department.na)
                      .filter((department) => !department.del)
                      .filter((department) =>
                        department.department_name.toLowerCase().includes(searchQuery)
                      )
                      .map((department, index) => (
                        <Tr key={department._id}>
                          <Td width={{ sm: "50px" }} pl="0px" borderColor={borderColor} py={5}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {index + 1}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {department.department_name}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex direction="row" p="0px" alignItems="center" gap="4">
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => handleEditClick(department)}
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
                                onClick={() => openDeleteModal(department.department_name)}
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
                                title="Delete Department"
                                bodyContent={
                                  <p>
                                    To delete a department named{" "}
                                    <span style={{ fontWeight: "bold" }}>
                                      {selectedDepartmentName}
                                    </span>
                                    , type the name to confirm.
                                  </p>
                                }
                                modalBgColor="blackAlpha.400"
                                modalBackdropFilter="blur(1px)"
                                inputValue={inputValue}
                                onInputChange={(e) => setInputValue(e.target.value)}
                                onConfirm={() => handleDeleteDepartment(department._id)}
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
                  {isEditing ? "Edit Department" : "Add New Department"}
                </Text>
                <FormControl>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Department Name
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="text"
                    mb="24px"
                    size="lg"
                    placeholder="Department name"
                    name="department_name"
                    value={newDepartment.department_name}
                    onChange={(e) =>
                      setNewDepartment({ ...newDepartment, department_name: e.target.value })
                    }
                    borderColor={errors.department_name ? "red.500" : "gray.200"}
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

export default MasterDepartment;
