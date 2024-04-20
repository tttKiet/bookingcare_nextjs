// import { schemaValidateRegister } from "@/schema-validate";
import {
  API_ACEDEMIC_DEGREE,
  API_ROLE,
  API_SPECIALIST,
} from "@/api-services/constant-api";
import { AcademicDegree, Role, Specialist, Staff } from "@/models";
import { schemaStaffBody, schemaStaffManagerBody } from "@/schema-validate";
import { ResDataPaginations } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { GoRepoForked } from "react-icons/go";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import useSWR from "swr";
import { InputField, InputTextareaField, RadioGroupField } from "../form";
import { Button } from "@nextui-org/button";

export interface BodyModalAccountManagerProps {
  handleSubmitForm: (data: Partial<Staff>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEditStaff?: Staff | null;
}
export function BodyModalAccountManager({
  clickCancel,
  handleSubmitForm,
  loading,
  obEditStaff,
}: BodyModalAccountManagerProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, isSubmitting, isValid },
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      rePassword: "",
      address: "",
      fullName: "",
      gender: "",
    },
    resolver: yupResolver(schemaStaffManagerBody),
  });

  React.useEffect(() => {
    reset({
      email: obEditStaff?.email || "",
      password: obEditStaff?.password || "",
      rePassword: obEditStaff?.password || "",
      phone: obEditStaff?.phone || "",
      address: obEditStaff?.address || "",
      fullName: obEditStaff?.fullName || "",
      gender: obEditStaff?.gender || "",
    });
  }, [obEditStaff]);

  async function handleSubmitLocal(data: Partial<Staff>) {
    const isOk = await handleSubmitForm({
      ...data,
      id: obEditStaff?.id,
    });
    if (isOk) {
      reset({});
      clickCancel();
    }
    return isOk;
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitLocal)}
      className="flex flex-col gap-2 "
    >
      <div>
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <InputField
            control={control}
            name="fullName"
            label="Họ, tên nhân viên"
            icon={<MdOutlineMailOutline />}
          />
          <RadioGroupField
            icon={<TbLockSquareRounded />}
            control={control}
            name="gender"
            options={[
              { label: "Nam", value: "male" },
              { label: "Nữ", value: "female" },
            ]}
            label="Giới tính"
          />
          <InputField
            control={control}
            name="email"
            label="Email"
            icon={<MdOutlineMailOutline />}
          />
          <InputField
            control={control}
            name="phone"
            label="Số điện thoại"
            type="text"
            icon={<TbLockSquareRounded />}
          />
          <InputField
            control={control}
            name="password"
            label="Mật khẩu"
            type="password"
            icon={<TbLockSquareRounded />}
          />
          <InputField
            control={control}
            name="rePassword"
            label="Nhập lại mật khẩu"
            type="password"
            icon={<TbLockSquareRounded />}
          />

          <div className="col-span-2">
            <InputTextareaField
              control={control}
              name="address"
              label="Địa chỉ"
              type="text"
              icon={<TbLockSquareRounded />}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end mt-2 py-4">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button color="primary" isLoading={isSubmitting} type="submit">
          {obEditStaff?.id ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
