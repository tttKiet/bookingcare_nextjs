import { createSlice } from "@reduxjs/toolkit";

export interface LoginProfile {
  email: string;
}

const initialState = {
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStore(state, payload) {
      state.email = payload.payload.email;
    },
    logoutStore(state) {
      state.email = "";
    },
  },
});
export const { loginStore, logoutStore } = userSlice.actions;
export default userSlice.reducer;
