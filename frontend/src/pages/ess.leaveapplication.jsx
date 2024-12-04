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
import Footer from "../components/Footer";

const LeaveApplication = () => {
  // Utils
  const { departments, createDepartment, fetchDepartment, updateDepartment, deleteDepartment } =
    useDepartmentStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");

  const [newDepartment, setNewDepartment] = useState({
    department_name: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

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

  // Services
  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  const handleSubmit = async () => {
    const currentErrors = {
      department_name: !newDepartment.department_name,
    };

    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0);

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
    const { success, message } = await deleteDepartment(pid);
    if (success) {
      toast({
        title: "Success",
        description: "Department deleted successfully",
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

  return (
    <>
      <Background />
      <Sidebar />

      <VStack spacing={2} alignItems={"center"}>
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
        >
          Leave Application
        </Text>
        <Link to={"/login"}>
          <Button>Login</Button>
        </Link>
        <Link to={"/login/forgotpassword"}>
          <Button>Forgot Password</Button>
        </Link>
        <Link to={"/dashboard"}>
          <Button>Dashboard</Button>
        </Link>
        <Link to={"/employeedirectory"}>
          <Button>Employee Directory</Button>
        </Link>
        <Link to={"/ess/changepassword"}>
          <Button>Change Password</Button>
        </Link>
        <Link to={"/ess/leaveapplication"}>
          <Button>Leave Application</Button>
        </Link>
        <Link to={"/hr/masterdepartment"}>
          <Button>Master Department</Button>
        </Link>
        <Link to={"/hr/masterposition"}>
          <Button>Master Position</Button>
        </Link>
        <Link to={"/hr/manageevent"}>
          <Button>Manage Event</Button>
        </Link>
        <Link to={"/hr/manageemployee"}>
          <Button>Manage Employee</Button>
        </Link>
        <Link to={"/hr/employeeterminated"}>
          <Button>Employee Terminated</Button>
        </Link>
        <Link to={"/hr/attendancesummary"}>
          <Button>Attendance Summary</Button>
        </Link>
        <Link to={"/hr/leaveapproval"}>
          <Button>Leave Approval</Button>
        </Link>
      </VStack>
    </>
  );
};

export default LeaveApplication;
