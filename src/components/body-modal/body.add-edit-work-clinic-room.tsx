"use client";

// import { schemaValidateRegister } from "@/schema-validate";
import { ClinicRoom, WorkRoom, Working } from "@/models";
import {
  schemaClinicRoomBody,
  schemaWorkClinicRoomBody,
} from "@/schema-validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Space } from "antd";
import { useForm } from "react-hook-form";
import { InputField, SelectField } from "../form";
import React, { useState } from "react";
import { SelectDateCalendarField } from "../form/select-date-field";
import { ResDataPaginations } from "@/types";
import { API_WORKING } from "@/api-services/constant-api";
import useSWR from "swr";
import dayjs from "dayjs";

export interface BodyModalWorkRoomProps {
  handleSubmitForm: (data: Partial<WorkRoom>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEdit?: WorkRoom | null;
  healthFacilityId: string | null;
}
export function BodyModalClinicRoomWork({
  clickCancel,
  handleSubmitForm,
  loading,
  obEdit,
  healthFacilityId,
}: BodyModalWorkRoomProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, isSubmitting },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      checkUpPrice: 100000,
      workingId: "",
      applyDate: dayjs(new Date()),
    },
    resolver: yupResolver(schemaWorkClinicRoomBody),
  });

  async function handleSubmitLocal(data: Partial<WorkRoom>) {
    const isOk = await handleSubmitForm({
      ...data,
      id: obEdit?.id || undefined,
    });
    if (isOk) {
      reset({});
      clickCancel();
    }
    return isOk;
  }
  const [emailDoctorSearch, setEmailDoctorSearch] = useState("");
  function onSearchSelectDoctors(value: string) {
    setEmailDoctorSearch(value);
  }

  const {
    data: doctorWorking,
    isLoading,
    error,
    mutate: mutateDoctorWorking,
  } = useSWR<ResDataPaginations<Working>>(
    `${API_WORKING}?healthFacilityId=${healthFacilityId}&doctorEmail=${emailDoctorSearch}`,
    {
      dedupingInterval: 5000,
    }
  );

  React.useEffect(() => {
    if (obEdit)
      reset({
        checkUpPrice: obEdit?.checkUpPrice || 1000000,
        workingId: obEdit?.workingId || "",
        applyDate:
          dayjs(new Date(obEdit.applyDate.toString())) || dayjs(new Date()),
      });
  }, [obEdit]);

  const optionDoctorsWorking =
    doctorWorking?.rows?.map((t: Working) => ({
      value: t.id,
      label: (
        <div>
          <h3 className="text-sm text-gray-600 font-medium">
            {t.Staff.fullName}
          </h3>
          <span className="text-xs text-black font-normal flex items-center justify-between">
            <span>{t.Staff.email}</span>
            <span>{t.Staff.AcademicDegree.name}</span>
          </span>
        </div>
      ),
    })) || [];

  return (
    <form
      onSubmit={handleSubmit(handleSubmitLocal)}
      className="flex flex-col gap-2 pt-4"
    >
      <div>
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <SelectField
            width="100%"
            control={control}
            placeholder="Nhập email bác sỉ..."
            label="Chọn bác sỉ"
            name="workingId"
            options={optionDoctorsWorking}
            debounceSeconds={500}
            onSearchSelect={onSearchSelectDoctors}
            disabled={!!obEdit}
          />

          <InputField
            control={control}
            placeholder="Vd: 101"
            label="Nhập giá khám bệnh..."
            name="checkUpPrice"
            type="number"
          />
          <SelectDateCalendarField
            control={control}
            label="Nhập ngày áp dụng..."
            name="applyDate"
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
            {obEdit?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
