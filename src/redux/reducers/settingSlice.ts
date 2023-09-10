import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
};

const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleMode(state, payload) {
      console.log("toggle mode", state);
    },
  },
});
export const { toggleMode } = settingSlice.actions;
export default settingSlice.reducer;
