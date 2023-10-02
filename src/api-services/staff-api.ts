import { LoginPayLoad, Staff, User, Code } from "@/models";
import axios from "../axios";
import { ResData } from "@/types";
import { API_ACCOUNT_STAFF, API_ACCOUNT_USER, API_CODE } from "./constant-api";

export const staffApi = {
  async createOrUpdateDoctor(data: Partial<Staff>): Promise<ResData> {
    return await axios.post(API_ACCOUNT_STAFF, {
      ...data,
    });
  },

  // Code
  async createCode(data: Code): Promise<ResData<Code>> {
    return await axios.post(API_CODE, {
      ...data,
    });
  },

  async deleteCode(key: string): Promise<ResData<Code>> {
    return await axios.delete(API_CODE, {
      data: {
        key,
      },
    });
  },
};
