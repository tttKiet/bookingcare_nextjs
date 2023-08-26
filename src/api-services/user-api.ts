import { LoginPayLoad } from "@/models";
import axios from "../axios";
import { ResData } from "@/types";
import { RegisterFormInterface } from "@/types/auth";

export const userApi = {
  async register({
    email,
    password,
    address,
    fullName,
    phone,
    gender,
  }: RegisterFormInterface): Promise<ResData> {
    return await axios.post("/api/v1/user/register", {
      email,
      password,
      address,
      fullName,
      phone,
      gender,
    });
  },
};
