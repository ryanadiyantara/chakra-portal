import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useUserStore } from "../store/user";
import { useEventStore } from "../store/event";
import { useEffect, useState } from "react";

const Dashboard = () => {
  // Utils
  const { currentUsers, fetchCurrentUser } = useUserStore();
  const { events, fetchEvent } = useEventStore();

  const [showAll, setShowAll] = useState(false);
  const [expandedStates, setExpandedStates] = useState({});

  const toggleText = (id) => {
    setExpandedStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");

  // Services
  useEffect(() => {
    fetchCurrentUser();
    fetchEvent();
  }, [fetchCurrentUser, fetchEvent]);

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
              <Avatar
                me={{ md: "22px" }}
                src={"/public/uploads/" + currentUsers.profilePicture}
                w="80px"
                h="80px"
                borderRadius="15px"
              />
              <Flex direction="column" maxWidth="100%" my={{ sm: "14px" }}>
                <Text
                  fontSize={{ sm: "lg", lg: "xl" }}
                  color={textColor}
                  fontWeight="bold"
                  ms={{ sm: "8px", md: "0px" }}
                >
                  Hello, {currentUsers?.user_name || "..."} !
                </Text>
                <Text fontSize={{ sm: "sm", md: "md" }} color={emailColor} fontWeight="semibold">
                  {currentUsers?.department_id?.department_name || "..."} |{" "}
                  {currentUsers?.position_id?.position_name || "..."}
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
                alignItems="flex-start"
              >
                {events
                  .filter((event) => !event.na)
                  .filter((event) => !event.del)
                  .filter((event) => new Date(event.event_startDate) > new Date())
                  .sort((a, b) => new Date(a.event_startDate) - new Date(b.event_startDate))
                  .slice(0, showAll ? events.length : 4)
                  .map((event) => {
                    const isExpanded = expandedStates[event._id] || false;
                    return (
                      <Flex
                        key={event._id}
                        direction="column"
                        border="1px solid lightgray"
                        borderRadius="15px"
                        minHeight="420px"
                      >
                        <Box
                          aspectRatio={2 / 1}
                          mb="20px"
                          position="relative"
                          borderRadius="15px"
                          overflow="hidden"
                        >
                          <Image
                            src={"/public/uploads/" + event.poster_path}
                            alt={event.poster_path}
                            borderRadius="15px"
                            layout="fill"
                            objectFit="cover"
                          />
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
                          <Text fontSize="xl" color={textColor} fontWeight="bold" mb="10px">
                            Event | {event.event_name}
                          </Text>
                          <Text fontSize="md" color="gray.400" fontWeight="600" mb="10px">
                            {(() => {
                              const startDate = new Date(event.event_startDate);
                              const endDate = new Date(event.event_endDate);

                              const startDay = startDate
                                .toLocaleDateString("en-GB", {
                                  weekday: "long",
                                  day: "2-digit",
                                })
                                .replace(" ", ", ");

                              const startMonth = startDate.toLocaleDateString("en-GB", {
                                month: "long",
                              });

                              const startYear = startDate.getFullYear();

                              const endDay = endDate.toLocaleDateString("en-GB", {
                                day: "2-digit",
                              });

                              const endMonth = endDate.toLocaleDateString("en-GB", {
                                month: "long",
                              });

                              const endYear = endDate.getFullYear();

                              if (
                                startDate.getDate() === endDate.getDate() &&
                                startDate.getMonth() === endDate.getMonth() &&
                                startYear === endYear
                              ) {
                                return `${startDay} ${startMonth} ${startYear}`;
                              }

                              if (startYear === endYear) {
                                if (startDate.getMonth() === endDate.getMonth()) {
                                  return `${startDay} - ${endDay} ${endMonth} ${endYear}`;
                                } else {
                                  return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
                                }
                              } else {
                                return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
                              }
                            })()}
                          </Text>
                          <Text fontSize="md" color="gray.400" fontWeight="400" mb="5px">
                            {isExpanded
                              ? event.description
                              : `${event.description.substring(0, 50)}...`}
                          </Text>
                          {event.description.length > 50 && (
                            <Text
                              fontSize="md"
                              fontWeight="400"
                              color="blue.500"
                              cursor="pointer"
                              display="inline"
                              mb="20px"
                              onClick={() => toggleText(event._id)}
                            >
                              {isExpanded ? "Read less" : "Read more"}
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                    );
                  })}
              </Grid>
              <Flex justify="center" mt="20px">
                {!showAll && events.length > 4 && (
                  <Button
                    fontSize="xs"
                    borderRadius="5px"
                    variant="primary"
                    onClick={() => setShowAll(true)}
                  >
                    Show More
                  </Button>
                )}
                {showAll && (
                  <Button
                    fontSize="xs"
                    borderRadius="5px"
                    variant="primary"
                    onClick={() => setShowAll(false)}
                    ml="4"
                  >
                    Show Less
                  </Button>
                )}
              </Flex>
            </CardBody>
          </Card>
        </VStack>

        <Footer />
      </Box>
    </>
  );
};

export default Dashboard;
