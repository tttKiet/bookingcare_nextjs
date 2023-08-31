import axios from "../axios";
import { ResData } from "@/types";
import { API_TYPE_HEALTH_FACILITIES } from "./contrains-api";

export const healthFacilitiesApi = {
  async createTypeHealthFacility({ name }: { name: string }): Promise<ResData> {
    return await axios.post(API_TYPE_HEALTH_FACILITIES, {
      name,
    });
  },
  async updateTypeHealthFacility({
    id,
    nameUpdated,
  }: {
    id: string;
    nameUpdated: string;
  }): Promise<ResData> {
    return await axios.patch(API_TYPE_HEALTH_FACILITIES, {
      id,
      name: nameUpdated,
    });
  },
  async deleteTypeHealthFacility({ id }: { id: string }): Promise<ResData> {
    return await axios.delete(API_TYPE_HEALTH_FACILITIES, {
      data: {
        id,
      },
    });
  },
};
