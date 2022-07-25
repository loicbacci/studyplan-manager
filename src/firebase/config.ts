// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3WjKHdqbMtb4t_yyDgnAADw68uWRrxlw",
  authDomain: "study-plan-manager.firebaseapp.com",
  projectId: "study-plan-manager",
  storageBucket: "study-plan-manager.appspot.com",
  messagingSenderId: "424923634396",
  appId: "1:424923634396:web:885f0db81b5163249fb219",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser !== null);
  const [userId, setUserId] = useState(
    auth.currentUser ? auth.currentUser.uid : null
  );

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsLoggedIn(user !== null);
      if (user) {
        setUserId(user.uid);
      }
    });
  });

  return { isLoggedIn, userId };
};
