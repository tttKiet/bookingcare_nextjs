"use client";

// import { schemaValidateRegister } from "@/schema-validate";
import { ClinicRoom, WorkRoom, Working } from "@/models";
import {
  schemaClinicRoomBody,
  schemaWorkClinicRoomBody,
} from "@/schema-validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputField } from "../form";
import React, { useState } from "react";
import { SelectDateCalendarField } from "../form/select-date-field";
import { ResDataPaginations } from "@/types";
import { API_WORKING } from "@/api-services/constant-api";
import useSWR from "swr";
import dayjs from "dayjs";
import { SelectControl } from "../form/SelectControl";
import { Button } from "@nextui-org/button";
import { InputNextDateField } from "../form/InputNextDateField";
import { today, parseDate, getLocalTimeZone } from "@internationalized/date";
import moment from "moment";
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
    formState: { isSubmitted, isSubmitting, isValid },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      checkUpPrice: 100000,
      workingId: "",
      applyDate: today(getLocalTimeZone()),
    },
    resolver: yupResolver(schemaWorkClinicRoomBody),
  });

  async function handleSubmitLocal(data: Partial<WorkRoom>) {
    const isOk = await handleSubmitForm({
      ...data,
      applyDate: new Date(data?.applyDate?.toString() || ""),
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
    `${API_WORKING}?healthFacilityId=${healthFacilityId}&doctorName=${emailDoctorSearch}&Role[]=doctor`,
    {
      dedupingInterval: 5000,
    }
  );

  React.useEffect(() => {
    // parseDate(moment(obEdit.date).format("YYYY[-]MM[-]DD"))
    if (obEdit)
      reset({
        checkUpPrice: obEdit?.checkUpPrice || 1000000,
        workingId: obEdit?.workingId || "",
        applyDate:
          parseDate(
            moment(obEdit?.applyDate?.toString()).format("YYYY[-]MM[-]DD")
          ) || today(getLocalTimeZone()),
      });
  }, [obEdit]);

  const optionDoctorsWorking =
    doctorWorking?.rows?.map((t: Working) => ({
      value: t.id,
      label: t.Staff.fullName,
      description: t.Staff.email,
    })) || [];

  return (
    <form
      onSubmit={handleSubmit(handleSubmitLocal)}
      className="flex flex-col gap-2 "
    >
      <div>
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <SelectControl
            control={control}
            placeholder="Nhập tên Bác sĩ..."
            label="Chọn Bác sĩ"
            name="workingId"
            data={optionDoctorsWorking}
            debounceSeconds={500}
            handleSearchSelect={onSearchSelectDoctors}
            disabled={!!obEdit}
          />

          <InputField
            control={control}
            unit={true}
            placeholder="Vd: 101"
            label="Nhập giá khám bệnh..."
            name="checkUpPrice"
            type="number"
          />
          <InputNextDateField
            // defaultDate={today(getLocalTimeZone())}
            control={control}
            label="Nhập ngày áp dụng"
            placeholder="Nhập ngày áp dụng..."
            name="applyDate"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end mt-2 pt-[20px] mb-4">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button
          color={isValid ? "primary" : "default"}
          disabled={!isValid}
          isLoading={isSubmitting}
          type="submit"
        >
          {obEdit?.id ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
