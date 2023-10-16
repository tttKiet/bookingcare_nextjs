import { LoginPayLoad, PatientProfile, User } from "@/models";
import axios from "../axios";
import { ResData } from "@/types";
import { API_ACCOUNT_USER, API_PATIENT_PROFILE } from "./constant-api";

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

  async createOrUpdatePatientProfile(
    data: Partial<PatientProfile>
  ): Promise<ResData> {
    return await axios.post(API_PATIENT_PROFILE, {
      ...data,
    });
  },

  async deletePatientProfile(id: string): Promise<ResData> {
    return await axios.delete(API_PATIENT_PROFILE, {
      data: {
        id,
      },
    });
  },
};
