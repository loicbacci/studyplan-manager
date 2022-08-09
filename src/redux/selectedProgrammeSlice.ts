import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { collection, doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { addId, db } from "../lib/firestore/firestore";

interface SelectedProgrammeState {
  programme: Programme | null,
  status: "not selected" | "loading" | "selected" | "error",

  majors: Major[],
  majorsStatus: "not loaded" | "loading" | "loaded" | "error",

  lastUnsub: Unsubscribe | null,
  lastMajorsUnsub: Unsubscribe | null,
}

const initialState: SelectedProgrammeState = {
  programme: null,
  status: "not selected",

  majors: [],
  majorsStatus: "not loaded",

  lastUnsub: null,
  lastMajorsUnsub: null
}

export const selectedProgrammeSlice = createSlice({
  name: "selectedProgramme",
  initialState,

  reducers: {
    select: (state, action: PayloadAction<{ programme: Programme, unsub: Unsubscribe }>) => {
      state.programme = action.payload.programme;
      state.lastUnsub = action.payload.unsub;
      state.status = "selected";
    },

    errorSelecting: (state) => {
      state.status = "error";
    },

    updateMajors: (state, action: PayloadAction<{ majors: Major[], unsub: Unsubscribe }>) => {
      state.majors = action.payload.majors;
      state.lastMajorsUnsub = action.payload.unsub;
      state.majorsStatus = "loaded";
    },

    errorFetchingMajors: (state) => {
      state.majorsStatus = "error"
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(selectProgramme.pending, (state) => {
        state.status = "loading";
        state.majorsStatus = "not loaded";
      })
      .addCase(selectProgramme.rejected, (state) => {
        state.status = "error"
      })

      .addCase(fetchMajors.pending, (state) => {
        state.majorsStatus = "loading";
      })
      .addCase(fetchMajors.rejected, (state) => {
        state.majorsStatus = "error"
      })
  }
})

export const selectProgramme = createAsyncThunk<void, string, { state: RootState }>(
  "selectedProgramme/select", async (programmeId, thunkAPI) => {
    const userId = thunkAPI.getState().auth.userId;
    if (!userId) return Promise.reject("User not authentificated");

    const lastUnsub = thunkAPI.getState().selectedProgramme.lastUnsub;

    if (lastUnsub !== null) lastUnsub();

    const unsub = onSnapshot(
      doc(db, "users", userId, "programmes", programmeId),
      (snapshot) => {
        const programme = {
          id: snapshot.id,
          ...snapshot.data()
        } as Programme;
        thunkAPI.dispatch(selectedProgrammeSlice.actions.select({ programme, unsub }));
      },
      () => thunkAPI.dispatch(selectedProgrammeSlice.actions.errorSelecting())
    )

    return Promise.resolve();
  }
)

export const fetchMajors = createAsyncThunk<void, void, { state: RootState }>(
  "selectedProgramme/fetchMajors", async (_, thunkAPI) => {
    const userId = thunkAPI.getState().auth.userId;
    if (!userId) return Promise.reject("User not authentificated");

    const programme = thunkAPI.getState().selectedProgramme.programme;
    const status = thunkAPI.getState().selectedProgramme.status;

    if (status !== "selected" || !programme) return Promise.reject("Programme not selected");

    const unsub = onSnapshot(
      collection(db, "users", userId, "programmes", programme.id, "majors"),
      (snapshot) => {
        const majors = addId<Major>(snapshot);
        thunkAPI.dispatch(selectedProgrammeSlice.actions.updateMajors({ majors, unsub }))
      },
      () => thunkAPI.dispatch(selectedProgrammeSlice.actions.errorFetchingMajors())
    )

    return Promise.resolve();
  }
)

export const selectSelectedProgramme = (state: RootState) => state.selectedProgramme.programme;
export const selectSelectedProgrammesStatus = (state: RootState) => state.selectedProgramme.status;

export const selectMajors = (state: RootState) => state.selectedProgramme.majors;
export const selectMajorsStatus = (state: RootState) => state.selectedProgramme.majorsStatus;

export default selectedProgrammeSlice.reducer;
