import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import MovieCard from "../containers/movie-card";
import { Grid, Heading, Center } from "@chakra-ui/react";
import QueryResult from "../organisms/query-result";
import Lottie from "lottie-react";
import loadingData from "../assets/loading.json";

export const POPULAR_MOVIES = gql`
  query Popularmovies {
    popularmovies {
      id
      overview
      popularity
      poster_path
      release_date
      title
      vote_average
      vote_count
    }
  }
`;

const PopularMovies = () => {
  const [loading, setLoading] = useState(true);
  const { loading: queryLoading, error, data } = useQuery(POPULAR_MOVIES);

  useEffect(() => {
    if (!queryLoading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [queryLoading]);

  return (
    <>
      <Center>
        <Heading mt={20}>🔥 Popular Movies 🔥</Heading>
      </Center>
      {loading ? (
        <Center>
          <Lottie animationData={loadingData} />
        </Center>
      ) : (
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
          <QueryResult error={error} loading={loading} data={data}>
            {data?.popularmovies?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </QueryResult>
        </Grid>
      )}
    </>
  );
};

export default PopularMovies;
