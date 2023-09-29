import {
  Box,
  Flex,
  Text,
  Stack,
  Avatar,
  Card,
  HStack,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";

export default function ReviewCard({ reviews }) {
  return (
    <Box maxW={"800px"} mx={"auto"} boxShadow={"2xl"}>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {reviews
            ?.filter((ep) => ep.content.split(" ").length <= 300)
            .map((ep) => (
              <SwiperSlide>
                <Card
                  key={ep.reviewId}
                  p={8}
                  rounded={"xl"}
                  align={"center"}
                  pos={"relative"}
                  h={560}
                >
                  <Text px={10} pt={5} textAlign={"justify"} fontSize={"sm"}>
                    {ep.content}
                  </Text>
                  <Flex align={"center"} mt={8} direction={"column"}>
                    <Avatar
                      src={`https://image.tmdb.org/t/p/original/${ep.author_details.avatar_path}`}
                      mb={2}
                    />
                    <Stack spacing={-1} align={"center"}>
                      <Text color="blue.400" fontSize="lg" fontWeight={600}>
                        {ep.author_details.name}
                      </Text>
                      <HStack>
                        <Text
                          fontSize={"md"}
                          fontWeight="bold"
                          color="blue.400"
                        >
                          Username:{" "}
                        </Text>
                        <Text
                          fontSize={"md"}
                          color="blue.200"
                          fontWeight="bold"
                        >
                          {ep.author_details.username}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text
                          fontSize={"md"}
                          fontWeight="bold"
                          color="blue.400"
                        >
                          Rating:{" "}
                        </Text>
                        <Text
                          fontSize={"md"}
                          color="blue.200"
                          fontWeight="bold"
                        >
                          {ep.author_details.rating}
                        </Text>
                      </HStack>
                    </Stack>
                  </Flex>
                </Card>
              </SwiperSlide>
            ))}
        </Swiper>
      </Box>
  );
}
