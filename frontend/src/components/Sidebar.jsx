import React from "react";
import { Box, VStack, Button, Flex, Link, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";

import {
  HomeIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
  ClockIcon,
} from "./Icons/Icons";
import IconBox from "./Icons/IconBox";

function Sidebar() {
  const routes = [
    {
      name: "DASHBOARD",
      category: "dashboard",
      views: [
        { path: "/dashboard", name: "Dashboard", icon: <HomeIcon /> },
        { path: "/employeedirectory", name: "Employee Directory", icon: <PersonIcon /> },
      ],
    },
    {
      name: "ESS",
      category: "ess",
      views: [
        { path: "/ess/changepassword", name: "Change Password", icon: <SupportIcon /> },
        { path: "/ess/leaveapplication", name: "Leave Application", icon: <DocumentIcon /> },
      ],
    },
    {
      name: "HR",
      category: "hr",
      views: [
        { path: "/hr/masterdepartment", name: "Master Department", icon: <SupportIcon /> },
        { path: "/hr/masterposition", name: "Master Position", icon: <SupportIcon /> },
        { path: "/hr/manageemployee", name: "Manage Employee", icon: <PersonIcon /> },
        { path: "/hr/manageevent", name: "Manage Event", icon: <HomeIcon /> },
        { path: "/hr/employeeterminated", name: "Employee Terminated", icon: <PersonIcon /> },
        { path: "/hr/attendancesummary", name: "Attendance Summary", icon: <ClockIcon /> },
        { path: "/hr/leaveapproval", name: "Leave Approval", icon: <RocketIcon /> },
      ],
    },
  ];

  const activeBg = useColorModeValue("white", "navy.700");
  const inactiveBg = useColorModeValue("white", "navy.700");
  const activeColor = useColorModeValue("gray.700", "white");
  const inactiveColor = useColorModeValue("gray.400", "white");

  const sidebarBg = useColorModeValue("white", "navy.800");

  const location = useLocation();

  return (
    <Box display={{ sm: "none", xl: "block" }} position="fixed">
      <Box
        bg={sidebarBg}
        transition="0.2s linear"
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
        m="0px"
        filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
        borderRadius="20px"
      >
        <VStack align="start" spacing={4} w="100%">
          {routes.map((route, index) => (
            <Box key={index} w="full">
              {route.name !== "DASHBOARD" && (
                <Text fontWeight="bold" mb={2}>
                  {route.name}
                </Text>
              )}
              <VStack align="start" spacing={2} pl={route.name !== "DASHBOARD" ? 4 : 0} w="100%">
                {route.views.map((view, viewIndex) => {
                  const isActive = location.pathname === view.path;

                  return (
                    <NavLink to={view.path} key={viewIndex} style={{ width: "100%" }}>
                      <Button
                        boxSize="initial"
                        justifyContent="flex-start"
                        alignItems="center"
                        bg={isActive ? activeBg : inactiveBg}
                        transition="0.2s linear"
                        mb={{ xl: "6px" }}
                        mx={{ xl: "auto" }}
                        ps={{ sm: "10px", xl: "16px" }}
                        py="12px"
                        borderRadius="15px"
                        boxShadow={
                          isActive
                            ? useColorModeValue("0px 7px 11px rgba(0, 0, 0, 0.04)", "none")
                            : "none"
                        }
                        w="100%"
                        _hover={{ bg: isActive ? activeBg : "gray.200" }}
                        _active={{
                          bg: isActive ? activeBg : "inherit",
                          transform: "none",
                          borderColor: "transparent",
                        }}
                        _focus={{
                          boxShadow: isActive ? "0px 7px 11px rgba(0, 0, 0, 0.04)" : "none",
                        }}
                      >
                        <Flex>
                          <IconBox
                            bg={isActive ? "blue.500" : { inactiveBg }}
                            color={isActive ? "white" : "blue.500"}
                            h="30px"
                            w="30px"
                            me="12px"
                          >
                            {view.icon}
                          </IconBox>

                          <Text
                            color={isActive ? activeColor : inactiveColor}
                            my="auto"
                            fontSize="sm"
                          >
                            {view.name}
                          </Text>
                        </Flex>
                      </Button>
                    </NavLink>
                  );
                })}
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

export default Sidebar;
