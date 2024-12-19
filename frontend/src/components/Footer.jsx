import React from "react";
import { Flex, Link, List, ListItem, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <>
      <Flex
        as="footer"
        flexDirection={{
          base: "column",
          xl: "row",
        }}
        alignItems={{
          base: "center",
          xl: "start",
        }}
        justifyContent="space-between"
        px="30px"
        py="20px"
        w="100%"
      >
        <Text
          color="gray.400"
          textAlign={{
            base: "center",
            xl: "start",
          }}
          mb={{ base: "20px", xl: "0px" }}
        >
          &copy; {1900 + new Date().getYear()}, <Text as="span">Ryan Adiyantara</Text>
        </Text>
        <List display="flex" gap={{ base: "20px", md: "44px" }}>
          <ListItem>
            <Link
              color="gray.400"
              href="https://www.linkedin.com/in/muchammad-ryan-adiyantara-817377225/"
            >
              LinkedIn
            </Link>
          </ListItem>
          <ListItem>
            <Link color="gray.400" href="https://www.instagram.com/ryandyntr/">
              Instagram
            </Link>
          </ListItem>
        </List>
      </Flex>
    </>
  );
};

export default Footer;
