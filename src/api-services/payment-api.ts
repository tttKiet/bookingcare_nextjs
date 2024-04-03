import { LoginPayLoad } from "@/models";
import axios from "../axios";
import { ResData } from "@/types";
import { PAYMENT_VNPAY_CREATE_UTL } from "./constant-api";

export const paymentApi = {
  async vnpayCreateUrl({
    healthExaminationScheduleId,
    paymentType,
    patientProfileId,
    descriptionDisease,
  }: {
    healthExaminationScheduleId: string;
    paymentType: string;
    patientProfileId: string;
    descriptionDisease: string;
  }): Promise<
    ResData<{
      url: string;
    }>
  > {
    return await axios.post(PAYMENT_VNPAY_CREATE_UTL, {
      healthExaminationScheduleId,
      paymentType,
      patientProfileId,
      descriptionDisease,
    });
  },
};
