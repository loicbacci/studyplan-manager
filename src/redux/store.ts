import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer, { authSlice } from "./authSlice";
import programmesReducer from "./programmesSlice";
import { auth } from "../lib/auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    programmes: programmesReducer
  }
})

auth.onAuthStateChanged(() => {
  store.dispatch(authSlice.actions.refresh());
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>;