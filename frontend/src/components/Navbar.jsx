import React, { useState } from "react";
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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { SettingsIcon } from "./Icons/Icons";
import { HSeparator } from "./Separator";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleOpenDrawer = () => setIsOpen(true);
  const handleCloseDrawer = () => setIsOpen(false);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      position="static"
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
      px="40px"
      mt="22px"
      pb="8px"
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
      >
        {/* Navbar Kiri, Done */}
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

        {/* Navbar Kanan belum Done, tambah menu settings 
        yang isi nya ada logout sama ubah tema light dark, 
        kemudian notif yang gada fungsi nya dlu sementara */}

        <Flex
          pe={{ sm: "0px", md: "16px" }}
          w={{ sm: "100%", md: "auto" }}
          alignItems="center"
          flexDirection="row"
        >
          <SettingsIcon
            cursor="pointer"
            ms={{ base: "16px", xl: "0px" }}
            me="16px"
            onClick={handleOpenDrawer}
            w="18px"
            h="18px"
          />
        </Flex>

        <Drawer isOpen={isOpen} onClose={handleCloseDrawer}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerCloseButton />
              <Text fontSize="xl" fontWeight="bold" mt="16px">
                Chakra Portal Options
              </Text>
              <HSeparator />
            </DrawerHeader>
            <DrawerBody>
              <Flex flexDirection="column">
                <Flex justifyContent="space-between" alignItems="center" mb="24px">
                  <Text fontSize="md" fontWeight="600" mb="4px">
                    Dark/Light
                  </Text>
                  <Button
                    onClick={toggleColorMode}
                    color={colorMode === "light" ? "Dark" : "Light"}
                  >
                    Toggle {colorMode === "light" ? "Dark" : "Light"}
                  </Button>
                </Flex>
                <HSeparator />
                <Box mt="24px">
                  <Link href="#" w="100%">
                    <Button
                      w="100%"
                      bg={useColorModeValue("white", "transparent")}
                      border="1px solid"
                      borderColor={useColorModeValue("gray.700", "white")}
                      color={useColorModeValue("gray.700", "white")}
                      fontSize="xs"
                      variant="no-effects"
                      px="20px"
                      mb="16px"
                    >
                      <Text textDecoration="none">Log Out</Text>
                    </Button>
                  </Link>
                </Box>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Flex>
  );
}

export default Navbar;
