import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../lib/app";
import { RootState } from "./store";

const auth = getAuth(app);

interface AuthState {
  userId: string | null,
  status: "signedOut" | "loggingIn" | "signingOut" | "loggedIn" | "logInError" | "signOutError"
}

const initialState: AuthState = {
  userId: auth.currentUser ? auth.currentUser.uid : null,
  status: auth.currentUser ? "loggedIn" : "signedOut"
}

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    refresh: (state) => {
      if (auth.currentUser) {
        state.status = "loggedIn";
        state.userId = auth.currentUser.uid;
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.status = "loggingIn";
        state.userId = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.status = "loggedIn";
        state.userId = action.payload.user.uid;
      })
      .addCase(logIn.rejected, (state) => {
        state.status = "logInError";
        state.userId = null;
      })

      .addCase(signOut.pending, (state) => {
        state.status = "signingOut";
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = "signedOut";
        state.userId = null;
      })
      .addCase(signOut.rejected, (state) => {
        state.status = "signOutError";
      })
  }
})

export const logIn = createAsyncThunk("auth/logIn", async (data: { email: string, password: string }) => {
  return signInWithEmailAndPassword(auth, data.email, data.password);
})

export const signOut = createAsyncThunk("auth/signOut", async () => {
  return auth.signOut();
})

export const { refresh } = authSlice.actions;

//export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUserId = (state: RootState) => state.auth.userId;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectIsLoggedIn = (state: RootState) => state.auth.status === "loggedIn";
//export const selectSignInError = (state: RootState) => state.auth.signInError;

export default authSlice.reducer;
