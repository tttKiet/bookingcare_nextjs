import {
  Cedicine,
  Code,
  ExaminationService,
  HealthExaminationSchedule,
  HospitalService,
} from "@/models";
import { ResData } from "@/types";
import axios from "../axios";
import {
  API_ADMIN_CEDICINE,
  API_ADMIN_EXAMINATION_SERVICE,
  API_ADMIN_HOSPITAL_SERVICE,
  API_ADMIN_MANAGER_ADMIN_HEALTH,
  API_ADMIN_MANAGER_SERVICE,
  API_DOCTOR_REGISTER_SCHEDULE,
  API_REVIEW_DOCTOR,
  API_USER_BAN,
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

  async createOrUpdateExaminationService(
    data: Partial<ExaminationService>
  ): Promise<ResData> {
    return await axios.post(API_ADMIN_EXAMINATION_SERVICE, {
      ...data,
    });
  },

  async deleteExaminationService(id: string): Promise<ResData> {
    return await axios.delete(API_ADMIN_EXAMINATION_SERVICE, {
      data: { id },
    });
  },

  async createOrUpdateHospitalService(
    data: Partial<HospitalService>
  ): Promise<ResData> {
    return await axios.post(API_ADMIN_MANAGER_SERVICE, {
      ...data,
    });
  },

  async deleteHospitalService({
    healthFacilityId,
    examinationServiceId,
  }: Partial<HospitalService>): Promise<ResData> {
    return await axios.delete(API_ADMIN_MANAGER_SERVICE, {
      data: {
        healthFacilityId,
        examinationServiceId,
      },
    });
  },

  async deleteReview(id: string): Promise<ResData> {
    return await axios.delete(API_REVIEW_DOCTOR, {
      data: { id },
    });
  },

  async createSchedule(data: any): Promise<ResData> {
    return await axios.post(API_DOCTOR_REGISTER_SCHEDULE, data);
  },

  async deleteSchedule({
    schedule,
  }: {
    // workingId: string;
    schedule: HealthExaminationSchedule[];
    // date: string;
  }): Promise<ResData> {
    return await axios.delete(API_DOCTOR_REGISTER_SCHEDULE, {
      data: {
        schedule: schedule.map((s) => s.id),
      },
    });
  },

  async deleteBand({
    userId,
  }: {
    // workingId: string;
    userId: string;
    // date: string;
  }): Promise<ResData> {
    return await axios.post(API_USER_BAN, {
      userId,
      isBanded: false,
    });
  },
};
