import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <Center>
        <Heading>You are not logged in!</Heading>
      </Center>
    );
  }

  try {
    const response = await axios.get("http://localhost:4000/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const editProfile = async (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return (
        <Center>
          <Heading>You are not logged in!</Heading>
        </Center>
      );
    }

    e.preventDefault();

    try {
      await axios.patch("http://localhost:4000/users", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        email: "",
        firstName: "",
        lastName: "",
      });
      setError([]);
      toast.success("Edit Profile successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong!");
      }
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await getProfile();
      setUserProfile(profile);
    };
    fetchUserProfile();
  }, []);

  return (
    <>
      <Center h="100vh" flexDir="column">
        <Stack spacing={5}>
          <Heading>User Profile</Heading>
          {userProfile ? (
            <>
              <Stack spacing={4} mt={8}>
                <Text>Email: {userProfile.email}</Text>
                <Text>First Name: {userProfile.firstName}</Text>
                <Text>Last Name: {userProfile.lastName}</Text>
              </Stack>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                  align={"center"}
                  justify={"center"}
                >
                  <ModalCloseButton />
                  <Stack
                    spacing={4}
                    w={"full"}
                    maxW={"md"}
                    rounded={"xl"}
                    boxShadow={"lg"}
                    p={6}
                  >
                    <ModalHeader
                      lineHeight={1.1}
                      fontSize={{ base: "2xl", sm: "3xl" }}
                    >
                      Edit User Details
                    </ModalHeader>

                    <FormControl id="email" isRequired>
                      <FormLabel>Email address</FormLabel>
                      <Input
                        defaultValue={userProfile.email}
                        placeholder="your-email@example.com"
                        _placeholder={{ color: "gray.500" }}
                        type="email"
                        name="email"
                        onChange={handleChange}
                      />
                    </FormControl>
                    {error.includes("Invalid email") && (
                      <Text color="red.500" fontWeight={500} fontSize="md">
                        Invalid email address
                      </Text>
                    )}
                    <FormControl id="firstName">
                      <FormLabel>First Name</FormLabel>
                      <Input
                        defaultValue={userProfile.firstName}
                        placeholder="First Name"
                        _placeholder={{ color: "gray.500" }}
                        type="text"
                        name="firstName"
                        onChange={handleChange}
                      />
                    </FormControl>
                    {error.includes("firstName must be a string") && (
                      <Text color="red.500" fontWeight={500} fontSize="md">
                        First name must be a string
                      </Text>
                    )}
                    <FormControl id="lastName">
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        defaultValue={userProfile.lastName}
                        name="lastName"
                        placeholder="Last Name"
                        _placeholder={{ color: "gray.500" }}
                        type="text"
                        onChange={handleChange}
                      />
                    </FormControl>
                    {error.includes("lastName must be a string") && (
                      <Text color="red.500" fontWeight={500} fontSize="md">
                        First name must be a string
                      </Text>
                    )}
                    <Stack spacing={6} direction={["column", "row"]}>
                      <Button
                        bg={"red.400"}
                        color={"white"}
                        w="full"
                        _hover={{
                          bg: "red.500",
                        }}
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        bg={"blue.400"}
                        color={"white"}
                        w="full"
                        _hover={{
                          bg: "blue.500",
                        }}
                        onClick={editProfile}
                      >
                        Submit
                      </Button>
                    </Stack>
                  </Stack>
                </ModalContent>
              </Modal>
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
            </>
          ) : (
            <Center>
              <Heading>You are not logged in!</Heading>
            </Center>
          )}
          <Button onClick={onOpen}>Edit User</Button>
        </Stack>
      </Center>
    </>
  );
};

export default Profile;
