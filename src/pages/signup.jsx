import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/signup",
        formData
      );
      console.log(response);

      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      });
      setError([]);
      toast.success("Successfully signup!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong!");
      }
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      bgGradient="linear(to-r, rgb(187, 247, 208), rgb(134, 239, 172), rgb(59, 130, 246))"
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"} color="black">
            Sign up Now
          </Heading>
          <Text fontSize={"xl"} fontWeight="700" color={"black"}>
            Register now to enjoy the exclusive features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </FormControl>
              </Box>
            </HStack>
            {error.includes("firstName should not be empty") && (
              <Text color="red.500" fontWeight={500} fontSize="md">
                First Name should not be empty
              </Text>
            )}
            <FormControl id="email" isRequired>
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
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {error.includes("password should not be empty") && (
                <Text color="red.500" fontWeight={500} pt={2} fontSize="md">
                  Password should not be empty
                </Text>
              )}
              {error.includes(
                "one lowercase letter, one uppercase letter, one number, and one special character."
              ) && (
                <Text color="red.500" fontWeight={500} pt={2} fontSize="md">
                  Password must contain at least one lowercase letter, one
                  uppercase letter, one number, and one special character.
                </Text>
              )}
              {error.includes("Password cannot contain spaces") && (
                <Text color="red.500" fontWeight={500} pt={2} fontSize="md">
                  Password cannot contain spaces
                </Text>
              )}
              {error.includes(
                "password must be longer than or equal to 8 characters"
              ) && (
                <Text color="red.500" fontWeight={500} pt={2} fontSize="md">
                  Password must be longer than or equal to 8 characters
                </Text>
              )}
            </FormControl>
            <Text align={"right"} color="blue.400" fontWeight="bold">
              <Link to={"/forgot-password"}>Forgot password?</Link>
            </Text>
            <Stack spacing={5} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSubmit}
              >
                Sign up
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
              {error.includes("Email already exists") && (
                <Text
                  color="red.500"
                  fontWeight={500}
                  pt={2}
                  fontSize="md"
                  align="center"
                >
                  Email already exists
                </Text>
              )}
              <Stack align="center">
                <HStack>
                  <Text>Already registered? </Text>
                  <Text color="blue.400" fontWeight="bold" as="u">
                    <Link to={"/login"}>Login here</Link>
                  </Text>
                </HStack>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Signup;
