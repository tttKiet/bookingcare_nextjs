// import { schemaValidateRegister } from "@/schema-validate";
import { schemaValidateRegister } from "@/schema-validate";
import { RegisterFormInterface } from "@/types/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Space } from "antd";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import { CheckBoxField, InputField, RadioGroupField } from "../form";
export interface RegisterFormProps {
  handleRegister: (data: RegisterFormInterface) => Promise<boolean>;
  cancelModal: () => void;
  loading?: boolean;
  handleClickLogin: () => void;
  cancelText?: string;
  okText?: string;
}

export function RegisterForm({
  handleRegister,
  cancelModal,
  cancelText,
  okText,
  loading,
  handleClickLogin,
}: RegisterFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      rePassword: "",
      address: "",
      fullName: "",
      gender: "",
      checkTerm: false,
    },
    resolver: yupResolver(schemaValidateRegister),
  });

  async function handleRegisterSubmit(data: any) {
    const isOk = await handleRegister(data);
    if (isOk) {
      control._reset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleRegisterSubmit)}
      className="flex flex-col gap-2 pt-4"
    >
      <div>
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <InputField
            control={control}
            name="fullName"
            label="Họ, tên của bạn"
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
        <div className="grid grid-cols-1 mt-4">
          <CheckBoxField
            control={control}
            name="checkTerm"
            label={
              <span>
                Bằng cách đăng ký, bạn đồng ý với các
                <Link href="#" className="text-blue-500 px-1">
                  điều khoản
                </Link>
                của chúng tôi.
              </span>
            }
          />
        </div>
      </div>

      <div className="flex items-center ">
        <h4>Bạn đã có tài khoản?</h4>
        <button
          className="text-blue-600 ml-2"
          onClick={handleClickLogin}
          type="button"
        >
          Đăng nhập ngay.
        </button>
      </div>

      <div className="flex items-center gap-2 justify-end mt-2  border-t pt-[20px]">
        <Button type="text" size="middle" onClick={cancelModal}>
          {cancelText ? cancelText : "Hủy"}
        </Button>
        <Space wrap>
          <Button
            type="primary"
            size="middle"
            loading={isSubmitting}
            htmlType="submit"
          >
            {okText ? okText : "Đăng ký"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
