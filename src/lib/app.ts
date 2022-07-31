import { initializeApp } from "firebase/app";

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