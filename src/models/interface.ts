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

export interface StaffAndSchedule {
  working: Working;
  schedules: HealthExaminationSchedule[];
}

export interface ResAdminHealthExaminationSchedule {
  date: string | Date | Object;
  data: StaffAndSchedule[];
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

export interface Patient {
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
  healthFacilityId: string;
  HealthFacility: HealthFacility;
}

export interface Booking {
  id: string;
  descriptionDisease: string;
  healthExaminationScheduleId: string;
  patientProfileId: string;
  doctorPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  paymentType: "card" | "hospital";
  HealthExaminationSchedule: HealthExaminationSchedule;
  PatientProfile: PatientProfile;
  Code: Code;
}

export interface HealthRecord {
  id: string;
  bookingId: string;
  patientId: string;
  diagnosis: string;
  note: string;
  Booking: Booking;
  Patient: Booking;
  statusCode: string;
  status: Code;
  createdAt: string;
  updatedAt: string;
}

export interface Cedicine {
  id: string;
  name: string;
  desc: string;
}

export interface HospitalManager {
  id: string;
  staffId: string;
  healthFacilityId: string;
  isAcctive: boolean;
  createdAt: string;
  updatedAt: string;
  Staff: Staff;
  HealthFacility: HealthFacility;
}

export interface ExaminationService {
  id: string;
  name: string;
  description: string;
}

export interface HospitalService {
  id: string;
  examinationServiceId: string;
  healthFacilityId: string;
  price: number;
  isAcctive: boolean;
  HealthFacility: HealthFacility;
  ExaminationService: ExaminationService;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleAvailable extends HealthExaminationSchedule {
  isAvailableBooking: boolean;
}

export interface WorkingAndScheduleDoctor {
  working: Working;
  schedules: ScheduleAvailable[];
}

export interface ScheduleFilterDoctor {
  date: string;
  data: WorkingAndScheduleDoctor[];
}

export interface TimeSlot {
  Morning: ScheduleAvailable[];
  Afternoon: ScheduleAvailable[];
}

export interface BookingForUser extends Booking {
  workRoom: WorkRoom;
}

export interface ServiceDetails {
  id: string;
  hospitalServiceId: string;
  healthRecordId: string;
  descriptionResult: string;
  HealthRecord: HealthRecord;
  HospitalService: HospitalService;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionDetail {
  id: string;
  cedicineId: string;
  healthRecordId: string;
  unit: string;
  morning: number;
  noon: number;
  afterNoon: number;
  evening: number;
  quantity: number;
  usage: string;
  HealthRecord: HealthRecord;
  Cedicine: Cedicine;
  createdAt: string;
  updatedAt: string;
}

export interface ResBookingAndHealthRecord {
  booking: Booking;
  healthRecord: HealthRecord;
}
