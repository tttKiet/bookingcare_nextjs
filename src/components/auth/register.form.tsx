// import { schemaValidateRegister } from "@/schema-validate";
import { schemaValidateRegister } from "@/schema-validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import {
  CheckBoxField,
  InputField,
  InputTextareaField,
  RadioGroupField,
} from "../form";
import { useAuth } from "@/hooks";
import { useEffect } from "react";
import { User } from "@/models";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/react";
export interface RegisterFormProps {
  handleRegister: (data: Partial<User>) => Promise<boolean>;
  cancelModal: () => void;
  loading?: boolean;
  handleClickLogin: (key: string) => void;
  cancelText?: string;
  okText?: string;

  obUserEdit?: User | null;
}

export function RegisterForm({
  handleRegister,
  cancelModal,
  cancelText,
  okText,
  loading,
  handleClickLogin,
  obUserEdit,
}: RegisterFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, isSubmitting, isValid },
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
      checkTerm: false,
    },
    resolver: yupResolver(schemaValidateRegister),
  });

  const { profile } = useAuth();

  async function handleRegisterSubmit({
    address,
    email,
    id,
    gender,
    phone,
    fullName,
    password,
  }: Partial<User>) {
    const isOk = await handleRegister({
      address,
      email,
      id: obUserEdit?.id,
      gender,
      phone,
      fullName,
      password,
    });
    if (isOk && profile?.Role?.keyType === "admin") {
      cancelModal();
      reset({
        email: "",
        password: "",
        phone: "",
        rePassword: "",
        address: "",
        fullName: "",
        gender: "",
        checkTerm: false,
      });
    }
  }

  useEffect(() => {
    if (profile?.Role?.keyType === "admin") {
      setValue("checkTerm", true);
    }
  }, [profile?.Role?.keyType, profile]);

  useEffect(() => {
    if (obUserEdit) {
      reset({
        ...obUserEdit,
        rePassword: obUserEdit.password,
      });
    } else {
      reset({
        email: "",
        password: "",
        phone: "",
        rePassword: "",
        address: "",
        fullName: "",
        gender: "",
      });
    }
  }, [obUserEdit]);

  return (
    <form
      onSubmit={handleSubmit(handleRegisterSubmit)}
      className="flex flex-col gap-2 "
    >
      <div className="">
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <InputField
            control={control}
            name="fullName"
            label={
              profile?.Role?.keyType === "admin"
                ? "Họ, tên tài khoản"
                : "Họ, tên của bạn"
            }
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
      {profile?.Role?.keyType !== "admin" && handleClickLogin && (
        <>
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
          <div className=" ">
            <p className="text-center text-small">
              Bạn đã có tài khoản?{" "}
              <Link size="sm" onPress={() => handleClickLogin("login")}>
                Đăng nhập
              </Link>
            </p>
          </div>
        </>
      )}

      <>
        {profile?.Role?.keyType !== "admin" ? (
          <div className="w-full flex mt-2 py-4">
            <Button
              color={"primary"}
              className="flex-1"
              isLoading={loading}
              isDisabled={loading}
              type="submit"
            >
              {okText ? (
                okText
              ) : (
                <>{obUserEdit ? "Lưu thay đổi" : "Tạo tài khoản"}</>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-end mt-2 py-4">
            <Button color="danger" variant="light" onClick={cancelModal}>
              {cancelText ? cancelText : "Hủy"}
            </Button>

            <Button color={"primary"} isLoading={isSubmitting} type="submit">
              {okText ? (
                okText
              ) : (
                <>{obUserEdit ? "Lưu thay đổi" : "Tạo tài khoản"}</>
              )}
            </Button>
          </div>
        )}
      </>
    </form>
  );
}
