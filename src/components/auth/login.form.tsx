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
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import toast from "react-hot-toast";

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

      <h3 className="relative  py-3">
        <div className="border border-b-0"></div>
        <span className="text-sm absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-2 bg-white">
          Hoặc
        </span>
      </h3>
      <div className="flex flex-col gap-1 ">
        <Button
          // type="primary"
          danger
          icon={<FcGoogle />}
          onClick={() => toast("Đang cập nhật!!!")}
          className="flex items-center justify-center gap-1"
          // className="bg-red-500 text-white border border-spacing-2 hover:bg-red-400 hover:text-white font-medium flex items-center justify-center gap-1"
        >
          Đăng nhập bằng Google
        </Button>
        <Button
          // type="primary"
          htmlType="button"
          ghost
          icon={<FaFacebookSquare />}
          onClick={() => toast("Đang cập nhật!!!")}
          className="ant-btn-primary-outline flex items-center justify-center gap-1"
        >
          Đăng nhập bằng Facebook
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <h3>Bạn chưa có tài khoản?</h3>
        <Button
          htmlType="button"
          type="dashed"
          onClick={handleClickRegister}
          className="border border-spacing-2  font-medium"
        >
          Đăng ký
        </Button>
      </div>

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
            Đăng nhập
          </Button>
        </Space>
      </div>
    </form>
  );
}
