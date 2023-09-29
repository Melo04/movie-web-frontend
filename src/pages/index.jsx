import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Movies from "./movies";
import Movie from "./movie";
import Tvseries from "./tvseries";
import Series from "./series";
import Lottie from "lottie-react";
import heroData from "../assets/hero.json";
import { Center, Container, Text } from "@chakra-ui/react";
import Typewriter from "typewriter-effect";
import PopularMovies from "./popularmovies";
import Signup from "./signup";
import Login from "./login";
import Profile from "./profile";

const Pages = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  return (
    <>
      {loading ? (
        <Center>
          <Container boxSize={450}>
            <Lottie animationData={heroData} />
            <Text fontWeight={"bold"} fontSize={"2xl"} mt={20}>
              <Typewriter
                options={{
                  autoStart: true,
                  loop: true,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString("Getting Ready...🎥")
                    .pauseFor(1000)
                    .deleteAll()
                    .start();
                }}
              />
            </Text>
          </Container>
        </Center>
      ) : (
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/movies/:id" element={<Movie />} />
          <Route path="/tv-series" element={<Tvseries />} />
          <Route path="/tv-series/:id" element={<Series />} />
          <Route path="/popular-movies" element={<PopularMovies />} />
        </Routes>
      )}
    </>
  );
};

export default Pages;
