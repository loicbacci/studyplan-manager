import { Heading, Stack } from "@chakra-ui/react";
import { EmailAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, useAuth } from "../firebase/config";

const ui = new firebaseui.auth.AuthUI(auth);

const LoginPage = () => {
  const { isLoggedIn } = useAuth();

  const navigate = useNavigate();
  const location = useLocation() as any;

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    ui.start("#firebaseui-auth-container", {
      signInOptions: [EmailAuthProvider.PROVIDER_ID],
    });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true })
    }
  }, [isLoggedIn, from, navigate]);

  return (
    <Stack spacing={6}>
      <Heading>Log In</Heading>
      <div id="firebaseui-auth-container" />
    </Stack>
  );
};

export default LoginPage;
