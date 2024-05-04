import {
  LoginPayLoad,
  Staff,
  User,
  Code,
  HealthExaminationSchedule,
  HealthRecord,
  ServiceDetails,
  PrescriptionDetail,
  Booking,
} from "@/models";
import axios from "../axios";
import { ResData, ResDataPaginations } from "@/types";
import {
  API_ACCOUNT_STAFF,
  API_ACCOUNT_USER,
  API_ADMIN_MANAGER_ADMIN_HEALTH,
  API_CHECK_UP_HEALTH_RECORD,
  API_CODE,
  API_DOCTOR_BOOKING,
  API_DOCTOR_PRESCRIPTION_DETAILS,
  API_DOCTOR_SCHEDULE_HEALTH_EXAM,
  API_DOCTOR_SERVICE_DETAILS,
  MARKDOWN_DOCTOR,
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
  async craeteHealthRecord(data: Partial<HealthRecord>): Promise<ResData> {
    return await axios.post(API_CHECK_UP_HEALTH_RECORD, data);
  },

  async editHealthRecord(data: Partial<HealthRecord>): Promise<ResData> {
    return await axios.patch(API_CHECK_UP_HEALTH_RECORD, {
      ...data,
      statusId: data.statusCode,
      id: data.id,
    });
  },

  // get Staff
  async getStaff({
    type,
    email,
  }: {
    type: "hospital_manager";
    email?: string;
  }): Promise<ResData<ResDataPaginations<Staff>>> {
    return await axios.get(
      `${API_ACCOUNT_STAFF}?type=${type}&email=${email || ""}`
    );
  },

  // saervice details
  async createOrUpdateServiceDetails(
    data: Partial<ServiceDetails>
  ): Promise<ResData<ServiceDetails>> {
    return await axios.post(API_DOCTOR_SERVICE_DETAILS, {
      ...data,
    });
  },

  async deleteServiceDetails(id: string): Promise<ResData<ServiceDetails>> {
    return await axios.delete(API_DOCTOR_SERVICE_DETAILS, {
      data: {
        id,
      },
    });
  },

  async editCodeBooking({ status, id }: Partial<Booking>): Promise<ResData> {
    return await axios.post(API_DOCTOR_BOOKING, {
      bookingId: id,
      statusId: status,
    });
  },

  // prescription details
  async createOrUpdatePrescriptionDetail(
    data: Partial<PrescriptionDetail>
  ): Promise<ResData<PrescriptionDetail>> {
    return await axios.post(API_DOCTOR_PRESCRIPTION_DETAILS, {
      ...data,
    });
  },

  async deletePrescriptionDetail(
    id: string
  ): Promise<ResData<PrescriptionDetail>> {
    return await axios.delete(API_DOCTOR_PRESCRIPTION_DETAILS, {
      data: {
        id,
      },
    });
  },

  // done chekcup

  async editCheckUpDoneAndSendEmail({
    id,
    emailDestination,
    pdfs,
    diagnosis,
    note,
  }: {
    id: string;
    emailDestination: string;
    pdfs: any[];
    diagnosis: string;
    note: string;
  }): Promise<ResData> {
    var formData = new FormData();
    formData.append("id", id);
    formData.append("emailDestination", emailDestination);

    formData.append("diagnosis", diagnosis);
    formData.append("note", note);

    const files = pdfs.map((f, i) => {
      const url = URL.createObjectURL(f);
      const pdfFile = new File([f], `file${i + 1}.pdf`, {
        type: "application/pdf",
      });
      return pdfFile;
    });

    formData.append("pdf", files[0]);
    formData.append("pdf", files[1]);
    return await axios.post(API_CHECK_UP_HEALTH_RECORD + "/done", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async updateMarkdown(data: {
    html: string;
    text: string;
    doctorId: string;
  }): Promise<ResData> {
    return await axios.post(MARKDOWN_DOCTOR, {
      html: data.html,
      doctorId: data.doctorId,
      content: data.text,
    });
  },
};
