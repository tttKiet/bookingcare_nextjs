import * as React from "react";
import { InputField } from "../form/input-field";
import { useForm } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import { Button, Space } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaValidateLoginForm } from "@/schema-validate";
export interface LoginFormProps {
  handleLogin: (data: any) => Promise<boolean>;
  cancelModal: (data: any) => void;
  loading?: boolean;
}

export function LoginForm({
  handleLogin,
  cancelModal,
  loading,
}: LoginFormProps) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
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

      <div className="flex items-center gap-2 justify-end mt-2">
        <Button type="text" size="middle" onClick={cancelModal}>
          Cancel
        </Button>
        <Space wrap>
          <Button
            type="primary"
            size="middle"
            loading={loading}
            // onClick={() => true}
            htmlType="submit"
          >
            Log in!
          </Button>
        </Space>
      </div>
    </form>
  );
}
