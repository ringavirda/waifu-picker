import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chars: [],
  loading: false,
  error: null,
};

const charsSlice = createSlice({
  name: "chars",
  initialState,
  reducers: {
    fetchCharsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCharsSuccess(state, action) {
      state.chars = action.payload;
      state.loading = false;
    },
    fetchCharsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCharsStart, fetchCharsSuccess, fetchCharsFailure } =
  charsSlice.actions;
export default charsSlice.reducer;
