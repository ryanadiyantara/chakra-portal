import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  useToast,
  useColorModeValue,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useUserStore } from "../store/user";

const ChangePassword = () => {
  // Utils
  const { currentUsers, fetchCurrentUser, changePassword } = useUserStore();

  const toast = useToast();
  const bgForm = useColorModeValue("white", "navy.800");

  const [newUser, setNewUser] = useState({
    old_password: "",
    new_password: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Services
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const handleSubmit = async () => {
    const currentErrors = {
      old_password: !newUser.old_password,
      new_password: !newUser.new_password,
    };
    setErrors(currentErrors);

    const { success, message } = await changePassword(
      currentUsers._id,
      currentUsers.email,
      newUser
    );

    if (success) {
      toast({
        title: "Success",
        description: "Your password changed successfully",
        status: "success",
        isClosable: true,
      });
      setNewUser({
        old_password: "",
        new_password: "",
      });
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
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
          py="20px"
          w="100%"
          spacing={{ base: "20px", xl: "30px" }}
          alignItems={{ base: "center", xl: "start" }}
          minHeight="85vh"
        >
          {/* Input Form */}
          <VStack>
            <Flex direction="column" w="325px" borderRadius="15px" p="40px" bg={bgForm} mb="60px">
              <FormControl>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Old Password
                </FormLabel>
                <InputGroup size="lg" mb="24px">
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type={showPassword.oldPassword ? "text" : "password"}
                    mb="24px"
                    size="lg"
                    placeholder="Your old password"
                    name="old_password"
                    value={newUser.old_password}
                    onChange={(e) => setNewUser({ ...newUser, old_password: e.target.value })}
                    borderColor={errors.old_password ? "red.500" : "gray.200"}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword.oldPassword ? "Hide old password" : "Show old password"
                      }
                      icon={showPassword.oldPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => togglePasswordVisibility("oldPassword")}
                      variant="ghost"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  New Password
                </FormLabel>
                <InputGroup size="lg" mb="24px">
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type={showPassword.newPassword ? "text" : "password"}
                    mb="24px"
                    size="lg"
                    placeholder="Your new password"
                    name="new_password"
                    value={newUser.new_password}
                    onChange={(e) => setNewUser({ ...newUser, new_password: e.target.value })}
                    borderColor={errors.new_password ? "red.500" : "gray.200"}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword.newPassword ? "Hide new password" : "Show new password"
                      }
                      icon={showPassword.newPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => togglePasswordVisibility("newPassword")}
                      variant="ghost"
                    />
                  </InputRightElement>
                </InputGroup>
                <Button
                  fontSize="14px"
                  variant="dark"
                  fontWeight="bold"
                  w="100%"
                  h="45"
                  mt="24px"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </FormControl>
            </Flex>
          </VStack>
        </HStack>

        <Footer />
      </Box>
    </>
  );
};

export default ChangePassword;
