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
  Select,
} from "@chakra-ui/react";
import { FaPen, FaTrash } from "react-icons/fa";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CustomModal from "../components/Modal";
import Footer from "../components/Footer";

import { useUserStore } from "../store/user";

const ManageEmployee = () => {
  // Utils
  const {
    users,
    departments,
    positions,
    createUser,
    fetchUser,
    updateUser,
    terminatedUser,
    getDepartmentData,
    getPositionData,
  } = useUserStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");

  const [searchQuery, setSearchQuery] = useState("");
  const [newUser, setNewUser] = useState({
    user_name: "",
    email: "",
    dateBirth: "",
    department_id: "",
    position_id: "",
    profilePicture: "",
    startDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedUserName, setSelectedUserName] = useState(null);

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

      setNewUser({ ...newUser, profilePicture: file });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleEditClick = (user) => {
    setNewUser({
      user_name: user.user_name,
      email: user.email,
      dateBirth: formatDate(user.dateBirth),
      department_id: user.department_id,
      position_id: user.position_id,
      profilePicture: user.profilePicture,
      startDate: formatDate(user.startDate),
    });
    setErrors({});
    setIsEditing(true);
    setEditingUserId(user._id);
  };

  const handleCancelEdit = () => {
    setNewUser({
      user_name: "",
      email: "",
      dateBirth: "",
      department_id: "",
      position_id: "",
      profilePicture: "",
      startDate: "",
    });
    document.querySelector('input[type="file"]').value = "";
    setErrors({});
    setIsEditing(false);
    setEditingUserId(null);
  };

  const openDeleteModal = (name) => {
    setSelectedUserName(name);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
    setSelectedUserName(null);
  };

  // Services
  useEffect(() => {
    fetchUser();
    getDepartmentData();
    getPositionData();
  }, [fetchUser, getDepartmentData, getPositionData]);

  const filteredPositions = positions.filter(
    (position) => position.department_id === newUser.department_id
  );

  const handleSubmit = async () => {
    const currentErrors = {
      user_name: !newUser.user_name,
      email: !newUser.email,
      dateBirth: !newUser.dateBirth,
      department_id: !newUser.department_id,
      position_id: !newUser.position_id,
      profilePicture: !newUser.profilePicture,
      startDate: !newUser.startDate,
    };

    setErrors(currentErrors);

    if (isEditing && editingUserId) {
      // Update user
      const { success, message } = await updateUser(editingUserId, newUser);
      if (success) {
        toast({
          title: "Success",
          description: "User updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        setEditingUserId(null);
        setNewUser({
          user_name: "",
          email: "",
          dateBirth: "",
          department_id: "",
          position_id: "",
          profilePicture: "",
          startDate: "",
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
    } else {
      // Create new user
      const { success, message } = await createUser(newUser);
      if (success) {
        toast({
          title: "Success",
          description: message,
          status: "success",
          isClosable: true,
        });
        setNewUser({
          user_name: "",
          email: "",
          dateBirth: "",
          department_id: "",
          position_id: "",
          profilePicture: "",
          startDate: "",
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

  const handleTerminatedUser = async (pid) => {
    if (!selectedUserName) return;

    if (inputValue !== selectedUserName) {
      toast({
        title: "Error",
        description: "Input does not match the user name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await terminatedUser(pid);
    if (success) {
      toast({
        title: "Success",
        description: "User terminated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
      setInputValue("");
      setSelectedUserName(null);
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
                    Employee List
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
                        Name & Email
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Employee ID
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Department & Position
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Birth Date
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Employed
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Action
                      </Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {users
                      .filter((user) => !user.na)
                      .filter((user) => {
                        const startDate = new Date(user.startDate);
                        const birthDate = new Date(user.dateBirth);

                        const formattedBirthDate = birthDate
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                          .toLowerCase();

                        const formattedStartDate = startDate
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                          .toLowerCase();

                        return (
                          user.user_name.toLowerCase().includes(searchQuery) ||
                          user.email.toLowerCase().includes(searchQuery) ||
                          user.user_id.toLowerCase().includes(searchQuery) ||
                          departments.some(
                            (department) =>
                              department._id === user.department_id &&
                              department.department_name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                          ) ||
                          positions.some(
                            (position) =>
                              position._id === user.position_id &&
                              position.position_name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                          ) ||
                          formattedBirthDate.includes(searchQuery.toLowerCase()) ||
                          formattedStartDate.includes(searchQuery.toLowerCase())
                        );
                      })
                      .map((user) => {
                        const department = departments.find(
                          (dept) => dept._id === user.department_id
                        );
                        const position = positions.find((post) => post._id === user.position_id);
                        return (
                          <Tr key={user._id}>
                            <Td
                              borderColor={borderColor}
                              width={{ base: "100px", xl: "200px" }}
                              p="0px"
                            >
                              <Flex direction="row">
                                <Image
                                  src={"/" + user.profilePicture}
                                  alt={user.profilePicture}
                                  boxSize="50px"
                                  objectFit="cover"
                                  borderRadius="lg"
                                  width="40px"
                                  height="40px"
                                  mr="10px"
                                />
                                <Flex direction="column" width={{ base: "auto", sm: "150px" }}>
                                  <Text fontSize="md" color={textColor} fontWeight="bold">
                                    {user.user_name}
                                  </Text>
                                  <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                    {user.email}
                                  </Text>
                                </Flex>
                              </Flex>
                            </Td>
                            <Td borderColor={borderColor}>
                              <Text
                                fontSize="md"
                                color={textColor}
                                fontWeight="bold"
                                minWidth="100%"
                              >
                                {user.user_id}
                              </Text>
                            </Td>
                            <Td borderColor={borderColor}>
                              <Flex direction="column">
                                <Text fontSize="md" color={textColor} fontWeight="bold">
                                  {department ? department.department_name : "Department not found"}
                                </Text>
                                <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                  {position ? position.position_name : "Position not found"}
                                </Text>
                              </Flex>
                            </Td>
                            <Td borderColor={borderColor}>
                              <Text
                                fontSize="md"
                                color={textColor}
                                fontWeight="bold"
                                minWidth="100%"
                              >
                                {new Date(user.dateBirth).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </Text>
                            </Td>
                            <Td borderColor={borderColor}>
                              <Text
                                fontSize="md"
                                color={textColor}
                                fontWeight="bold"
                                minWidth="100%"
                              >
                                {new Date(user.startDate).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })}
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
                                  onClick={() => handleEditClick(user)}
                                >
                                  <FaPen size="14" color={iconColor} />
                                  <Text fontSize="14px" color={textColor} fontWeight="bold">
                                    EDIT
                                  </Text>
                                </Flex>

                                {/* Button for Delete */}
                                <Flex
                                  alignItems="center"
                                  gap="1"
                                  as="button"
                                  onClick={() => openDeleteModal(user.user_name)}
                                >
                                  <FaTrash size="14" color="#E53E3E" />
                                  <Text fontSize="14px" color="#E53E3E" fontWeight="bold">
                                    TERMINATED
                                  </Text>
                                </Flex>
                                {/* Modal Delete */}
                                <CustomModal
                                  isOpen={isOpen}
                                  onClose={handleClose}
                                  title="Delete User"
                                  bodyContent={
                                    <p>
                                      To delete a user named{" "}
                                      <span style={{ fontWeight: "bold" }}>{selectedUserName}</span>
                                      , type the name to confirm.
                                    </p>
                                  }
                                  modalBgColor="blackAlpha.400"
                                  modalBackdropFilter="blur(1px)"
                                  inputValue={inputValue}
                                  onInputChange={(e) => setInputValue(e.target.value)}
                                  onConfirm={() => handleTerminatedUser(user._id)}
                                />
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
                  {isEditing ? "Edit Employee" : "Add New Employee"}
                </Text>
                <FormControl>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Employee Name
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="text"
                    mb="24px"
                    size="lg"
                    placeholder="Employee name"
                    name="user_name"
                    value={newUser.user_name}
                    onChange={(e) => setNewUser({ ...newUser, user_name: e.target.value })}
                    borderColor={errors.user_name ? "red.500" : "gray.200"}
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Email
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="email"
                    mb="24px"
                    size="lg"
                    placeholder="Email"
                    name="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    borderColor={errors.email ? "red.500" : "gray.200"}
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Birth Date
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type="date"
                    mb="24px"
                    size="lg"
                    placeholder="Birth date"
                    name="dateBirth"
                    value={newUser.dateBirth}
                    borderColor={errors.dateBirth ? "red.500" : "gray.200"}
                    onChange={(e) => setNewUser({ ...newUser, dateBirth: e.target.value })}
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Department
                  </FormLabel>
                  <Select
                    fontSize="sm"
                    ms="4px"
                    mb="24px"
                    size="lg"
                    placeholder="Select Department"
                    name="department_id"
                    value={newUser.department_id}
                    onChange={(e) => setNewUser({ ...newUser, department_id: e.target.value })}
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
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Position
                  </FormLabel>
                  <Select
                    fontSize="sm"
                    ms="4px"
                    mb="24px"
                    size="lg"
                    placeholder="Select Position"
                    name="position_id"
                    value={newUser.position_id}
                    onChange={(e) => setNewUser({ ...newUser, position_id: e.target.value })}
                    borderColor={errors.position_id ? "red.500" : "gray.200"}
                    isDisabled={!newUser.department_id}
                  >
                    {filteredPositions
                      .filter((position) => !position.na)
                      .filter((position) => !position.del)
                      .map((position) => (
                        <option key={position._id} value={position._id}>
                          {position.position_name}
                        </option>
                      ))}
                  </Select>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Profile Picture
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
                    borderColor={errors.profilePicture ? "red.500" : "gray.200"}
                  />
                  <Text fontSize="xs" color="red.500" ms="4px" fontStyle="italic">
                    * Accepted file types: JPG, JPEG, PNG.
                  </Text>
                  <Text fontSize="xs" color="red.500" ms="4px" mb="24px" fontStyle="italic">
                    * Recommended aspect ratio: 1:1.
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
                    placeholder="Start date"
                    name="startDate"
                    value={newUser.startDate}
                    borderColor={errors.startDate ? "red.500" : "gray.200"}
                    onChange={(e) => setNewUser({ ...newUser, startDate: e.target.value })}
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

export default ManageEmployee;
