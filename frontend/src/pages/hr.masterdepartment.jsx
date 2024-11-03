import { Box, Button, Text, useColorMode, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MasterDepartment = () => {
  const { colorMode, toggleColorMode } = useColorMode();
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
        <VStack spacing={2} alignItems={"center"}>
          <Text
            fontSize={{ base: "22", sm: "28" }}
            fontWeight={"bold"}
            textTransform={"uppercase"}
            textAlign={"center"}
            bgGradient={"linear(to-r, cyan.400, blue.500)"}
            bgClip={"text"}
          >
            Master Department
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
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon /> : <LuSun zize="20" />}
          </Button>
        </VStack>
        <Footer />
      </Box>
    </>
  );
};

export default MasterDepartment;
