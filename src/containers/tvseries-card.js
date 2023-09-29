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

const TvSeriesCard = ({ series }) => {
  const {
    id,
    name,
    overview,
    popularity,
    poster_path,
    first_air_date,
    vote_count,
  } = series;
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
          <Image borderRadius="lg" src={posterUrl} alt={name} />
          <Heading size={["md", "lg"]} mt="4" mb="3" align={"center"}>
            {name || ""}
          </Heading>
          <Text>{truncateOverview(overview || "")}</Text>
          <HStack>
            <Text color="blue.600" fontWeight="bold">
              Release Date:{" "}
            </Text>
            <Text color="blue.600">{first_air_date || ""}</Text>
          </HStack>
          <HStack>
            <Text align={"left"} color="blue.600" fontWeight="bold">
              Popularity:{" "}
            </Text>
            <Text color="blue.600">{popularity || ""}</Text>
          </HStack>
          <HStack>
            <Text align={"left"} color="blue.600" fontWeight="bold">
              Vote Count:{" "}
            </Text>
            <Text color="blue.600">{vote_count || ""}</Text>
          </HStack>
          <Link to={`/tv-series/${id}`}>
            <Button variant="solid" colorScheme="blue" mt="6" mb="6" w='100%'>
              View More
            </Button>
          </Link>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default TvSeriesCard;
