import { LoginPayLoad } from "@/models";
import axios from "../axios";
import { ResData } from "@/types";

export interface ResDataLogin extends ResData {
  user: {
    role: {
      id: string;
      keyType: string;
    };
  };
}
export const authApi = {
  async login({ email, password }: LoginPayLoad): Promise<ResDataLogin> {
    return await axios.post("/api/v1/auth/login", {
      email,
      password,
    });
  },

  async logout(): Promise<ResData> {
    return await axios.get("/api/v1/auth/logout");
  },

  async getProfile(): Promise<ResData> {
    return await axios.get("/api/v1/auth/fetch-profile");
  },
};
