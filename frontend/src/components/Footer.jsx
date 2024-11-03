import { Flex, Link, List, ListItem, Text } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <>
      <Flex
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
        pb="20px"
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
    </>
  );
};

export default Footer;
