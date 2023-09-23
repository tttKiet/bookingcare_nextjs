"use client";

// import { schemaValidateRegister } from "@/schema-validate";
import {
  API_ACCOUNT_STAFF_DOCTOR,
  API_ACEDEMIC_DEGREE,
  API_HEALTH_FACILITIES,
  API_ROLE,
  API_SPECIALIST,
} from "@/api-services/constant-api";
import {
  AcademicDegree,
  HealthFacility,
  Role,
  Specialist,
  Staff,
  Working,
} from "@/models";
import { schemaStaffBody, schemaWorkingBody } from "@/schema-validate";
import { ResDataPaginations } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Space } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { GoRepoForked } from "react-icons/go";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import useSWR from "swr";
import {
  InputField,
  InputTextareaField,
  RadioGroupField,
  SelectField,
} from "../form";
import { SelectDateCalendarField } from "../form/select-date-field";
import dayjs from "dayjs";

export interface BodyModalWorkingProps {
  handleSubmitForm: (data: Partial<Working>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEditWorking?: Working | null;
}
export function BodyModalWorking({
  clickCancel,
  handleSubmitForm,
  loading,
  obEditWorking,
}: BodyModalWorkingProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, isSubmitting },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      staffId: "",
      healthFacilityId: "",
      startDate: dayjs(new Date()),
      endDate: null,
    },
    resolver: yupResolver(schemaWorkingBody),
  });

  const [emailSearch, setEmailSearch] = useState<string>("");
  const [emailHealthFacility, setEmailHealthFacility] = useState<string>("");
  const { data: doctors } = useSWR(
    `${API_ACCOUNT_STAFF_DOCTOR}?email=${emailSearch}`,
    {
      revalidateOnMount: false,
    }
  );
  const { data: healthFacilities } = useSWR(
    `${API_HEALTH_FACILITIES}?email=${emailHealthFacility}`,
    {
      revalidateOnMount: false,
    }
  );
  function onSearchSelectDoctors(value: string): void {
    setEmailSearch(value);
  }
  function onSearchSelectHealthFacility(value: string): void {
    setEmailHealthFacility(value);
  }
  const [optionDoctors, setOptionDoctors] = useState<
    Array<{
      value: string;
      label: React.ReactNode;
    }>
  >([]);
  const [optionHealthFacilities, setOptionHealthFacilities] = useState<
    Array<{
      value: string;
      label: React.ReactNode;
    }>
  >([]);

  useEffect(() => {
    setOptionDoctors(() => {
      return (
        doctors?.rows?.map((t: Staff) => ({
          value: t.id,
          label: (
            <div>
              <h3 className="text-sm text-gray-600 font-medium">
                {t.fullName}
              </h3>
              <span className="text-xs text-black font-normal flex items-center justify-between">
                <span>{t.email}</span>
                <span>{t.AcademicDegree.name}</span>
              </span>
            </div>
          ),
        })) || []
      );
    });
    setOptionHealthFacilities(() => {
      return (
        healthFacilities?.rows?.map((t: HealthFacility) => ({
          value: t.id,
          label: (
            <div>
              <h3 className="text-sm text-gray-600 font-medium"> {t.name}</h3>
              <span className="text-xs text-black font-normal flex items-center justify-between">
                <span>{t.email}</span>
                <span>{t.address}</span>
              </span>
            </div>
          ),
        })) || []
      );
    });
  }, [healthFacilities, doctors]);

  async function handleSubmitLocal({
    healthFacilityId,
    staffId,
    startDate,
    endDate,
  }: any) {
    console.log("handleSubmitLocal", {
      healthFacilityId,
      staffId,
      startDate,
      endDate,
    });
    const isOk = await handleSubmitForm({
      healthFacilityId,
      staffId,
      startDate: startDate,
      endDate: endDate,
      id: obEditWorking?.id,
    });
    if (isOk) {
      reset({});
      clickCancel();
    }
  }

  React.useEffect(() => {
    if (obEditWorking?.staffId) {
      setOptionDoctors(() => {
        return [
          {
            value: obEditWorking.Staff.id,
            label: (
              <div>
                <h3 className="text-sm text-gray-600 font-medium">
                  {obEditWorking.Staff.fullName}
                </h3>
                <span className="text-xs text-black font-normal flex items-center justify-between">
                  <span>{obEditWorking.Staff.email}</span>
                  <span>{obEditWorking.Staff.fullName}</span>
                </span>
              </div>
            ),
          },
        ];
      });
    }

    if (obEditWorking?.healthFacilityId) {
      setOptionHealthFacilities(() => {
        return [
          {
            value: obEditWorking.HealthFacility.id,
            label: (
              <div>
                <h3 className="text-sm text-gray-600 font-medium">
                  {" "}
                  {obEditWorking.HealthFacility.name}
                </h3>
                <span className="text-xs text-black font-normal flex items-center justify-between">
                  <span>{obEditWorking.HealthFacility.email}</span>
                  <span>{obEditWorking.HealthFacility.address}</span>
                </span>
              </div>
            ),
          },
        ];
      });
    }
    reset({
      healthFacilityId: obEditWorking?.healthFacilityId || "",
      staffId: obEditWorking?.staffId || "",
      startDate: dayjs(obEditWorking?.startDate) || "",
      endDate: obEditWorking?.endDate ? dayjs(obEditWorking?.endDate) : null,
    });
  }, [obEditWorking, reset]);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitLocal)}
      className="flex flex-col gap-2 pt-4"
    >
      <div>
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <SelectField
            width={400}
            control={control}
            placeholder="Nhập email bác sỉ..."
            label="Chọn bác sỉ"
            name="staffId"
            options={optionDoctors}
            debounceSeconds={500}
            onSearchSelect={onSearchSelectDoctors}
          />
          <SelectField
            width={400}
            control={control}
            placeholder="Nhập email cơ sở y tế ..."
            label="Chọn cơ sở y tế"
            name="healthFacilityId"
            options={optionHealthFacilities}
            debounceSeconds={500}
            onSearchSelect={onSearchSelectHealthFacility}
          />
          <SelectDateCalendarField
            control={control}
            label="Chọn ngày bắt đầu công tác"
            name="startDate"
          />
          <SelectDateCalendarField
            control={control}
            label="Chọn ngày kết thúc công tác"
            name="endDate"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end mt-2 pt-[20px]">
        <Button type="default" size="middle" onClick={clickCancel}>
          Hủy
        </Button>
        <Space wrap>
          <Button
            type="primary"
            size="middle"
            loading={isSubmitting}
            // onClick={() => true}
            htmlType="submit"
          >
            {obEditWorking?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
