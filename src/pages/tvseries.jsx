import React, {useState, useEffect} from "react";
import { useQuery, gql } from "@apollo/client";
import QueryResult from "../organisms/query-result";
import { Grid, Heading, Center } from "@chakra-ui/react";
import TvSeriesCard from "../containers/tvseries-card";
import Lottie from "lottie-react";
import loadingData from "../assets/loading.json";

export const TVSERIES = gql`
  query Tvseries {
    tvseries {
      id
      first_air_date
      name
      overview
      popularity
      poster_path
      vote_count
    }
  }
`;

const Tvseries = () => {
  const [loading, setLoading] = useState(true);
  const { loading : queryLoading, error, data } = useQuery(TVSERIES);

  useEffect(() => {
    if (!queryLoading) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [queryLoading]);

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
          {data?.tvseries?.map((series) => (
            <TvSeriesCard key={series.id} series={series} />
          ))}
        </QueryResult>
      </Grid>
      )}
    </>
  );
};

export default Tvseries;
