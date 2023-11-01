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
  Grid,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, gql } from "@apollo/client";
import QueryResult from "../organisms/query-result";
import MovieCard from "../containers/movie-card";
import Footer from "../organisms/Footer";

export const GET_FAVOURITES = gql`
  query Favourites {
    favourites {
      backdrop_path
      genre_ids
      id
      overview
      popularity
      poster_path
      release_date
      title
      vote_average
    }
  }
`;

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
    const response = await axios.get(`${process.env.REACT_APP_PORT}users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
  const [errors, setErrors] = useState([]);

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
      await axios.patch(`${process.env.REACT_APP_PORT}users`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        email: "",
        firstName: "",
        lastName: "",
      });
      setErrors([]);
      toast.success("Edit Profile successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.message);
      } else {
        setErrors("Something went wrong!");
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

  const { loading: queryLoading, error, data } = useQuery(GET_FAVOURITES);

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
                <ModalContent align={"center"} justify={"center"}>
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
                    {errors.includes("Invalid email") && (
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
                    {errors.includes("firstName must be a string") && (
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
                    {errors.includes("lastName must be a string") && (
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
      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ]}
        gap={10}
        m={[5, 10, 10, 20]}
      >
        <QueryResult error={error} loading={queryLoading} data={data}>
          {data?.favourites?.map((favorite) => (
            <MovieCard key={favorite.id} movie={favorite} />
          ))}
        </QueryResult>
      </Grid>
      <Footer/>
    </>
  );
};

export default Profile;
