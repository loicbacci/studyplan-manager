import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import NavLink from "./NavLink";
import { useAuth } from "../lib/auth";

const Header = () => {
  const { isLoggedIn, signOut } = useAuth();

  const onLogOutClick = () => {
    signOut();
  };

  return (
    <Box pb={6}>
      <Box boxShadow={useColorModeValue("sm", "sm-dark")}>
        <Container maxW="container.lg" py={4}>
          <Flex>
            <HStack spacing={4}>
              <Heading size="lg" pr={4}>
                Study Plan Manager
              </Heading>
              {isLoggedIn && (
                <>
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/programmes">Programmes</NavLink>
                </>
              )}
            </HStack>

            <Spacer />
            {isLoggedIn && <Button onClick={onLogOutClick}>Log Out</Button>}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Header;
