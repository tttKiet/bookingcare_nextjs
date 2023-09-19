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
import { Button, Space } from "antd";
import React, { useEffect, useMemo } from "react";
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
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, isSubmitting },
    setValue,
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
      roleId: "",
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
      roleId: obEditStaff?.roleId || "",
      specialistId: obEditStaff?.specialistId || "",
    });
  }, [obEditStaff]);

  const { data: role } = useSWR<Role[]>(API_ROLE);
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

  const roleDoctor: Role | undefined = useMemo(
    () => role?.find((roleDoctor) => roleDoctor.keyType === "doctor"),
    [role]
  );

  useEffect(() => {
    setValue("roleId", roleDoctor?.id || "");
  }, [roleDoctor]);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitLocal)}
      className="flex flex-col gap-2 pt-4"
    >
      <div>
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <InputField
            control={control}
            name="fullName"
            label="Họ, tên bác sỉ"
            icon={<MdOutlineMailOutline />}
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
            name="address"
            label="Địa chỉ"
            type="text"
            icon={<TbLockSquareRounded />}
          />

          <SelectField
            control={control}
            icon={<GoRepoForked />}
            label="Học vị"
            name="academicDegreeId"
            options={[
              { value: "", label: "Chọn học vị" },
              ...optionAcademicDegree,
            ]}
          />
          <SelectField
            control={control}
            icon={<GoRepoForked />}
            width={180}
            label="Chuyên khoa"
            name="specialistId"
            options={[
              { value: "", label: "Chọn chuyên khoa" },
              ...optionSpecialists,
            ]}
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
            {obEditStaff?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
