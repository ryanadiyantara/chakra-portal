import {
  Box,
  Flex,
  HStack,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
  Td,
  Image,
} from "@chakra-ui/react";
import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useUserStore } from "../store/user";
import { useEffect } from "react";

const EmployeeDirectory = () => {
  // BE
  const { users, departments, positions, fetchUser, getDepartmentData, getPositionData } =
    useUserStore();

  useEffect(() => {
    fetchUser();
    getDepartmentData();
    getPositionData();
  }, [fetchUser, getDepartmentData, getPositionData]);

  // FE
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");

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
              <Box p="6px 0px 22px 0px">
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Employee List
                </Text>
              </Box>
              <Box>
                <Table variant="simple" color={textColor}>
                  <Thead>
                    <Tr my=".8rem" pl="0px" color="gray.400">
                      <Th pl="0px" borderColor={borderColor} color="gray.400">
                        Name & Email
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Department & Position
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Employee ID
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Birth Date
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Employed
                      </Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {users
                      .filter((user) => !user.na)
                      .map((user) => {
                        const department = departments.find(
                          (dept) => dept._id === user.department_id
                        );
                        const position = positions.find((post) => post._id === user.position_id);
                        return (
                          <Tr key={user._id}>
                            <Td
                              borderColor={borderColor}
                              width={{ base: "auto", xl: "200px" }}
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
                                <Flex direction="column" width={{ base: "auto", sm: "200px" }}>
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
                                Nanti Employee ID
                              </Text>
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
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </VStack>
        </HStack>

        <Footer />
      </Box>
    </>
  );
};

export default EmployeeDirectory;
