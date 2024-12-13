import React from "react";
import {
  Box,
  VStack,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";

import { HomeIcon, PersonIcon, DocumentIcon, RocketIcon, SupportIcon } from "./Icons/Icons";
import IconBox from "./Icons/IconBox";

import Logo1 from "../assets/img/logo1.png";
import Logo2 from "../assets/img/logo2.png";
import { HSeparator } from "./Separator";

function Sidebar() {
  // Utils
  const routes = [
    {
      name: "",
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
        { path: "/ess/leaveapp", name: "Leave Application", icon: <DocumentIcon /> },
      ],
    },
    {
      name: "HUMAN RESOURCE",
      category: "hr",
      views: [
        { path: "/hr/masterdepartment", name: "Master Department", icon: <SupportIcon /> },
        { path: "/hr/masterposition", name: "Master Position", icon: <SupportIcon /> },
        { path: "/hr/manageemployee", name: "Manage Employee", icon: <PersonIcon /> },
        { path: "/hr/manageevent", name: "Manage Event", icon: <HomeIcon /> },
        { path: "/hr/employeeterminated", name: "Employee Terminated", icon: <PersonIcon /> },
        { path: "/hr/leaveapproval", name: "Leave Approval", icon: <RocketIcon /> },
      ],
    },
  ];

  const { colorMode } = useColorMode();
  const location = useLocation();
  const activeBg = useColorModeValue("white", "navy.700");
  const inactiveBg = useColorModeValue("white", "navy.800");
  const activeColor = useColorModeValue("gray.700", "white");
  const inactiveColor = useColorModeValue("gray.400", "white");
  const hoverBg = useColorModeValue("gray.200", "navy.700");
  const sidebarBg = useColorModeValue("white", "navy.800");

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
        height="calc(100vh - 32px)"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
        overflowY="auto"
        ps="20px"
        pe="20px"
        m="0px"
        filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
        borderRadius="20px"
      >
        <Box pt={"25px"} mb="12px">
          <Stack direction="row" spacing="12px" align="center" justify="center">
            {colorMode === "light" ? (
              <img src={Logo1} alt="Logo" />
            ) : (
              <img src={Logo2} alt="Logo" />
            )}
          </Stack>
          <HSeparator my="26px" />
        </Box>
        <VStack align="start" spacing={4} w="100%">
          {routes.map((route, index) => (
            <Box key={index} w="full">
              <Text fontWeight="bold" mb={2} pl={3}>
                {route.name}
              </Text>
              <VStack align="start" spacing={2} w="100%">
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
                        _hover={{ bg: isActive ? activeBg : hoverBg }}
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
