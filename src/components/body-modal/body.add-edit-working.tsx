"use client";

// import { schemaValidateRegister } from "@/schema-validate";
import {
  API_ACCOUNT_STAFF,
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
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { GoRepoForked } from "react-icons/go";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import useSWR from "swr";
import { InputField, InputTextareaField, RadioGroupField } from "../form";
import { SelectDateCalendarField } from "../form/select-date-field";
import dayjs from "dayjs";
import { SelectControl } from "../form/SelectControl";
import { SelectFieldNext } from "../form/SelectFieldNext";
import moment from "moment";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/react";

interface SelectProps {
  value: string;
  label: string;
  description: string;
}

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
    formState: { isSubmitted, isSubmitting, isValid },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      staffId: "",
      healthFacilityId: "",
    },
    resolver: yupResolver(schemaWorkingBody),
  });

  const [emailSearch, setEmailSearch] = useState<string>("");
  const [emailHealthFacility, setEmailHealthFacility] = useState<string>("");
  const { data: doctors, mutate: mutateDoctor } = useSWR(
    `${API_ACCOUNT_STAFF}?email=${emailSearch}&offset=0&limit=30`,
    {
      revalidateOnMount: true,
    }
  );
  const { data: healthFacilities, mutate: mutateHealthFacility } = useSWR(
    `${API_HEALTH_FACILITIES}?email=${emailHealthFacility}&offset=0&limit=30`,
    {
      revalidateOnMount: true,
    }
  );
  function onSearchSelectDoctors(value: string): void {
    setEmailSearch(value);
  }
  function onSearchSelectHealthFacility(value: string): void {
    setEmailHealthFacility(value);
  }

  const optionDoctors: SelectProps[] = useMemo(() => {
    return (
      doctors?.rows?.map((t: Staff) => ({
        value: t.id,
        label: t.email,
        description: (
          <div className="flex items-center gap-2">
            <span>{t.fullName}</span>
            <span>
              {t?.Role?.keyType === "doctor" ? (
                <a>
                  <Chip
                    color="primary"
                    variant="flat"
                    radius="sm"
                    className="font-medium"
                    size="sm"
                  >
                    BÁC SĨ
                  </Chip>
                </a>
              ) : (
                <a>
                  <Chip
                    color="secondary"
                    variant="flat"
                    radius="sm"
                    className="font-medium"
                    size="sm"
                  >
                    NHÂN VIÊN
                  </Chip>
                </a>
              )}
            </span>
          </div>
        ),
      })) || []
    );
  }, [doctors]);

  const optionHealthFacilities: SelectProps[] = useMemo(() => {
    return (
      healthFacilities?.rows?.map((t: HealthFacility) => ({
        value: t.id,
        label: t.email,
        description: t.name,
      })) || []
    );
  }, [healthFacilities]);

  async function handleSubmitLocal({ healthFacilityId, staffId }: any) {
    const isOk = await handleSubmitForm({
      healthFacilityId,
      staffId,
      id: obEditWorking?.id,
    });
    if (isOk) {
      reset({
        staffId: "",
        healthFacilityId: "",
      });
      mutateDoctor();
      mutateHealthFacility();
      setEmailSearch("");
      setEmailHealthFacility("");
      clickCancel();
    }
  }

  React.useEffect(() => {
    if (obEditWorking) {
      setEmailSearch("");
      setEmailHealthFacility("");

      reset({
        healthFacilityId: obEditWorking?.healthFacilityId || "",
        staffId: obEditWorking?.staffId || "",
      });
    }
  }, [obEditWorking, reset]);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitLocal)}
      className="flex flex-col gap-2 "
    >
      <div>
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <SelectControl
            control={control}
            placeholder="Nhập email nhận viên..."
            label="Chọn nhân viên"
            name="staffId"
            data={optionDoctors}
            debounceSeconds={500}
            handleSearchSelect={onSearchSelectDoctors}
          />

          <SelectControl
            control={control}
            placeholder="Nhập email cơ sở y tế ..."
            label="Chọn cơ sở y tế"
            name="healthFacilityId"
            data={optionHealthFacilities}
            debounceSeconds={500}
            handleSearchSelect={onSearchSelectHealthFacility}
          />
          {/* <InputField
            type="date"
            control={control}
            label="Chọn ngày bắt đầu công tác"
            name="startDate"
            placeholder="Ngày khám..."
          />
          <InputField
            type="date"
            control={control}
            label="Chọn ngày kết thúc công tác"
            name="endDate"
          /> */}
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end mt-2 py-4">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button color="primary" isLoading={isSubmitting} type="submit">
          {obEditWorking?.id ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
