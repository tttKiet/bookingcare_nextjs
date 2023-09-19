import { LoginPayLoad, Staff, User } from "@/models";
import axios from "../axios";
import { ResData } from "@/types";
import { API_ACCOUNT_STAFF, API_ACCOUNT_USER } from "./constant-api";

export const staffApi = {
  async createOrUpdateDoctor(data: Partial<Staff>): Promise<ResData> {
    return await axios.post(API_ACCOUNT_STAFF, {
      ...data,
    });
  },
};
