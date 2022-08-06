import { Container, Flex } from "@chakra-ui/react";
import React from "react";
import Header from "./Header";
import { useAppSelector } from "../redux/hooks";
import { selectIsLoggedIn } from "../redux/authSlice";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;

  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <Flex direction="column" mb={16}>
      <Header />
      <Container maxW={isLoggedIn ? "container.lg" : "container.md"}>
        {children}
      </Container>
    </Flex>
  );
};

export default Layout;
