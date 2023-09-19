import { User, AcademicDegree, Specialist, Role, Staff } from "@/models";

export {};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export interface ResData {
  statusCode: number;
  msg: string;
  data?: any;
}

export interface ResDataPaginations<T> {
  count: number;
  rows: array<T>;
  limit: number;
  offset: number;
}

export interface MenuItem {
  title: string;
  href: string;
}

export interface StaffAccountRes extends Staff {
  AcademicDegree: typeof AcademicDegree;
  Specialist: typeof Specialist;
  Role: typeof Role;
}
