import { Cedicine } from "@/models";
import { ResData } from "@/types";
import axios from "../axios";
import { API_ADMIN_CEDICINE } from "./constant-api";

export const adminApi = {
  async createOrUpdateCecidine(data: Partial<Cedicine>): Promise<ResData> {
    return await axios.post(API_ADMIN_CEDICINE, {
      ...data,
    });
  },

  async deleteCecidine(id: string): Promise<ResData> {
    return await axios.delete(API_ADMIN_CEDICINE, {
      data: { id },
    });
  },
};
