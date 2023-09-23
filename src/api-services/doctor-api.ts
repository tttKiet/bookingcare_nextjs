import { ResData } from "@/types";
import axios from "../axios";
import { AcademicDegree, Working } from "../models";
import { API_ACEDEMIC_DEGREE, API_WORKING } from "./constant-api";

export const doctorApi = {
  async createOrUpdateAcademicDegree({
    name,
    id,
  }: Partial<AcademicDegree>): Promise<ResData> {
    return await axios.post(API_ACEDEMIC_DEGREE, {
      name,
      id,
    });
  },

  async deleteAcademicDegree({ id }: { id: string }): Promise<ResData> {
    return await axios.delete(API_ACEDEMIC_DEGREE, {
      data: {
        id,
      },
    });
  },

  async createOrUpdateWorking({
    staffId,
    healthFacilityId,
    startDate,
    endDate,
    id,
  }: Partial<Working>): Promise<ResData> {
    return await axios.post(API_WORKING, {
      staffId,
      healthFacilityId,
      startDate,
      endDate,
      id,
    });
  },
  async deleteWorking(id: string): Promise<ResData> {
    return await axios.delete(API_WORKING, {
      data: { id },
    });
  },
};
