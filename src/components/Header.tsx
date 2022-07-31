import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack, IconButton,
  Spacer,
  Text,
  useBreakpointValue,
  useColorModeValue, useDisclosure
} from "@chakra-ui/react";
import NavLink from "./NavLink";
import { useAuth } from "../lib/auth";
import { FiMenu } from "react-icons/fi";

const Header = () => {
  const { isLoggedIn, signOut } = useAuth();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle } = useDisclosure();

  const onLogOutClick = () => {
    signOut();
  };

  return (
    <Box as="section" pb={{ base: 4, md: 6 }}>
      <Box as="nav" boxShadow={useColorModeValue("sm", "sm-dark")}>
        <Container maxW="container.lg" py={{ base: 3, lg: 4 }}>
          <HStack spacing={8} justify="space-between">
            <Heading size="md" pr={4}>
              Study Plan Manager
            </Heading>

            {isDesktop ? (
              <Flex justify="space-between" flex="1">
                {isLoggedIn && (
                  <HStack spacing={4}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/programmes">Programmes</NavLink>
                  </HStack>
                )}

                {isLoggedIn && <Button onClick={onLogOutClick}>Log Out</Button>}

              </Flex>
            ) : isLoggedIn && (
              <IconButton
                variant="ghost"
                aria-label="Open menu"
                icon={<FiMenu fontSize="1.25rem" />}
                onClick={onToggle}
              />
            )}
          </HStack>
          {(!isDesktop && isOpen) && (
            <Flex justify="space-between" flex="1" pt={4}>
              {isLoggedIn && (
                <HStack spacing={4}>
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/programmes">Programmes</NavLink>
                </HStack>
              )}

              {isLoggedIn && <Button onClick={onLogOutClick} size="sm">Log Out</Button>}

            </Flex>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Header;
