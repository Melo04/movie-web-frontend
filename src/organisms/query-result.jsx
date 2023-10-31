import React from "react";
import { LoadingSpinner } from "@apollo/space-kit/Loaders/LoadingSpinner";
import { Spinner } from "@chakra-ui/react";

const QueryResult = ({ loading, error, data, children }) => {
  if (error) {
    return <p>ERROR: {error.message}</p>;
  }
  if (loading) {
    return (
      <Spinner>
        <LoadingSpinner data-testid="spinner" size="large" theme="grayscale" />
      </Spinner>
    );
  }
  if (!data) {
    return (
      <Spinner>
        <LoadingSpinner data-testid="spinner" size="large" theme="grayscale" />
      </Spinner>
    );
  }
  if (data) {
    return children;
  }
};

export default QueryResult;