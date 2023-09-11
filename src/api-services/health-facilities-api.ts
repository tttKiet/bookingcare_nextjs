import axios from "../axios";
import { ResData } from "@/types";
import { HealthFacility } from "../models/index";
import {
  API_HEALTH_FACILITIES,
  API_SPECIALIST,
  API_TYPE_HEALTH_FACILITIES,
} from "./constant-api";

import { Specialist } from "../models";

import { HealthFacilityClient } from "@/components/body-modal";

export const healthFacilitiesApi = {
  async createTypeHealthFacility({ name }: { name: string }): Promise<ResData> {
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
  }): Promise<ResData> {
    return await axios.patch(API_TYPE_HEALTH_FACILITIES, {
      id,
      name: nameUpdated,
    });
  },
  async deleteTypeHealthFacility({ id }: { id: string }): Promise<ResData> {
    return await axios.delete(API_TYPE_HEALTH_FACILITIES, {
      data: {
        id,
      },
    });
  },
  async createHealthFacility(
    data: Partial<HealthFacilityClient>
  ): Promise<ResData> {
    const bodyFormData = new FormData();
    if (
      !(
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
      };
    bodyFormData.append("name", data.name);
    bodyFormData.append("address", data.address);
    bodyFormData.append("email", data.email);
    data.files.forEach((f) => {
      if (f && f?.originFileObj) bodyFormData.append("images", f.originFileObj);
    });
    bodyFormData.append("phone", data.phone);
    bodyFormData.append("typeHealthFacilityId", data.typeHealthFacilityId);
    return await axios.post(API_HEALTH_FACILITIES, bodyFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async updateHealthFacility(
    data: Partial<HealthFacilityClient>
  ): Promise<ResData> {
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
    data.files.forEach((f) => {
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

  async deleteHealthFacility(id: string): Promise<ResData> {
    return await axios.delete(API_HEALTH_FACILITIES, { data: { id: id } });
  },

  async createOrUpdateSpecialist({
    name,
    descriptionDisease,
    descriptionDoctor,
    id,
  }: Partial<Specialist>): Promise<ResData> {
    return await axios.post(API_SPECIALIST, {
      name,
      descriptionDisease,
      descriptionDoctor,
      id,
    });
  },

  async deleteSpecialist({ id }: { id: string }): Promise<ResData> {
    return await axios.delete(API_SPECIALIST, {
      data: {
        id,
      },
    });
  },
};
