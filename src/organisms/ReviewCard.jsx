import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";

const TestimonialContent = ({ children }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"lg"}
      p={8}
      rounded={"xl"}
      align={"center"}
      pos={"relative"}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: "solid transparent",
        borderLeftWidth: 16,
        borderRight: "solid transparent",
        borderRightWidth: 16,
        borderTop: "solid",
        borderTopWidth: 16,
        borderTopColor: useColorModeValue("white", "gray.800"),
        pos: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </Stack>
  );
};

const TestimonialHeading = ({ children }) => {
  return (
    <Heading as={"h3"} fontSize={"xl"}>
      {children}
    </Heading>
  );
};

const TestimonialText = ({ children }) => {
  return (
    <Text
      textAlign={"center"}
      color={useColorModeValue("gray.600", "gray.400")}
      fontSize={"sm"}
    >
      {children}
    </Text>
  );
};

const TestimonialAvatar = ({ src, name, title }) => {
  return (
    <Flex align={"center"} mt={8} direction={"column"}>
      <Avatar src={src} mb={2} />
      <Stack spacing={-1} align={"center"}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={"sm"} color={useColorModeValue("gray.600", "gray.400")}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

export default function ReviewCard({ reviews }) {
  return (
    // <Box bg={useColorModeValue("gray.100", "gray.700")}>
    //   <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
    <Box maxW={"800px"} mx={"auto"}>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
      >
        <VStack spacing={0} align={"center"}>
          <Heading>Movie Reviews</Heading>
          <Text>Look what our reviewers said</Text>
        </VStack>
        <SwiperSlide>
          {reviews
            ?.filter((ep) => ep.content.split(" ").length <= 100)
            .map((ep) => (
              <TestimonialContent key={ep.reviewId}>
                <TestimonialHeading>Efficient Collaborating</TestimonialHeading>
                <TestimonialText>{ep.content}</TestimonialText>
                <TestimonialAvatar
                  src={ep.author_details.avatr_path}
                  name={ep.author_details.name}
                  title={ep.author_details.username}
                />
              </TestimonialContent>
            ))}
        </SwiperSlide>
      </Swiper>
      {/* // </Container> */}
    </Box>
  );
}
