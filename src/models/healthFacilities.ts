import { Dayjs } from "dayjs";
import {
  HealthRecord,
  HospitalManager,
  HospitalService,
  Staff,
  Working,
} from "./interface";
import { ResDataPaginations } from "@/types";

export interface TypeHealthFacility {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthFacility {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  typeHealthFacilityId: string;
  addressCode: string[];
  images: string[];
  markdownHtml: string;
  markdownContent: string;
  createdAt: string;
  updatedAt: string;

  TypeHealthFacility: TypeHealthFacility;
}

export interface HealthFacilityStar extends HealthFacility {
  reviewIndex: {
    countReview: number;
    avg: number;
    star: {
      star5: number;
      star4: number;
      star3: number;
      star2: number;
      star1: number;
    };
  };
}

export interface Specialist {
  id: string;
  name: string;
  descriptionDisease: string;
  descriptionDoctor: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicRoom {
  roomNumber: number;
  healthFacilityId: string;
  capacity: number;
  HealthFacility: HealthFacility;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicDegree {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkRoom {
  id: string;
  checkUpPrice: number;
  applyDate: Date | Dayjs | Object | string;
  workingId: string;
  ClinicRoomHealthFacilityId: string;
  ClinicRoomRoomNumber: number;
  ClinicRoom: ClinicRoom;
  Working: Working;
}

export interface ResManagerAdmin {
  healthFacility: HealthFacility;
  manager: HospitalManager[];
  managerCount: number;
}

export interface ResAdminManagerHospitalService {
  healthFacility: HealthFacility;
  service: HospitalService[];
  serviceCount: number;
}

export interface ResPaginationMedicalRecord
  extends ResDataPaginations<HealthRecord> {
  optionFilter: {
    doctorList: Staff[];
    healthFacilityList: HealthFacility[];
  };
}
