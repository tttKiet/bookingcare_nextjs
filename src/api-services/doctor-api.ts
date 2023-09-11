import { ResData } from "@/types";
import axios from "../axios";
import { Position } from "../models";
import { API_POSITION } from "./constant-api";

export const doctorApi = {
  async createOrUpdatePosition({
    name,
    id,
  }: Partial<Position>): Promise<ResData> {
    return await axios.post(API_POSITION, {
      name,
      id,
    });
  },

  async deletePosition({ id }: { id: string }): Promise<ResData> {
    return await axios.delete(API_POSITION, {
      data: {
        id,
      },
    });
  },
};
