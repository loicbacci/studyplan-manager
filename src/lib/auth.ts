import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "./app";

export const auth = getAuth(app);

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser !== null);
  const [userId, setUserId] = useState(
    auth.currentUser ? auth.currentUser.uid : null
  );

  const signOut = () => {
    auth.signOut()
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsLoggedIn(user !== null);
      if (user) {
        setUserId(user.uid);
      }
    });
  });

  return { isLoggedIn, userId, signOut };
};
