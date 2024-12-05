import { Button, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AttendanceSummary = () => {
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
          Attendance Summary
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
        <Link to={"/ess/leaveapp"}>
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

export default AttendanceSummary;
