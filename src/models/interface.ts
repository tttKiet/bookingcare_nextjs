import { Dayjs } from "dayjs";
import {
  AcademicDegree,
  HealthFacility,
  Specialist,
  WorkRoom,
} from "./healthFacilities";

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: string;
  experience: string;
  certificate: string;
  roleId: string;
  academicDegreeId: string;
  specialistId: string;
  createdAt: string;
  updatedAt: string;
  AcademicDegree: AcademicDegree;
  Specialist: Specialist;
}

export interface Role {
  id: string;
  keyType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Working {
  id: string;
  staffId: string;
  healthFacilityId: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  Staff: Staff;
  HealthFacility: HealthFacility;
}

export interface Code {
  key: string;
  name: string;
  value: string;
}

export interface HealthExaminationSchedule {
  id: string;
  date: string | Date | Object;
  timeCode: string;
  TimeCode: Code;
  workingId: string;
  Working: Working;
  maxNumber: number;
}

export interface PatientProfile {
  id: string;
  fullName: string;
  phone: string;
  profession: string;
  email: string;
  gender: string;
  birthDay: string;
  nation: string;
  cccd: string;
  addressCode: string[];
  userId: string;
  User: User;
}

export interface Booking {
  id: string;
  descriptionDisease: string;
  healthExaminationScheduleId: string;
  patientProfileId: string;
  createdAt: string;
  updatedAt: string;
  HealthExaminationSchedule: HealthExaminationSchedule;
  PatientProfile: PatientProfile;
}

export interface HealthRecord {
  id: string;
  bookingId: string;
  healthExaminationScheduleId: string;
  statusCode: string;
  orderNumber: Number;
  Booking: Booking;
  HealthExaminationSchedule: HealthExaminationSchedule;
  status: Code;
  WorkRoom: WorkRoom;
}
