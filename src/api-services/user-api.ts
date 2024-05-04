import { Booking, LoginPayLoad, PatientProfile, Review, User } from "@/models";
import axios from "../axios";
import { ResData } from "@/types";
import {
  API_ACCOUNT_USER,
  API_BOOKING,
  API_PATIENT_PROFILE,
  API_REVIEW_DOCTOR,
  API_USER_CHANGE_PASS,
} from "./constant-api";

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

  async booking(data: Partial<Booking>): Promise<ResData> {
    return await axios.post(API_BOOKING, {
      ...data,
    });
  },

  async createOrUpdateReview(data: Partial<Review>): Promise<ResData> {
    return await axios.post(API_REVIEW_DOCTOR, {
      ...data,
    });
  },

  async deleteReview(id: string): Promise<ResData> {
    return await axios.delete(API_REVIEW_DOCTOR, {
      data: {
        id,
      },
    });
  },

  async changePass(data: any): Promise<ResData> {
    return await axios.post(API_USER_CHANGE_PASS, data);
  },
};
