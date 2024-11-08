import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Switch,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { tablesTableData } from "../components/variables/general";
import TablesTableRow from "../components/TablesTableRow";

const MasterDepartment = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");
  const colorIcons = useColorModeValue("gray.700", "white");
  const bgIcons = useColorModeValue("trasnparent", "navy.700");
  const bgIconsHover = useColorModeValue("gray.50", "whiteAlpha.100");

  return (
    <>
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

        <HStack
          flexDirection={{
            base: "column",
            xl: "row",
          }}
          justifyContent="space-between"
          px="40px"
          pb="30px"
          w="100%"
          spacing="30px"
          alignItems="start"
          minHeight="85vh"
        >
          <VStack
            spacing={2}
            alignItems={"left"}
            w="100%"
            background="white"
            px="20px"
            py="20px"
            borderRadius="16px"
          >
            <Box overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
              <Box p="6px 0px 22px 0px">
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Authors Table
                </Text>
              </Box>
              <Box>
                <Table variant="simple" color={textColor}>
                  <Thead>
                    <Tr my=".8rem" pl="0px" color="gray.400">
                      <Th pl="0px" borderColor={borderColor} color="gray.400">
                        Author
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Function
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Status
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Employed
                      </Th>
                      <Th borderColor={borderColor}></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tablesTableData.map((row, index, arr) => {
                      return (
                        <TablesTableRow
                          name={row.name}
                          logo={row.logo}
                          email={row.email}
                          subdomain={row.subdomain}
                          domain={row.domain}
                          status={row.status}
                          date={row.date}
                          isLast={index === arr.length - 1 ? true : false}
                          key={index}
                        />
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </VStack>

          <VStack w="400px">
            <Flex alignItems="center" justifyContent="center" mb="60px">
              <Flex
                direction="column"
                w="400px"
                background="transparent"
                borderRadius="15px"
                p="40px"
                bg={bgForm}
                boxShadow={useColorModeValue("0px 5px 14px rgba(0, 0, 0, 0.05)", "unset")}
              >
                <Text
                  fontSize="xl"
                  color={textColor}
                  fontWeight="bold"
                  textAlign="center"
                  mb="22px"
                >
                  Register With
                </Text>
                <HStack spacing="15px" justify="center" mb="22px">
                  <Flex
                    justify="center"
                    align="center"
                    w="75px"
                    h="75px"
                    borderRadius="8px"
                    border={useColorModeValue("1px solid", "0px")}
                    borderColor="gray.200"
                    cursor="pointer"
                    transition="all .25s ease"
                    bg={bgIcons}
                    _hover={{ bg: bgIconsHover }}
                  >
                    <Link href="#">
                      <Icon as={FaFacebook} color={colorIcons} w="30px" h="30px" />
                    </Link>
                  </Flex>
                  <Flex
                    justify="center"
                    align="center"
                    w="75px"
                    h="75px"
                    borderRadius="8px"
                    border={useColorModeValue("1px solid", "0px")}
                    borderColor="gray.200"
                    cursor="pointer"
                    transition="all .25s ease"
                    bg={bgIcons}
                    _hover={{ bg: bgIconsHover }}
                  >
                    <Link href="#">
                      <Icon
                        as={FaApple}
                        color={colorIcons}
                        w="30px"
                        h="30px"
                        _hover={{ filter: "brightness(120%)" }}
                      />
                    </Link>
                  </Flex>
                  <Flex
                    justify="center"
                    align="center"
                    w="75px"
                    h="75px"
                    borderRadius="8px"
                    border={useColorModeValue("1px solid", "0px")}
                    borderColor="gray.200"
                    cursor="pointer"
                    transition="all .25s ease"
                    bg={bgIcons}
                    _hover={{ bg: bgIconsHover }}
                  >
                    <Link href="#">
                      <Icon
                        as={FaGoogle}
                        color={colorIcons}
                        w="30px"
                        h="30px"
                        _hover={{ filter: "brightness(120%)" }}
                      />
                    </Link>
                  </Flex>
                </HStack>
                <Text fontSize="lg" color="gray.400" fontWeight="bold" textAlign="center" mb="22px">
                  or
                </Text>
                <FormControl>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Name
                  </FormLabel>
                  <Input
                    variant="auth"
                    fontSize="sm"
                    ms="4px"
                    type="text"
                    placeholder="Your full name"
                    mb="24px"
                    size="lg"
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Email
                  </FormLabel>
                  <Input
                    variant="auth"
                    fontSize="sm"
                    ms="4px"
                    type="email"
                    placeholder="Your email address"
                    mb="24px"
                    size="lg"
                  />
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Password
                  </FormLabel>
                  <Input
                    variant="auth"
                    fontSize="sm"
                    ms="4px"
                    type="password"
                    placeholder="Your password"
                    mb="24px"
                    size="lg"
                  />
                  <FormControl display="flex" alignItems="center" mb="24px">
                    <Switch id="remember-login" colorScheme="blue" me="10px" />
                    <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal">
                      Remember me
                    </FormLabel>
                  </FormControl>
                  <Button
                    fontSize="10px"
                    variant="dark"
                    fontWeight="bold"
                    w="100%"
                    h="45"
                    mb="24px"
                  >
                    SIGN UP
                  </Button>
                </FormControl>
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  maxW="100%"
                  mt="0px"
                >
                  <Text color={textColor} fontWeight="medium">
                    Already have an account?
                    <Link color={titleColor} as="span" ms="5px" href="#" fontWeight="bold">
                      Sign In
                    </Link>
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </VStack>
        </HStack>

        <Footer />
      </Box>
    </>
  );
};

export default MasterDepartment;
