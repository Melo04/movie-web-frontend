import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Pages from "./pages";
import Header from "./organisms/header";
import Footer from "./organisms/Footer";
import { BrowserRouter as Router } from "react-router-dom";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Header />
        <Pages />
        <Footer/>
      </ChakraProvider>
    </ApolloProvider>
  </Router>
);
