import React from "react";
import {
  Button,
  CardBody,
  Text,
  Heading,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Image, Card } from "@chakra-ui/react";

const MovieCard = ({ movie }) => {
  const {
    title,
    poster_path,
    release_date,
    popularity,
    id,
    overview,
    vote_average,
  } = movie;
  const posterUrl = `https://image.tmdb.org/t/p/original/${poster_path}`;

  const truncateOverview = (text) => {
    if (text.length > 100) {
      return text.substring(0, 100) + "...";
    }
    return text;
  };

  return (
    <Card
      boxShadow="xl"
      _hover={{
        boxShadow: "dark-lg",
      }}
    >
      <CardBody>
        <Stack>
          <Image borderRadius="lg" src={posterUrl} alt={title} />
          <Heading size={["md", "lg"]} mt="4" mb="3" align={"center"}>
            {title || ""}
          </Heading>
          <Text>{truncateOverview(overview || "")}</Text>
          <HStack>
            <Text color="blue.600" fontWeight="bold">
              Release Date:{" "}
            </Text>
            <Text color="blue.600">{release_date || ""}</Text>
          </HStack>
          <HStack>
            <Text align={"left"} color="blue.600" fontWeight="bold">
              Popularity:{" "}
            </Text>
            <Text color="blue.600">{popularity || ""}</Text>
          </HStack>
          <HStack>
            <Text align={"left"} color="blue.600" fontWeight="bold">
              Vote Average:{" "}
            </Text>
            <Text color="blue.600">{vote_average || ""}</Text>
          </HStack>
          <Link to={`/movies/${id}`}>
            <Button variant="solid" colorScheme="blue" mt="6" mb="6" w="100%">
              View More
            </Button>
          </Link>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default MovieCard;
