import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, useAuth } from "../lib/auth";
import { Field, Form, Formik } from "formik";
import { toastErrorOptions } from "../lib/chakraUtils";

const LoginPage = () => {
  const { isLoggedIn } = useAuth();

  const navigate = useNavigate();
  const location = useLocation() as any;
  const toast = useToast();

  const from = location.state?.from?.pathname || "/";

  const signIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .catch(() => toast(toastErrorOptions("Failed to log in")));
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true })
    }
  }, [isLoggedIn, from, navigate]);

  const validateEmail = (value: string) => {
    if (!value) {
      return "Email is required";
    }
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) {
      return "Password is required";
    }
    return ""
  }

  return (
    <Center>
      <Stack spacing={6} w="sm" borderWidth="1px" borderRadius="md" py={4} px={6}>
        <Heading>Log In Page</Heading>


        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              signIn(values.email, values.password);
              actions.setSubmitting(false)
            }, 1000);
          }}
        >
          {(props) => (
            <Form>
              <Stack spacing={4} >
                <Field name="email" validate={validateEmail}>
                  {({ field, form }: any) => (
                    <FormControl isInvalid={form.errors.email && form.touched.email}>
                      <FormLabel>Email address</FormLabel>
                      <Input {...field} type="email" placeholder="Enter email address"/>
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="password" validate={validatePassword}>
                  {({ field, form }: any) => (
                    <FormControl isInvalid={form.errors.password && form.touched.password}>
                      <FormLabel>Password</FormLabel>
                      <Input {...field} type="password" placeholder="Enter password"/>
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  colorScheme="blue"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Log In
                </Button>

              </Stack>
            </Form>
          )}
        </Formik>

      </Stack>
    </Center>
  );
};

export default LoginPage;
