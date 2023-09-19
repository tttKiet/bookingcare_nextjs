import { ResData } from "@/types";
import axios from "../axios";
import { AcademicDegree } from "../models";
import { API_ACEDEMIC_DEGREE } from "./constant-api";

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
};
