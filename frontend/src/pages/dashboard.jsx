import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Icon,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import avatar5 from "../assets/img/avatars/avatar5.png";
import ImageArchitect1 from "../assets/img/ImageArchitect1.png";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Dashboard = () => {
  // Utils
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");

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
        <VStack
          justifyContent="start"
          px={{ base: "30px", xl: "40px" }}
          w="100%"
          spacing={{ base: "20px", xl: "30px" }}
          alignItems="start"
          minHeight="85vh"
        >
          <Flex
            direction={{ sm: "column", md: "row" }}
            maxH="330px"
            justifyContent={{ sm: "center", md: "space-between" }}
            align="center"
            backdropFilter="blur(21px)"
            boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
            border="1.5px solid"
            borderColor={borderProfileColor}
            bg={bgProfile}
            p="24px"
            borderRadius="16px"
            w="100%"
            m="0px"
          >
            <Flex
              align="center"
              mb={{ sm: "10px", md: "0px" }}
              direction={{ sm: "column", md: "row" }}
              px={{ base: "10px", xl: "20px" }}
              w={{ sm: "100%" }}
              textAlign={{ sm: "center", md: "start" }}
            >
              <Avatar me={{ md: "22px" }} src={avatar5} w="80px" h="80px" borderRadius="15px" />
              <Flex direction="column" maxWidth="100%" my={{ sm: "14px" }}>
                <Text
                  fontSize={{ sm: "lg", lg: "xl" }}
                  color={textColor}
                  fontWeight="bold"
                  ms={{ sm: "8px", md: "0px" }}
                >
                  Hello, Alec Thompson !
                </Text>
                <Text fontSize={{ sm: "sm", md: "md" }} color={emailColor} fontWeight="semibold">
                  Human Resources | HR Manager
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Card Event */}
          <Card px={{ base: "10px", xl: "20px" }} py="20px" borderRadius="16px">
            <CardHeader p="6px 0px 0px 0px" mb="0px">
              <Flex direction="column">
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Events
                </Text>
                <Text fontSize="sm" color="gray.400" fontWeight="400">
                  Stay updated with upcoming company events
                </Text>
              </Flex>
            </CardHeader>
            <CardBody pl="6px">
              <Grid
                templateColumns={{ sm: "1fr", md: "1fr 1fr", xl: "repeat(4, 1fr)" }}
                templateRows={{ sm: "1fr 1fr 1fr auto", md: "1fr 1fr", xl: "1fr" }}
                gap="24px"
              >
                <Flex direction="column" border="1px solid lightgray" borderRadius="15px">
                  <Box aspectRatio={2 / 1} mb="20px" position="relative" borderRadius="15px">
                    <Image src={ImageArchitect1} borderRadius="15px" objectFit="cover" />
                    <Box
                      w="100%"
                      h="100%"
                      position="absolute"
                      top="0"
                      borderRadius="15px"
                      bg="linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%)"
                    ></Box>
                  </Box>
                  <Flex direction="column" px="10px">
                    <Text fontSize="md" color="gray.400" fontWeight="600" mb="10px">
                      Events | 31 December 2024
                    </Text>
                    <Text fontSize="xl" color={textColor} fontWeight="bold" mb="10px">
                      Event Name
                    </Text>
                    <Text fontSize="md" color="gray.400" fontWeight="400" mb="20px">
                      As Uber works through a huge amount of internal management turmoil.
                    </Text>
                  </Flex>
                </Flex>

                <Button
                  p="0px"
                  bg="transparent"
                  border="1px solid lightgray"
                  borderRadius="15px"
                  minHeight={{ sm: "200px", md: "100%" }}
                >
                  <Flex direction="column" justifyContent="center" align="center">
                    <Icon as={FaPlus} color={textColor} fontSize="lg" mb="12px" />
                    <Text fontSize="lg" color={textColor} fontWeight="bold">
                      Create a New Project
                    </Text>
                  </Flex>
                </Button>
              </Grid>
            </CardBody>
          </Card>
        </VStack>

        <Footer />
      </Box>
    </>
  );
};

export default Dashboard;
