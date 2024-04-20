// import { schemaValidateRegister } from "@/schema-validate";
import {
  API_ACEDEMIC_DEGREE,
  API_ROLE,
  API_SPECIALIST,
} from "@/api-services/constant-api";
import { AcademicDegree, Role, Specialist, Staff } from "@/models";
import { schemaStaffBody } from "@/schema-validate";
import { ResDataPaginations } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { Key, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { GoRepoForked } from "react-icons/go";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import useSWR from "swr";
import {
  InputField,
  InputTextareaField,
  RadioGroupField,
  SelectSearchField,
} from "../form";
import { SelectFieldNext } from "../form/SelectFieldNext";
import { Button } from "@nextui-org/button";
import {
  Chip,
  Divider,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";
import { LiaUserNurseSolid } from "react-icons/lia";

export interface BodyModalAccountDoctorProps {
  handleSubmitForm: (data: Partial<Staff>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEditStaff?: Staff | null;
}
export function BodyModalAccountDoctor({
  clickCancel,
  handleSubmitForm,
  loading,
  obEditStaff,
}: BodyModalAccountDoctorProps) {
  const [roleValue, setRoleValue] = useState<string>("doctor");
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
      academicDegreeId: "",
      certificate: "",
      experience: "",
      specialistId: "",
    },
    resolver: yupResolver(schemaStaffBody),
  });

  const { data: specialists } =
    useSWR<ResDataPaginations<Specialist>>(API_SPECIALIST);
  const optionSpecialists =
    specialists?.rows?.map((t: Specialist) => ({
      value: t.id,
      label: t.name,
    })) || [];

  const { data: academicDegree } =
    useSWR<ResDataPaginations<AcademicDegree>>(API_ACEDEMIC_DEGREE);
  const optionAcademicDegree =
    academicDegree?.rows?.map((t: AcademicDegree) => ({
      value: t.id,
      label: t.name,
    })) || [];
  React.useEffect(() => {
    reset({
      email: obEditStaff?.email || "",
      password: obEditStaff?.password || "",
      rePassword: obEditStaff?.password || "",
      phone: obEditStaff?.phone || "",
      address: obEditStaff?.address || "",
      fullName: obEditStaff?.fullName || "",
      gender: obEditStaff?.gender || "",
      academicDegreeId: obEditStaff?.academicDegreeId || "",
      certificate: obEditStaff?.certificate || "",
      experience: obEditStaff?.experience || "",
      specialistId: obEditStaff?.specialistId || "",
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
  const headingClass = "text-black font-bold";

  return (
    <form
      onSubmit={handleSubmit(handleSubmitLocal)}
      className="flex flex-col gap-2 "
    >
      <div className="overflow-y-auto max-h-[400px] px-2 pt-1 pb-1">
        <div>
          <h3 className={`mb-4 ${headingClass}`}>Thông tin tài khoản</h3>
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
            {/* <SelectFieldNext
              control={control}
              icon={<GoRepoForked />}
              label="Học vị"
              placeholder="Chọn học vị"
              name="academicDegreeId"
              options={[...optionAcademicDegree]}
            />
            <SelectFieldNext
              control={control}
              icon={<GoRepoForked />}
              placeholder="Chuyên khoa"
              width={180}
              label="Chuyên khoa"
              name="specialistId"
              options={[...optionSpecialists]}
            />
            <InputField
              control={control}
              name="certificate"
              label="Chứng chỉ, bằng cấp"
              type="text"
              icon={<TbLockSquareRounded />}
            />
            <InputTextareaField
              control={control}
              name="experience"
              label="Kinh nghiệm"
              type="text"
              icon={<TbLockSquareRounded />}
            /> */}
          </div>
        </div>
        <div className="mt-6">
          <h3 className={`mb-4 ${headingClass}`}>Thông tin bác sỉ</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
            <SelectFieldNext
              control={control}
              icon={<GoRepoForked />}
              label="Học vị"
              placeholder="Chọn học vị"
              name="academicDegreeId"
              options={[...optionAcademicDegree]}
            />
            <SelectFieldNext
              control={control}
              icon={<GoRepoForked />}
              placeholder="Chuyên khoa"
              width={180}
              label="Chuyên khoa"
              name="specialistId"
              options={[...optionSpecialists]}
            />
            <InputField
              control={control}
              name="certificate"
              label="Chứng chỉ, bằng cấp"
              type="text"
              icon={<TbLockSquareRounded />}
            />
            <InputTextareaField
              control={control}
              name="experience"
              label="Kinh nghiệm"
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

        <Button color={"primary"} isLoading={isSubmitting} type="submit">
          {obEditStaff?.id ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
