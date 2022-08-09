import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, onSnapshot, Unsubscribe, updateDoc } from "firebase/firestore";
import { RootState } from "./store";
import { addId, db } from "../lib/firestore/firestore";
import { removeUndefined } from "../lib/firebaseUtils";

interface ProgrammesState {
  programmes: Programme[],
  status: "unloaded" | "loading" | "loaded" | "error",

  addStatus: "idle" | "pending" | "success" | "error",
  updateStatus: "idle" | "pending" | "success" | "error",
  deleteStatus: "idle" | "pending" | "success" | "error"
}

const initialState: ProgrammesState = {
  programmes: [],
  status: "unloaded",

  addStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle"
}

export const programmesSlice = createSlice({
  name: "programmes",
  initialState,

  reducers: {
    updateProgrammes: (state, action: PayloadAction<Programme[]>) => {
      state.programmes = action.payload;
      state.status = "loaded";
    },

    errorFetching: (state) => {
      state.status = "error";
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProgrammes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProgrammes.rejected, (state) => {
        state.status = "error";
      })

      .addCase(addProgramme.pending, (state) => {
        state.addStatus = "pending"
      })
      .addCase(addProgramme.rejected, (state) => {
        state.addStatus = "error"
      })
      .addCase(addProgramme.fulfilled, (state) => {
        state.addStatus = "success";
      })

      .addCase(updateProgramme.pending, (state) => {
        state.updateStatus = "pending"
      })
      .addCase(updateProgramme.rejected, (state) => {
        state.updateStatus = "error"
      })
      .addCase(updateProgramme.fulfilled, (state) => {
        state.updateStatus = "success";
      })

      .addCase(deleteProgramme.pending, (state) => {
        state.deleteStatus = "pending"
      })
      .addCase(deleteProgramme.rejected, (state) => {
        state.deleteStatus = "error"
      })
      .addCase(deleteProgramme.fulfilled, (state) => {
        state.deleteStatus = "success";
      })
  }
})

export const fetchProgrammes = createAsyncThunk<void, void, { state: RootState }>(
  "programmes/fetch", async (_, thunkAPI) => {
    const userId = thunkAPI.getState().auth.userId;
    if (!userId) return Promise.reject("User not authentificated");

    if (thunkAPI.getState().programmes.status === "loaded") return Promise.resolve();

    onSnapshot(
      collection(db, "users", userId, "programmes"),
      (snapshot) => {
        const programmes = addId<Programme>(snapshot);
        thunkAPI.dispatch(programmesSlice.actions.updateProgrammes(programmes));
      },
      () => thunkAPI.dispatch(programmesSlice.actions.errorFetching())
    )

    return Promise.resolve();
  }
)

export const addProgramme = createAsyncThunk<unknown, Omit<Programme, "id">, { state: RootState }>(
  "programmes/add", (programme, thunkAPI) => {
    const userId = thunkAPI.getState().auth.userId;
    if (!userId) return Promise.reject("User not authentificated");

    return addDoc(collection(db, "users", userId, "programmes"), removeUndefined(programme));
  }
)

export const updateProgramme = createAsyncThunk<unknown, Programme, { state: RootState }>(
  "programmes/update", (programme, thunkAPI) => {
    const userId = thunkAPI.getState().auth.userId;
    if (!userId) return Promise.reject("User not authentificated");

    return updateDoc(doc(db, "users", userId, "programmes", programme.id), removeUndefined(programme));
  }
)

export const deleteProgramme = createAsyncThunk<unknown, string, { state: RootState }>(
  "programmes/delete", (programmeId, thunkAPI) => {
    const userId = thunkAPI.getState().auth.userId;
    if (!userId) return Promise.reject("User not authentificated");

    return deleteDoc(doc(db, "users", userId, "programmes", programmeId));
  }
)

export const selectProgrammes = (state: RootState) => state.programmes.programmes;
export const selectProgrammesStatus = (state: RootState) => state.programmes.status;
export const selectProgrammesAddStatus = (state: RootState) => state.programmes.addStatus;
export const selectProgrammesUpdateStatus = (state: RootState) => state.programmes.updateStatus;
export const selectProgrammesDeleteStatus = (state: RootState) => state.programmes.deleteStatus;


export default programmesSlice.reducer;
