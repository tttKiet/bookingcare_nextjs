import { createSlice } from "@reduxjs/toolkit";

export interface LoginProfile {
  fullname: string;
  email: string;
  role: string;
  address: string;
  gender: string;
  position: string;
  createdAt: string;
}

const initialState = {
  fullname: "",
  email: "",
  role: "",
  address: "",
  gender: "",
  position: "",
  createdAt: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStore(state: LoginProfile, payload) {
      state.fullname = payload.payload.fullname;
      state.email = payload.payload.email;
      state.role = payload.payload.role;
      state.address = payload.payload.address;
      state.gender = payload.payload.gender;
      state.position = payload.payload.position;
      state.createdAt = payload.payload.createdAt;
    },
    logoutStore(state) {
      state.fullname = "";
      state.email = "";
      state.role = "";
      state.address = "";
      state.gender = "";
      state.position = "";
      state.createdAt = "";
    },
  },
});
export const { loginStore, logoutStore } = userSlice.actions;
export default userSlice.reducer;
