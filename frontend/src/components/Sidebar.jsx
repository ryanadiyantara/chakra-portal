import React from "react";
import { Box, VStack, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const routes = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/employeedirectory", name: "Employee Directory" },
    { path: "/ess/changepassword", name: "Change Password" },
    { path: "/ess/leaveapplication", name: "Leave Application" },
    { path: "/hr/masterdepartment", name: "Master Department" },
    { path: "/hr/masterposition", name: "Master Position" },
    { path: "/hr/manageevent", name: "Manage Event" },
    { path: "/hr/manageemployee", name: "Manage Employee" },
    { path: "/hr/employeeterminated", name: "Employee Terminated" },
    { path: "/hr/attendancesummary", name: "Attendance Summary" },
    { path: "/hr/leaveapproval", name: "Leave Approval" },
  ];
  const sidebarBg = useColorModeValue("#FFFFFF", "#111C44");
  const sidebarRadius = "20px";
  const sidebarMargins = "0px";
  const variantChange = "0.2s linear";
  return (
    <Box display={{ sm: "none", xl: "block" }} position="fixed">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="260px"
        maxW="260px"
        ms={{
          sm: "16px",
        }}
        my={{
          sm: "16px",
        }}
        h="calc(100vh - 32px)"
        ps="20px"
        pe="20px"
        m={sidebarMargins}
        filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
        borderRadius={sidebarRadius}
      >
        <VStack align="start" spacing={4}>
          {routes.map((route, index) => (
            <Link
              as={NavLink}
              to={route.path}
              key={index}
              _hover={{ textDecoration: "none", color: "teal.300" }}
              _activeLink={{ fontWeight: "bold", color: "teal.400" }}
            >
              <Text>{route.name}</Text>
            </Link>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

export default Sidebar;
