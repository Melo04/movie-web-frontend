import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import QueryResult from "../organisms/query-result";
import {
  Grid,
  Heading,
  Center,
  HStack,
  IconButton,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  VStack,
  Text,
  MenuButton,
  Menu,
  MenuList,
  Checkbox,
} from "@chakra-ui/react";
import TvSeriesCard from "../containers/tvseries-card";
import Lottie from "lottie-react";
import loadingData from "../assets/loading.json";
import notfoundData from "../assets/notfound.json";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import Footer from "../organisms/Footer";

export const TVSERIES = gql`
  query Tvseries($page: Int) {
    tvseries(page: $page) {
      id
      first_air_date
      name
      overview
      popularity
      poster_path
      vote_count
      genre_ids
    }
  }
`;

export const GENRES = gql`
  query Tvgenres {
    tvgenres {
      id
      name
    }
  }
`;

export const SEARCHTVSERIES = gql`
  query SearchTvseries($keyword: String!) {
    searchTvseries(keyword: $keyword) {
      genre_ids
      genres {
        id
        name
      }
      id
      name
      overview
      popularity
      poster_path
      seasons {
        id
        name
        overview
        poster_path
        season_number
        air_date
        episode_count
      }
      vote_count
      first_air_date
      production_companies {
        id
        logo_path
        name
        origin_country
      }
    }
  }
`;

const Tvseries = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    loading: queryLoading,
    error,
    data: tvData,
    fetchMore,
  } = useQuery(TVSERIES, {
    variables: { page: currentPage },
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const { loading: searchLoading, data: searchData } = useQuery(
    SEARCHTVSERIES,
    {
      variables: { keyword: searchKeyword },
    }
  );

  const { data: genreData } = useQuery(GENRES);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const getFilteredSeries = () => {
    if (selectedGenres.length === 0) {
      return searchKeyword === ""
        ? tvData?.tvseries
        : searchData?.searchTvseries;
    }
    const selectedGenresIds = selectedGenres.map((genre) => parseInt(genre.id));
    return searchKeyword === ""
      ? tvData?.tvseries?.filter((series) => {
          const movieGenreIds = series.genre_ids.map((id) => id);
          return movieGenreIds.some((id) => selectedGenresIds.includes(id));
        })
      : searchData?.searchTvseries?.filter((series) => {
          const movieGenreIds = series.genre_ids.map((id) => id);
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
  }, [currentPage, queryLoading, fetchMore, searchLoading]);

  return (
    <>
      <Center>
        <Heading mt={20}>🎬 Top Rated Tv Series 🎬</Heading>
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
                  placeholder="Search for a TV Series..."
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
                    {genreData?.tvgenres?.map((genre) => (
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
          {getFilteredSeries()?.length === 0 ? (
            <VStack my={20}>
              <Heading color="blue.500">TV Series Not Found</Heading>
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
              <QueryResult error={error} loading={loading} data={tvData}>
                {getFilteredSeries()?.map((series) => (
                  <TvSeriesCard key={series.id} series={series} />
                ))}
              </QueryResult>
            </Grid>
          )}

          {getFilteredSeries() && getFilteredSeries().length >= 20 && (
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

export default Tvseries;
