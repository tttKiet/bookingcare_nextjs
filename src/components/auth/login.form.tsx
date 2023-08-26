import { schemaValidateLoginForm } from "@/schema-validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Space } from "antd";
import { useForm } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import { CheckBoxField, InputField } from "../form";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState } from "react";
import Link from "next/link";
export interface LoginFormProps {
  handleLogin: (data: any) => Promise<boolean>;
  cancelModal: (data: any) => void;
  loading?: boolean;
  handleClickRegister: () => void;
}

export function LoginForm({
  handleLogin,
  cancelModal,
  loading,
  handleClickRegister,
}: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    resolver: yupResolver(schemaValidateLoginForm),
  });

  async function handleLoginSubmit(data: any) {
    const isOk = await handleLogin(data);
    if (isOk) {
      control._reset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleLoginSubmit)}
      className="flex flex-col gap-2 pt-4"
    >
      <InputField
        control={control}
        name="email"
        label="Email"
        icon={<MdOutlineMailOutline />}
      />
      <InputField
        control={control}
        name="password"
        label="Password"
        type="password"
        icon={<TbLockSquareRounded />}
      />

      <div className="flex items-center justify-between">
        <CheckBoxField
          control={control}
          name="rememberMe"
          label="Nhớ đăng nhập"
          className="text-sm mt-2"
        />
        <Link href={"/user/missing-password"} className="text-blue-600">
          Quên mật khẩu?
        </Link>
      </div>

      <h3 className="flex justify-center font-medium py-2">Hoặc</h3>

      <Button
        danger
        onClick={handleClickRegister}
        className="border border-spacing-2  font-medium"
      >
        Đăng ký
      </Button>

      <div className="flex items-center gap-2 justify-end mt-2  border-t pt-[20px]">
        <Button type="text" size="middle" onClick={cancelModal}>
          Hủy
        </Button>
        <Space wrap>
          <Button
            type="primary"
            size="middle"
            loading={loading}
            // onClick={() => true}
            htmlType="submit"
          >
            Đăng nhập!
          </Button>
        </Space>
      </div>
    </form>
  );
}
