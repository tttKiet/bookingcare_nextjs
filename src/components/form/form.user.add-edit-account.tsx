import { User } from "@/models";
import { schemaValidateRegister } from "@/schema-validate";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Space } from "antd";
import { useForm } from "react-hook-form";
import { InputField, RadioGroupField } from ".";

import { API_ROLE } from "@/api-services/constant-api";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import useSWR from "swr";
import { useEffect } from "react";

export interface FormBodyModalAccountUser {
  handleSubmitForm: (data: Partial<User>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEditAccount: Partial<User> | null;
}

export function FormBodyModalAccountUser({
  clickCancel,
  handleSubmitForm,
  loading,
  obEditAccount,
}: FormBodyModalAccountUser) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, defaultValues },
    reset,
    setValue,
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
    resolver: yupResolver(schemaValidateRegister),
  });

  const { data: roles, mutate: mutateRole } = useSWR(API_ROLE, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  useEffect(() => {
    reset({
      fullName: obEditAccount?.fullName || "",
    });
  }, [obEditAccount, reset]);

  async function handleSubmitLocal({ fullName }: Partial<User>) {
    const isOk = await handleSubmitForm({ fullName });
    if (isOk) {
      control._reset({
        fullName: "",
      });
      clickCancel();
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
        <InputField
          control={control}
          name="fullName"
          label="Họ, tên tài khoản"
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
            {obEditAccount?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
