import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import QueryResult from "../organisms/query-result";
import MovieDetail from "../organisms/MovieDetail";
import { Center } from "@chakra-ui/react";
import Lottie from "lottie-react";
import loadingData from "../assets/loading.json";

export const GET_MOVIE = gql`
  query Movie($movieId: ID!) {
    movie(id: $movieId) {
      id
      overview
      popularity
      poster_path
      release_date
      title
      vote_average
      production_companies {
        id
        logo_path
        name
        origin_country
      }
      genres {
        id
        name
      }
    }
  }
`;

export const GET_REVIEWS = gql`
  query Reviews($reviewsId: ID!) {
    reviews(id: $reviewsId) {
      id
      created_at
      content
      author_details {
        avatar_path
        name
        rating
        username
      }
    }
  }
`;

const Movie = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const {
    loading: movieLoading,
    error: movieError,
    data: movieData,
  } = useQuery(GET_MOVIE, {
    variables: { movieId: id },
  });

  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(GET_REVIEWS, {
    variables: { reviewsId: id },
  });

  const queryLoading = movieLoading || reviewsLoading;
  const error = movieError || reviewsError;

  useEffect(() => {
    if(!queryLoading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [queryLoading]);

  return (
    <>
      {loading ? (
        <Center>
          <Lottie animationData={loadingData} />
        </Center>
      ) : (
        <QueryResult
          error={error}
          loading={loading}
          data={{ movie: movieData?.movie, reviews: reviewsData?.reviews }}
        >
          <MovieDetail
            movie={movieData?.movie}
            reviews={reviewsData?.reviews}
          />
        </QueryResult>
      )}
    </>
  );
};

export default Movie;
