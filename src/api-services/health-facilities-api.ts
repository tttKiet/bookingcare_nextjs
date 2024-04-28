import axios from "../axios";
import { ResData } from "@/types";
import {
  ClinicRoom,
  HealthFacility,
  TypeHealthFacility,
} from "../models/index";
import {
  API_HEALTH_FACILITIES,
  API_HEALTH_FACILITY_ROOM,
  API_SPECIALIST,
  API_TYPE_HEALTH_FACILITIES,
  MARKDOWN_HEALTH,
} from "./constant-api";

import { Specialist } from "../models";

import { HealthFacilityClient } from "@/components/body-modal";
import { Room } from "aws-sdk/clients/alexaforbusiness";
export interface ReqClinicRoom extends ClinicRoom {
  oldRoomNumber: number;
}
export const healthFacilitiesApi = {
  async createTypeHealthFacility({
    name,
  }: {
    name: string;
  }): Promise<ResData<TypeHealthFacility>> {
    return await axios.post(API_TYPE_HEALTH_FACILITIES, {
      name,
    });
  },
  async updateTypeHealthFacility({
    id,
    nameUpdated,
  }: {
    id: string;
    nameUpdated: string;
  }): Promise<ResData<Partial<TypeHealthFacility>>> {
    return await axios.patch(API_TYPE_HEALTH_FACILITIES, {
      id,
      name: nameUpdated,
    });
  },
  async deleteTypeHealthFacility({
    id,
  }: {
    id: string;
  }): Promise<ResData<any>> {
    return await axios.delete(API_TYPE_HEALTH_FACILITIES, {
      data: {
        id,
      },
    });
  },
  async createHealthFacility(data: any): Promise<ResData> {
    const bodyFormData = new FormData();
    if (
      !(
        data.addressCode &&
        data.name &&
        data.address &&
        data.email &&
        data.files &&
        data.phone &&
        data.typeHealthFacilityId
      )
    )
      return {
        statusCode: 1,
        msg: "Truyền tham số chưa đủ",
        data: null,
      };
    bodyFormData.append("name", data.name);
    bodyFormData.append("address", data.address);
    bodyFormData.append("email", data.email);
    bodyFormData.append("addressCode", JSON.stringify(data.addressCode));

    data.files.forEach((f: any) => {
      if (f && f?.originFileObj) bodyFormData.append("images", f.originFileObj);
    });
    bodyFormData.append("phone", data.phone);
    bodyFormData.append("typeHealthFacilityId", data.typeHealthFacilityId);
    return await axios.post(API_HEALTH_FACILITIES, bodyFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async updateHealthFacility(data: any): Promise<ResData<HealthFacility>> {
    const bodyFormData = new FormData();
    if (
      !(
        data.name &&
        data.address &&
        data.email &&
        data.files &&
        data.phone &&
        data.id &&
        data.typeHealthFacilityId
      )
    )
      return {
        statusCode: 1,
        msg: "Truyền tham số chưa đủ",
      };
    bodyFormData.append("id", data.id);
    bodyFormData.append("name", data.name);
    bodyFormData.append("address", data.address);
    bodyFormData.append("email", data.email);
    bodyFormData.append("addressCode", JSON.stringify(data.addressCode));

    data.files.forEach((f: any) => {
      if (f && f?.originFileObj) bodyFormData.append("images", f.originFileObj);
      else if (f && f?.uid && !f.originFileObj)
        bodyFormData.append("imageOlds", f.uid);
    });
    bodyFormData.append("phone", data.phone);
    bodyFormData.append("typeHealthFacilityId", data.typeHealthFacilityId);
    return await axios.patch(API_HEALTH_FACILITIES, bodyFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async deleteHealthFacility(id: string): Promise<ResData<HealthFacility>> {
    return await axios.delete(API_HEALTH_FACILITIES, { data: { id: id } });
  },

  async createOrUpdateSpecialist({
    name,
    descriptionDisease,
    descriptionDoctor,
    id,
  }: Partial<Specialist>): Promise<ResData<Specialist>> {
    return await axios.post(API_SPECIALIST, {
      name,
      descriptionDisease,
      descriptionDoctor,
      id,
    });
  },

  async deleteSpecialist({ id }: { id: string }): Promise<any> {
    return await axios.delete(API_SPECIALIST, {
      data: {
        id,
      },
    });
  },

  async createOrUpdateHealthRoom({
    roomNumber,
    oldRoomNumber,
    healthFacilityId,
    capacity,
  }: Partial<ReqClinicRoom>): Promise<ResData<Room>> {
    return await axios.post(API_HEALTH_FACILITY_ROOM, {
      roomNumber,
      oldRoomNumber,
      healthFacilityId,
      capacity,
    });
  },

  async deleteHealthRoom({
    healthFacilityId,
    roomNumber,
  }: {
    roomNumber: number;
    healthFacilityId: string;
  }): Promise<ResData<Room>> {
    return await axios.delete(API_HEALTH_FACILITY_ROOM, {
      data: {
        roomNumber,
        healthFacilityId,
      },
    });
  },

  async updateHealthMarkdown(data: {
    html: string;
    text: string;
    healthFacilityId: string;
  }): Promise<ResData<Room>> {
    return await axios.post(MARKDOWN_HEALTH, {
      html: data.html,
      healthFacilityId: data.healthFacilityId,
      content: data.text,
    });
  },
};
