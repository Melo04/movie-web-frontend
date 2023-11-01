import {
  Box,
  Center,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      width="100%"
    >
      <Center py={5}>
        <Text>© 2023 TMDB Movie Website. All rights reserved</Text>
      </Center>
    </Box>
  );
}
