import { LoginPayLoad, User } from "@/models";
import axios from "../axios";
import { ResData } from "@/types";
import { API_ACCOUNT_USER } from "./constant-api";

export const userApi = {
  async register({
    email,
    password,
    address,
    fullName,
    phone,
    gender,
    id,
  }: Partial<User>): Promise<ResData> {
    return await axios.post(API_ACCOUNT_USER, {
      email,
      password,
      address,
      fullName,
      phone,
      gender,
      id,
    });
  },
};
