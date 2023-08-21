import { LoginPayLoad } from "@/models";
import axios from "../axios";

export interface ResData {
  statusCode: number;
  msg: string;
  data?: any;
}

export const authApi = {
  async login({ email, password }: LoginPayLoad): Promise<ResData> {
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
