import { schemaValidateLoginForm } from "@/schema-validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import { CheckBoxField, InputField } from "../form";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/button";
import { Input, Link } from "@nextui-org/react";

export interface LoginFormProps {
  handleLogin: (data: any) => Promise<boolean>;
  cancelModal: (data: any) => void;
  loading?: boolean;
  handleClickRegister: (key: string) => void;
}

export function LoginForm({
  handleLogin,
  cancelModal,
  loading,
  handleClickRegister,
}: LoginFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schemaValidateLoginForm),
  });

  async function handleLoginSubmit({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const isOk = await handleLogin({ email, password });
    if (isOk) {
      control._reset();
    }
  }

  function er(data: any) {
    console.log(data);
  }
  return (
    <div>
      <div className="py-10 mb-1">
        <h3 className="text-[#0f2f64] text-[40px] font-bold mb-0">
          Chào mừng bạn trở lại
        </h3>
        <div className="mt-3">
          Vui lòng nhập thông tin chi tiết của bạn bên dưới để tiếp tục
        </div>
      </div>
      <form
        onSubmit={handleSubmit(handleLoginSubmit, er)}
        className="flex flex-col gap-6 "
      >
        <Input
          type="email"
          size="lg"
          color={errors.email?.message ? "danger" : "default"}
          variant={"underlined"}
          label="Email"
          errorMessage={errors?.email?.message || ""}
          classNames={{
            errorMessage: "text-left text-base",
            label: "text-base font-bold mb-2",
          }}
          {...register("email")}
        />
        <Input
          type="password"
          size="lg"
          color={errors.password?.message ? "danger" : "default"}
          variant={"underlined"}
          errorMessage={errors?.password?.message || ""}
          classNames={{
            errorMessage: "text-left text-base",
            label: "text-base font-bold mb-2",
          }}
          label="Mật khẩu"
          {...register("password")}
        />

        <p className="text-center text-small">
          Bạn chưa tạo tài khoản?{" "}
          <Link size="sm" onPress={() => handleClickRegister("sign-up")}>
            Đăng ký
          </Link>
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            fullWidth
            color="primary"
            type="submit"
            isLoading={loading}
            isDisabled={loading}
          >
            Đăng nhập
          </Button>
        </div>
      </form>
    </div>
  );
}
