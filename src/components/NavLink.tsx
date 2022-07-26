import { Link } from "@chakra-ui/react";
import { Link as RLink, useLocation } from "react-router-dom";

import React from "react";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = (props: NavLinkProps) => {
  const location = useLocation();
  const { to, children } = props;

  return (
    <Link
      as={RLink}
      to={to}
      color={location.pathname === to ? "teal" : "black"}
    >
      {children}
    </Link>
  );
};

export default NavLink;
