import React from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import heroData from "../assets/hero.json";
import { useRef } from "react";

const Hero = () => {
  const movieRef = useRef<LottieRefCurrentProps>(null);
  return (
    <div>
      <Lottie onComplete={() => {
        console.log("complete")
        movieRef.current?.setDirection(-1)
        movieRef.current?.play()
      }} lottieRef={movieRef} animationData={heroData} />
    </div>
  );
};

export default Hero;
