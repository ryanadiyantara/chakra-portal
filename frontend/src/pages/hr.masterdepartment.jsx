import {
  Box,
  Button,
  Flex,
  HStack,
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
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { tablesTableData } from "../components/variables/general";
import TablesTableRow from "../components/TablesTableRow";

const MasterDepartment = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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
          <VStack background="bisque" w="260px">
            <Text>Test Kalau kalau kalau</Text>
          </VStack>
        </HStack>

        <Footer />
      </Box>
    </>
  );
};

export default MasterDepartment;
