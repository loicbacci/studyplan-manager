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
import { auth } from "../firebase/config";
import NavLink from "./NavLink";

interface HeaderProps {
  loggedIn?: boolean;
}

const Header = (props: HeaderProps) => {
  const { loggedIn } = props;

  const onLogOutClick = () => {
    auth.signOut();
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
              {loggedIn && (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/courses">Courses</NavLink>
                  <NavLink to="/metadata">Metadata</NavLink>
                  <NavLink to="/programmes">Programmes</NavLink>
                </>
              )}
            </HStack>

            <Spacer />
            {loggedIn && <Button onClick={onLogOutClick}>Log Out</Button>}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Header;
