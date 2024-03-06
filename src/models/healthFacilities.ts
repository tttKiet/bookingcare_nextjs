import { Dayjs } from "dayjs";
import { HospitalManager, Working } from "./interface";

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
  images: string[];
  createdAt: string;
  updatedAt: string;
  TypeHealthFacility: TypeHealthFacility;
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
