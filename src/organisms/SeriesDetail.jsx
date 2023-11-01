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
  Grid,
  Container,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { StarIcon } from "@chakra-ui/icons";

export const ADD_RATINGS = gql`
  mutation AddTvRatings($addTvRatingsId: ID!, $rating: Float!) {
    addTvRatings(id: $addTvRatingsId, rating: $rating) {
      code
      message
      rating
      success
    }
  }
`;

const SeriesDetail = ({ series }) => {
  const {
    name,
    popularity,
    first_air_date,
    overview,
    poster_path,
    production_companies,
    genres,
    seasons,
  } = series;

  const posterUrl = `https://image.tmdb.org/t/p/original/${poster_path}`;

  const [userRating, setUserRating] = useState(0);
  const [overallRating, setOverallRating] = useState(() => {
    const storedOverallRating = localStorage.getItem(
      `overallRating_${series.id}`
    );
    return parseFloat(storedOverallRating) || 0;
  });

  const handleStarClick = (rating) => {
    setUserRating(rating);
  };

  const [addTvRatings] = useMutation(ADD_RATINGS);

  const handleSubmitRating = async () => {
    try {
      const response = await addTvRatings({
        variables: {
          addTvRatingsId: series.id,
          rating: userRating,
        },
      });

      setOverallRating(response.data.addTvRatings.rating);
      localStorage.setItem(
        `overallRating_${series.id}`,
        response.data.addTvRatings.rating.toString()
      );
    } catch (error) {
      console.log("Error adding rating", error);
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
          <Link to="/tv">
            <ArrowLeftIcon colorScheme="teal" />
          </Link>
        </Button>

        <VStack my={10}>
          <Image borderRadius="md" src={posterUrl} alt={name} />
          <Text fontSize={["lg", "2xl"]} fontWeight="bold" color="blue" my={5}>
            {name || ""}
          </Text>
          <HStack>
            <Text fontSize={["md", "lg"]} color="blue.600" fontWeight="bold">
              📅 Release Date :{" "}
            </Text>
            <Text fontSize={["md", "lg"]}>{first_air_date || ""}</Text>
          </HStack>
          <HStack>
            <Text fontSize={["md", "lg"]} color="blue.600" fontWeight="bold">
              🔥 Popularity :{" "}
            </Text>
            <Text fontSize={["md", "lg"]}>{popularity || ""}</Text>
          </HStack>
          <HStack>
            <Text fontSize={["md", "lg"]} color="blue.600" fontWeight="bold">
              🔥 Seasons :{" "}
            </Text>
            <Text fontSize={["md", "lg"]}>{seasons.episode_count || ""}</Text>
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
                      width="auto"
                      height="80px"
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
        <Center>
          <Heading pb={5} fontSize="2xl" mb={5}>
            Seasons:
          </Heading>
        </Center>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
          gap={10}
          mx={[5, 10, 10, 20]}
        >
          {seasons?.map((ep) => (
            <Card boxShadow={"2xl"} key={ep.id}>
              <VStack my={5} mx={10}>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {ep.name}
                </Text>
                {ep.poster_path && (
                  <Image
                    width="auto"
                    height="300px"
                    borderRadius="md"
                    src={`https://image.tmdb.org/t/p/original/${ep.poster_path}`}
                    alt={`${ep.name}`}
                  />
                )}
                <Text mt={5} fontSize={["sm", "md"]}>
                  {ep.overview}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default SeriesDetail;
