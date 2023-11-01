import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import MovieCard from "../containers/movie-card";
import {
  Grid,
  Heading,
  Center,
  Button,
  HStack,
  IconButton,
  InputGroup,
  Input,
  InputRightElement,
  VStack,
  Text,
  MenuButton,
  Menu,
  MenuList,
  Checkbox,
} from "@chakra-ui/react";
import QueryResult from "../organisms/query-result";
import Lottie from "lottie-react";
import loadingData from "../assets/loading.json";
import notfoundData from "../assets/notfound.json";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import Footer from "../organisms/Footer";

export const MOVIES = gql`
  query Movies($page: Int) {
    movies(page: $page) {
      id
      overview
      popularity
      poster_path
      release_date
      title
      vote_average
      genre_ids
    }
  }
`;

export const GENRES = gql`
  query Moviegenres {
    moviegenres {
      id
      name
    }
  }
`;

export const SEARCHMOVIES = gql`
  query SearchMovies($keyword: String!) {
    searchMovies(keyword: $keyword) {
      genre_ids
      genres {
        id
      }
      id
      overview
      popularity
      poster_path
      production_companies {
        id
      }
      release_date
      title
      vote_average
    }
  }
`;

const Movies = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    loading: queryLoading,
    error,
    data: movieData,
    fetchMore,
  } = useQuery(MOVIES, {
    variables: { page: currentPage },
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const { loading: searchLoading, data: searchData } = useQuery(SEARCHMOVIES, {
    variables: { keyword: searchKeyword },
  });

  const { data: genreData } = useQuery(GENRES);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const getFilteredMovies = () => {
    if (selectedGenres.length === 0) {
      return searchKeyword === ""
        ? movieData?.movies
        : searchData?.searchMovies;
    }
    const selectedGenresIds = selectedGenres.map((genre) =>
      parseInt(genre.id)
    );
    return searchKeyword === ""
      ? movieData?.movies?.filter((movie) => {
          const movieGenreIds = movie.genre_ids.map((id) => id);
          return movieGenreIds.some((id) => selectedGenresIds.includes(id));
        })
      : searchData?.searchMovies?.filter((movie) => {
          const movieGenreIds = movie.genre_ids.map((id) => id);
          return movieGenreIds.some((id) => selectedGenresIds.includes(id));
        });
  };

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

  const totalPages = 20;
  const visiblePages = 5;
  const pagesArray = Array.from({ length: 20 }, (_, i) => i + 1);

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
    if (!queryLoading || !searchLoading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      fetchMore({
        variables: { page: currentPage },
      });
    }
  }, [currentPage, queryLoading, fetchMore, searchLoading, searchKeyword]);

  return (
    <>
      <Center>
        <Heading mt={20}>🔥 Airing Now 🔥</Heading>
      </Center>
      {loading ? (
        <Center>
          <Lottie animationData={loadingData} />
        </Center>
      ) : (
        <>
          <Center>
            <VStack>
              <InputGroup w="400px" borderColor="blue.300" mt={10}>
                <Input
                  color="blue.300"
                  placeholder="Search for a movie..."
                  _placeholder={{ color: "inherit" }}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                  }}
                />
                <InputRightElement>
                  <SearchIcon color="blue.300" />
                </InputRightElement>
              </InputGroup>
              <HStack spacing={5} mt={5}>
                <Text fontSize="lg">Filter By</Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    colorScheme="blue"
                  >
                    Genres
                  </MenuButton>
                  <MenuList py={5} px={5}>
                    {genreData?.moviegenres?.map((genre) => (
                      <VStack key={genre.id} align="left" spacing={1}>
                        <Checkbox
                          colorScheme="blue"
                          value={genre.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGenres((prev) => [
                                ...prev,
                                {
                                  id: genre.id,
                                },
                              ]);
                            } else {
                              setSelectedGenres((prev) =>
                                prev.filter((g) => g.id !== genre.id)
                              );
                            }
                          }}
                        >
                          {genre.name}
                        </Checkbox>
                      </VStack>
                    ))}
                  </MenuList>
                </Menu>
              </HStack>
            </VStack>
          </Center>
          {getFilteredMovies()?.length === 0 ? (
            <VStack my={20}>
              <Heading color="blue.500">Movie Not Found</Heading>
              <Lottie animationData={notfoundData} />
            </VStack>
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
              <QueryResult error={error} loading={loading} data={movieData}>
                {getFilteredMovies()?.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </QueryResult>
            </Grid>
          )}
          {getFilteredMovies() && getFilteredMovies().length >= 20 && (
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
          )}
        </>
      )}
      <Footer/>
    </>
  );
};

export default Movies;
