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
import { Image } from "@nextui-org/image";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const id = searchParams.get("id");
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
    `${API_ACCOUNT_STAFF}?fullName=${emailSearch}&offset=0&limit=30`,
    {
      revalidateOnMount: true,
    }
  );
  const { data: healthFacilities, mutate: mutateHealthFacility } = useSWR(
    `${API_HEALTH_FACILITIES}?name=${emailHealthFacility}&offset=0&limit=30`,
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
        label: t.fullName,
        description: (
          <div className="flex items-center gap-2">
            <span>{t.email}</span>
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
  }, [doctors, doctors?.rows?.length]);

  const optionHealthFacilities: SelectProps[] = useMemo(() => {
    return (
      healthFacilities?.rows?.map((t: HealthFacility) => ({
        value: t.id,
        label: t.name,
        startContent: (
          <Image
            className="rounded-full border-spacing-8 border  border-blue-400  object-cover w-[44px] h-[42px]"
            alt="Health Facility"
            width={44}
            height={44}
            src={t?.images?.[0] || ""}
          />
        ),
        description: t.email,
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

      router.replace(`/admin/work`, {
        scroll: false,
      });

      mutateDoctor();
      mutateHealthFacility();
      setEmailSearch("");
      setEmailHealthFacility("");
      clickCancel();
    }
  }

  useEffect(() => {
    if (q && id) {
      reset({
        staffId: id || "",
      });
      setEmailSearch(q);
    }
  }, [q, id]);
  React.useEffect(() => {
    if (obEditWorking) {
      setEmailSearch(obEditWorking?.Staff?.fullName);
      setEmailHealthFacility(obEditWorking?.HealthFacility?.name);

      reset({
        healthFacilityId: obEditWorking?.healthFacilityId || "",
        staffId: obEditWorking?.staffId || "",
      });
      mutateDoctor();
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
            placeholder="Tìm tên nhân viên..."
            label="Chọn nhân viên"
            name="staffId"
            data={optionDoctors}
            debounceSeconds={500}
            handleSearchSelect={onSearchSelectDoctors}
          />

          <SelectControl
            control={control}
            placeholder="Tìm tên cơ sở y tế ..."
            label="Chọn cơ sở y tế"
            name="healthFacilityId"
            data={optionHealthFacilities}
            debounceSeconds={500}
            handleSearchSelect={onSearchSelectHealthFacility}
          />
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
