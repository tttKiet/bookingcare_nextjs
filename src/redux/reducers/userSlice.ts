import { createSlice } from "@reduxjs/toolkit";

export interface LoginProfile {
  id: string;
  fullName: string;
  email: string;
  Role: {
    id: string;
    keyType: string;
  } | null;
  address: string;
  gender: string;
  createdAt: string;
}

const initialState: LoginProfile = {
  id: "",
  fullName: "",
  email: "",
  Role: null,
  address: "",
  gender: "",
  createdAt: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStore(state: LoginProfile, payload) {
      state.id = payload.payload.id;
      state.fullName = payload.payload.fullName;
      state.email = payload.payload.email;
      state.Role = payload.payload?.Role || null;
      state.address = payload.payload.address;
      state.gender = payload.payload.gender;
      state.createdAt = payload.payload.createdAt;
    },
    logoutStore(state) {
      state.id = "";
      state.fullName = "";
      state.email = "";
      state.Role = null;
      state.address = "";
      state.gender = "";
      state.createdAt = "";
    },
  },
});
export const { loginStore, logoutStore } = userSlice.actions;
export default userSlice.reducer;
