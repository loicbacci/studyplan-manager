import { createSlice } from "@reduxjs/toolkit";

interface SelectedProgrammeState {
  programme: Programme | null,
  status: "not selected" | "loading" | "selected"
}

const initialState: SelectedProgrammeState = {
  programme: null,
  status: "not selected"
}

export const selectedProgrammeSlice = createSlice({
  name: "selectedProgramme",
  initialState,

  reducers: {}
})

export default selectedProgrammeSlice.reducer;
