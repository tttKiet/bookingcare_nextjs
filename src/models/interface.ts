import { AcademicDegree, HealthFacility, Specialist } from "./healthFacilities";

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
