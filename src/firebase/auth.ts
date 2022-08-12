import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);

export const logIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const isLoggedIn = () => auth.currentUser !== null;

auth.onAuthStateChanged(() => {
  console.log(auth.currentUser ? "logged in" : "not logged in");
});
