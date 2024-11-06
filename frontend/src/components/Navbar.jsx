import React from "react";
import {
  Box,
  useColorModeValue,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  List,
  ListItem,
  Link,
  Flex,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const routes = [
    { path: "/dashboard", name: "Dashboard", category: "" },
    { path: "/employeedirectory", name: "Employee Directory", category: "" },
    { path: "/ess/changepassword", name: "Change Password", category: "Employee Self Service" },
    { path: "/ess/leaveapplication", name: "Leave Application", category: "Employee Self Service" },
    { path: "/hr/masterdepartment", name: "Master Department", category: "Human Resource" },
    { path: "/hr/masterposition", name: "Master Position", category: "Human Resource" },
    { path: "/hr/manageevent", name: "Manage Event", category: "Human Resource" },
    { path: "/hr/manageemployee", name: "Manage Employee", category: "Human Resource" },
    { path: "/hr/employeeterminated", name: "Employee Terminated", category: "Human Resource" },
    { path: "/hr/attendancesummary", name: "Attendance Summary", category: "Human Resource" },
    { path: "/hr/leaveapproval", name: "Leave Approval", category: "Human Resource" },
  ];
  const location = useLocation();
  const activeRoute = routes.find((route) => route.path === location.pathname);

  return (
    <Flex
      position="absolute"
      boxShadow="none"
      bg="none"
      borderColor="transparent"
      filter="none"
      backdropFilter="none"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      borderRadius="16px"
      display="flex"
      minH="75px"
      justifyContent={{ xl: "center" }}
      lineHeight="25.6px"
      mx="auto"
      mt="22px"
      pb="8px"
      px={{
        sm: "15px",
        md: "30px",
      }}
      ps={{
        xl: "12px",
      }}
      pt="8px"
      top="18px"
      w={{ sm: "calc(100vw - 30px)", xl: "calc(100vw - 75px - 275px)" }}
    >
      <Flex
        w="100%"
        flexDirection={{
          base: "column",
          xl: "row",
        }}
        alignItems={{ xl: "center" }}
        justifyContent="space-between"
        px="30px"
        pb="20px"
      >
        <Box mb={{ sm: "8px", md: "0px" }}>
          <Breadcrumb>
            <BreadcrumbItem color={"white"}>
              <BreadcrumbLink href="/dashboard" color={"white"}>
                Pages
              </BreadcrumbLink>
            </BreadcrumbItem>

            {activeRoute.category && (
              <BreadcrumbItem color="white">
                <BreadcrumbLink href="/dashboard" color="white">
                  {activeRoute.category}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            <BreadcrumbItem color={"white"}>
              <BreadcrumbLink href={activeRoute.path} color={"white"}>
                {activeRoute ? activeRoute.name : "Page Not Found"}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Link
            color={"white"}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            _hover={{ color: "white" }}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
          >
            {activeRoute ? activeRoute.name : "Page Not Found"}
          </Link>
        </Box>

        <List display="flex">
          <ListItem
            me={{
              base: "20px",
              md: "44px",
            }}
          >
            <Link
              color="gray.400"
              href="https://www.linkedin.com/in/muchammad-ryan-adiyantara-817377225/"
            >
              LinkedIn
            </Link>
          </ListItem>
          <ListItem
            me={{
              base: "20px",
              md: "44px",
            }}
          >
            <Link color="gray.400" href="https://www.instagram.com/ryandyntr/">
              Instagram
            </Link>
          </ListItem>
        </List>
      </Flex>
    </Flex>
  );
}

export default Navbar;
