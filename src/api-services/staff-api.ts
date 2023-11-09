import {
  LoginPayLoad,
  Staff,
  User,
  Code,
  HealthExaminationSchedule,
  HealthRecord,
} from "@/models";
import axios from "../axios";
import { ResData } from "@/types";
import {
  API_ACCOUNT_STAFF,
  API_ACCOUNT_USER,
  API_CHECK_UP_HEALTH_RECORD,
  API_CODE,
  API_DOCTOR_SCHEDULE_HEALTH_EXAM,
} from "./constant-api";

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

  // Schedule
  async createOrUpdateSchedule(
    data: any
  ): Promise<ResData<HealthExaminationSchedule>> {
    return await axios.post(API_DOCTOR_SCHEDULE_HEALTH_EXAM, {
      ...data,
    });
  },

  async deleteScheduleDoctor(
    id: string
  ): Promise<ResData<HealthExaminationSchedule>> {
    return await axios.delete(API_DOCTOR_SCHEDULE_HEALTH_EXAM, {
      data: {
        id,
      },
    });
  },

  // Health record
  async editStatusHealthRecord(data: Partial<HealthRecord>): Promise<ResData> {
    return await axios.patch(API_CHECK_UP_HEALTH_RECORD, {
      statusId: data.statusCode,
      healthRecordId: data.id,
    });
  },
};
