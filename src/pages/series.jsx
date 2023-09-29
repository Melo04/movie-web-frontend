import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import QueryResult from "../organisms/query-result";
import SeriesDetail from "../organisms/SeriesDetail";
import { Center } from "@chakra-ui/react";
import Lottie from "lottie-react";
import loadingData from "../assets/loading.json";

export const GET_SERIES = gql`
  query Series($seriesId: ID!) {
    series(id: $seriesId) {
      id
      name
      overview
      popularity
      poster_path
      vote_count
      first_air_date
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
      seasons {
        id
        air_date
        episode_count
        name
        overview
        poster_path
        season_number
      }
    }
  }
`;

const Series = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { loading: queryLoading, error, data } = useQuery(GET_SERIES, {
    variables: { seriesId: id },
  });

  useEffect(() => {
    if (!queryLoading) {
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
    <QueryResult error={error} loading={loading} data={data}>
      <SeriesDetail series={data?.series} />
    </QueryResult>
      )}
    </>
  );
};

export default Series;
