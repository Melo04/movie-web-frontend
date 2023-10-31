import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import MovieCard from "../containers/movie-card";
import { Grid, Heading, Center, HStack, IconButton, Button } from "@chakra-ui/react";
import QueryResult from "../organisms/query-result";
import Lottie from "lottie-react";
import loadingData from "../assets/loading.json";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export const POPULAR_MOVIES = gql`
  query Popularmovies($page: Int) {
    popularmovies(page: $page) {
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
  const [currentPage, setCurrentPage] = useState(1);
  const {
    loading: queryLoading,
    error,
    data,
    fetchMore,
  } = useQuery(POPULAR_MOVIES, {
    variables: { page: currentPage },
  });

  const prevPage = () => {
    if (!queryLoading && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const nextPage = () => {
    if (!queryLoading && currentPage < 20) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const totalPages = 15;
  const visiblePages = 5;
  const pagesArray = Array.from({ length: 15 }, (_, i) => i + 1);

  const getPageButtons = () => {
    if (totalPages <= visiblePages) return pagesArray;

    const firstPage = 1;
    const lastPage = totalPages;
    const middlePage = Math.floor(visiblePages / 2);

    if (currentPage <= middlePage) {
      return [...pagesArray.slice(0, visiblePages - 1), "...", lastPage];
    } else if (currentPage >= lastPage - middlePage) {
      return [
        firstPage,
        "...",
        ...pagesArray.slice(totalPages - visiblePages + 1),
      ];
    } else {
      return [
        firstPage,
        "...",
        ...pagesArray.slice(currentPage - middlePage, currentPage + middlePage),
        "...",
        lastPage,
      ];
    }
  };

  useEffect(() => {
    if (!queryLoading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
    fetchMore({
      variables: { page: currentPage },
    });
  }, [currentPage, queryLoading, fetchMore]);

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
        <>
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

          <HStack spacing={5} mt={10} mb={10} justify="center">
            <IconButton
              aria-label="previous"
              icon={<ChevronLeftIcon />}
              borderRadius="50%"
              variant="outline"
              onClick={prevPage}
            />
            {getPageButtons().map((page, i) => (
              <Center key={i}>
                <Button
                  colorScheme="teal"
                  px={3}
                  py={4}
                  borderRadius="50%"
                  variant="solid"
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page === "..." ? "..." : <span>{page}</span>}
                </Button>
              </Center>
            ))}
            <IconButton
              aria-label="next"
              icon={<ChevronRightIcon />}
              borderRadius="50%"
              variant="outline"
              onClick={nextPage}
            />
          </HStack>
        </>
      )}
    </>
  );
};

export default PopularMovies;
