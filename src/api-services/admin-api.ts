import { Cedicine } from "@/models";
import { ResData } from "@/types";
import axios from "../axios";
import {
  API_ADMIN_CEDICINE,
  API_ADMIN_MANAGER_ADMIN_HEALTH,
} from "./constant-api";

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

  async createOrUpdateHospitalManager({
    staffId,
    healthFacilityId,
    id,
    isAcctive,
  }: {
    staffId?: string;
    healthFacilityId?: string;
    id?: string;
    isAcctive?: boolean;
  }): Promise<ResData> {
    return await axios.post(API_ADMIN_MANAGER_ADMIN_HEALTH, {
      staffId,
      healthFacilityId,
      id,
      isAcctive,
    });
  },

  async deleteHospitalManager(id: string): Promise<ResData> {
    return await axios.delete(API_ADMIN_MANAGER_ADMIN_HEALTH, {
      data: { id },
    });
  },
};
