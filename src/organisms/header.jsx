import React from "react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Image,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Links = ["Airing Now", "TV Series", "Popular Movies"];
const paths = ["/", "/tv-series", "/popular-movies"];

const NavLink = ({ children, path }) => {
  return (
    <Link to={path}>
      <Button variant="ghost" colorScheme="blue">
        {children}
      </Button>
    </Link>
  );
};

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const token = localStorage.getItem("token");
  console.log("token from header => ", token);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <HStack>
                <Image src={logo} boxSize={10} alt="logo" />
                <Text fontSize="lg" fontWeight="bold" color="#0011ff">
                  Cinema
                </Text>
              </HStack>
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link, index) => (
                <NavLink key={link} path={paths[index]}>
                  {link}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Button
              mr={4}
              colorScheme="gray"
              variant="outline"
              onClick={toggleColorMode}
            >
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Menu>
              {token ? (
                <Link to="/profile">
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar size={"sm"} />
                  </MenuButton>
                </Link>
              ) : (
                <Link to="/login">
                  <Button
                    mr={4}
                    color="white"
                    fontWeight="bold"
                    borderRadius="md"
                    bgGradient="linear(to-r, blue.400, green.400)"
                    _hover={{
                      bgGradient:
                        "linear(to-r, red.500, orange.500, yellow.500)",
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link, index) => (
                <NavLink key={link} path={paths[index]}>
                  {link}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
