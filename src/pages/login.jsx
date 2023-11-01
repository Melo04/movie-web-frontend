import React, {useState} from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
    HStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../organisms/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_PORT}auth/signin`,
        formData
      );
      localStorage.setItem("token", response.data.access_token);

      setFormData({
        email: "",
        password: "",
      });
      setError([]);
      toast.success("Successfully login!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate("/profile");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong!");
      }
    }
  };

  return (
    <>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
        bgGradient="linear(to-r, purple.400, yellow.400)"
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"} color="black">
              Sign in Now
            </Heading>
            <Text fontSize={"xl"} fontWeight="700" color={"black"}>
              Login to your account here
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            px={20}
            py={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>
              {error.includes("email should not be empty") && (
                <Text color="red.500" fontWeight={500} fontSize="md">
                  Email should not be empty
                </Text>
              )}
              {error.includes("Invalid email address") && (
                <Text color="red.500" fontWeight={500} fontSize="md">
                  Invalid email address
                </Text>
              )}
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormControl>
              {error.includes("password should not be empty") && (
                <Text color="red.500" fontWeight={500} fontSize="md">
                  Password should not be empty
                </Text>
              )}
              <Text align={"right"} color="blue.400" fontWeight="bold">
                <Link to={"/forgot-password"}>Forgot password?</Link>
              </Text>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSubmit}
              >
                Sign in
              </Button>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
              {error.includes("This user does not exist") && (
                <Text
                  color="red.500"
                  fontWeight={500}
                  pt={2}
                  fontSize="md"
                  align="center"
                >
                  This user does not exist
                </Text>
              )}
              {error.includes("Invalid password") && (
                <Text
                  color="red.500"
                  fontWeight={500}
                  pt={2}
                  fontSize="md"
                  align="center"
                >
                  Invalid password
                </Text>
              )}
              <Stack align="center">
                <HStack>
                  <Text>Not yet registered? </Text>
                  <Text color="blue.400" fontWeight="bold" as="u">
                    <Link to={"/signup"}>Register here</Link>
                  </Text>
                </HStack>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      <Footer/>
    </>
  );
}

export default Login;