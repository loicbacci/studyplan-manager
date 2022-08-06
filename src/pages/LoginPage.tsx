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
import {useDispatch, useSelector} from "react-redux";
import {logIn, selectStatus} from "../redux/authSlice";
import {useAppDispatch, useAppSelector} from "../redux/hooks";

const LoginPage = () => {
  const status = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation() as any;
  const toast = useToast();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (status === "logInError") {
      toast(toastErrorOptions("Failed to log in"));
    }
  }, [status])


  useEffect(() => {
    if (status === "loggedIn") {
      navigate(from, { replace: true })
    }
  }, [status]);

  const validateEmail = (value: string) => {
    return !value ? "Email is required" : "";
  }

  const validatePassword = (value: string) => {
    return !value ? "Password is required" : "";
  }

  return (
    <Center>
      <Stack spacing={6} w="sm" borderWidth="1px" borderRadius="md" py={4} px={6}>
        <Heading>Log In Page</Heading>


        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              dispatch(logIn(values));
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
