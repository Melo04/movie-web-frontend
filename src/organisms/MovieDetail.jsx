import React, { useState } from "react";
import {
  Image,
  VStack,
  Text,
  Card,
  Heading,
  CardBody,
  HStack,
  Tag,
  Button,
  Box,
  Center,
  Container,
  Icon,
} from "@chakra-ui/react";
import { ArrowLeftIcon, StarIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import { gql, useMutation } from "@apollo/client";
import { AiFillHeart } from "react-icons/ai";

export const ADD_RATINGS = gql`
  mutation Mutation($addMovieRatingsId: ID!, $rating: Float!) {
    addMovieRatings(id: $addMovieRatingsId, rating: $rating) {
      code
      message
      rating
      success
    }
  }
`;

export const ADD_FAVOURITES = gql`
  mutation Mutation($addToFavouritesId: ID!, $favorite: Boolean!) {
    addToFavourites(id: $addToFavouritesId, favorite: $favorite) {
      code
      message
      favorite
      success
    }
  }
`;

const MovieDetail = ({ movie, reviews }) => {
  const {
    title,
    popularity,
    vote_average,
    overview,
    release_date,
    poster_path,
    production_companies,
    genres,
  } = movie;

  const [userRating, setUserRating] = useState(0);
  const [favourite, setFavourite] = useState(false);

  const [overallRating, setOverallRating] = useState(() => {
    const storedOverallRating = localStorage.getItem(
      `overallRating_${movie.id}`
    );
    return parseFloat(storedOverallRating) || 0;
  });

  const handleStarClick = (rating) => {
    setUserRating(rating);
  };
  console.log(reviews);

  const posterUrl = `https://image.tmdb.org/t/p/original/${poster_path}`;

  const [addMovieRatings] = useMutation(ADD_RATINGS);
  const [addToFavourites] = useMutation(ADD_FAVOURITES);

  const handleSubmitRating = async () => {
    try {
      const response = await addMovieRatings({
        variables: {
          addMovieRatingsId: movie.id,
          rating: userRating,
        },
      });
      console.log("rating added");

      setOverallRating(response.data.addMovieRatings.rating);
      localStorage.setItem(
        `overallRating_${movie.id}`,
        response.data.addMovieRatings.rating.toString()
      );
    } catch (error) {
      console.log("Error adding rating", error);
    }
  };

  const handleSubmitFavourite = async () => {
    try {
      await addToFavourites({
        variables: {
          addToFavouritesId: movie.id,
          favorite: favourite,
        },
      });
      console.log("favourite added");
    } catch (error) {
      console.log("Error adding favourite", error);
    }
  };

  const modalRating = (
    <Center>
      <VStack gap={5}>
        <Heading fontSize={"20px"}>Rate this movie</Heading>
        <HStack gap={4}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <StarIcon
              key={rating}
              color={rating <= userRating ? "yellow.500" : "gray.200"}
              cursor="pointer"
              boxSize={5}
              onClick={() => handleStarClick(rating)}
            />
          ))}
        </HStack>
        <Text fontWeight={600} fontSize={"20px"}>
          {userRating} stars
        </Text>
        <Button
          variant="outline"
          colorScheme="blue"
          onClick={handleSubmitRating}
        >
          Submit
        </Button>
        <Text fontSize={"20px"}>
          Overall Ratings:{" "}
          {overallRating !== null ? `${overallRating} stars` : "N/A"}
        </Text>
      </VStack>
    </Center>
  );

  return (
    <>
      <Container>
        <Button mt={5}>
          <Link to="/">
            <ArrowLeftIcon colorScheme="teal" />
          </Link>
        </Button>
        <VStack my={10}>
          <Image borderRadius="md" src={posterUrl} alt={title} />
          <Text fontSize={["lg", "2xl"]} fontWeight="bold" color="blue" my={5}>
            {title || ""}
          </Text>
          <HStack>
            <Text fontSize={["md", "lg"]} color="blue.600" fontWeight="bold">
              📅 Release Date :{" "}
            </Text>
            <Text fontSize={["md", "lg"]}>{release_date || ""}</Text>
          </HStack>
          <HStack>
            <Text fontSize={["md", "lg"]} color="blue.600" fontWeight="bold">
              🔥 Popularity :{" "}
            </Text>
            <Text fontSize={["md", "lg"]}>{popularity || ""}</Text>
          </HStack>
          <HStack>
            <Text fontSize={["md", "lg"]} color="blue.600" fontWeight="bold">
              🗳️ Average Vote :{" "}
            </Text>
            <Text fontSize={["md", "lg"]}>{vote_average || ""}</Text>
          </HStack>
          <HStack mt={5}>
            {genres.map((genre) => {
              return (
                <Tag
                  variant="solid"
                  size="lg"
                  colorScheme="twitter"
                  mr={3}
                  mb={3}
                  key={genre.id}
                >
                  {genre.name}
                </Tag>
              );
            })}
          </HStack>
          <Button
            my={5}
            bg="white"
            color="red"
            variant="solid"
            boxShadow={"2xl"}
            _hover={{ bg: "red", color: "white" }}
            onClick={handleSubmitFavourite}
          >
            <Icon as={AiFillHeart} mr={2} />
            Add to Favourites
          </Button>
          <Card p={3} my={5} boxShadow={"2xl"}>
            <CardBody>
              <Heading fontSize="md" mb={2}>
                Overview Of The Movie:
              </Heading>
              <Text>{overview || ""}</Text>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      <Box mx={[20, 50, 100]} mb={[10, 20, 50]}>
        <Card boxShadow={"2xl"}>
          <CardBody>
            <Heading pb={5} fontSize="md">
              Production Companies:
            </Heading>
            {production_companies?.map((company) => (
              <Tag
                variant="solid"
                size="lg"
                colorScheme="gray"
                mr={3}
                mb={3}
                key={company.id}
              >
                <VStack my={5} mx={10}>
                  <Text fontSize={["lg"]} mb={2}>
                    {company.name}
                  </Text>
                  {company.logo_path && (
                    <Image
                      width="250px"
                      height="auto"
                      borderRadius="md"
                      src={`https://image.tmdb.org/t/p/original/${company.logo_path}`}
                      alt={`${company.name}`}
                    />
                  )}
                </VStack>
              </Tag>
            ))}
          </CardBody>
        </Card>
        <VStack mt={10}>
          <Card mt={5} colorScheme={"gray"} boxShadow={"2xl"}>
            <CardBody px={20}>{modalRating}</CardBody>
          </Card>
        </VStack>
      </Box>

      <Box mx={[20, 50, 50]} mb={[10, 20, 50]}>
        <VStack spacing={0} align={"center"}>
          <Heading bgGradient="linear(to-r, #ff0000, #f7ff5c)" bgClip="text">
            Movie Reviews
          </Heading>
          <Text fontSize={["xl"]} fontWeight="bold" my={5}>
            Look at what our reviewers said
          </Text>
        </VStack>
        {reviews.length > 0 ? (
          <ReviewCard reviews={reviews} />
        ) : (
          <Center>
            <Tag px={10}>
              <Text fontSize={["lg"]} fontWeight="bold" my={5}>
                No reviews yet
              </Text>
            </Tag>
          </Center>
        )}
      </Box>
    </>
  );
};

export default MovieDetail;
