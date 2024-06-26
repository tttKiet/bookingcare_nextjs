import { User, AcademicDegree, Specialist, Role, Staff } from "@/models";
import { ISchema } from "yup";

export {};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export interface ResData<T = any | [] | null> {
  statusCode: number;
  msg: string;
  data?: T;
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

export type ConditionConfig<T extends ISchema<any>> = {
  is: any | ((...values: any[]) => boolean);
  then?: (schema: T) => ISchema<any>;
  otherwise?: (schema: T) => ISchema<any>;
};
