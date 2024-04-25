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
import { Input, Link, Radio, RadioGroup } from "@nextui-org/react";
export interface RegisterProps {
  handleRegister: (data: Partial<User>) => Promise<boolean>;
  cancelModal: () => void;
  loading?: boolean;
  handleClickLogin: (key: string) => void;
  cancelText?: string;
  okText?: string;

  obUserEdit?: User | null;
}

export function Register({
  handleRegister,
  cancelModal,
  cancelText,
  okText,
  loading,
  handleClickLogin,
  obUserEdit,
}: RegisterProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitted, isSubmitting, isValid, errors },
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
        <div className="text-[#0f2f64]  font-bold  my-3 mb-4">
          Tham gia hệ thống đặt lịch khám ngay bây giờ!
        </div>
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <Input
            size="lg"
            color={errors.fullName?.message ? "danger" : "default"}
            variant={"underlined"}
            errorMessage={errors?.fullName?.message || ""}
            classNames={{
              errorMessage: "text-left text-base",
              label: "text-base font-bold mb-2",
            }}
            label="Họ, tên của bạn"
            {...register("fullName")}
          />

          <Input
            size="lg"
            color={errors.email?.message ? "danger" : "default"}
            variant={"underlined"}
            errorMessage={errors?.email?.message || ""}
            classNames={{
              errorMessage: "text-left text-base",
              label: "text-base font-bold mb-2",
            }}
            label="Email"
            {...register("email")}
          />
          <div className="flex items-center">
            <RadioGroup
              color={errors.gender?.message ? "danger" : "default"}
              size="sm"
              label="Giới tính:"
              errorMessage={errors?.gender?.message || ""}
              orientation="horizontal"
              className=""
              classNames={{
                base: "flex justify-start gap-2  flex-row flex-wrap",
                errorMessage: "text-left text-base",
                label: "text-base text-left font-bold mr-2",
              }}
              {...register("gender")}
            >
              {[
                {
                  label: "Nam",
                  value: "male",
                },
                {
                  label: "Nữ",
                  value: "female",
                },
              ].map((o) => (
                <Radio value={o.value} key={o.value}>
                  {o.label}
                </Radio>
              ))}
            </RadioGroup>
          </div>
          <Input
            size="lg"
            color={errors.email?.message ? "danger" : "default"}
            variant={"underlined"}
            errorMessage={errors?.email?.message || ""}
            classNames={{
              errorMessage: "text-left text-base",
              label: "text-base font-bold mb-2",
            }}
            label="Số điện thoại"
            {...register("phone")}
          />

          <Input
            size="lg"
            color={errors.email?.message ? "danger" : "default"}
            variant={"underlined"}
            errorMessage={errors?.email?.message || ""}
            classNames={{
              errorMessage: "text-left text-base",
              label: "text-base font-bold mb-2",
            }}
            label="Mật khẩu"
            {...register("password")}
          />
          <Input
            size="lg"
            color={errors.email?.message ? "danger" : "default"}
            variant={"underlined"}
            errorMessage={errors?.email?.message || ""}
            classNames={{
              errorMessage: "text-left text-base",
              label: "text-base font-bold mb-2",
            }}
            label="Nhập lại mật khẩu"
            {...register("rePassword")}
          />

          <div className="col-span-2">
            <Input
              size="lg"
              color={errors.email?.message ? "danger" : "default"}
              variant={"underlined"}
              errorMessage={errors?.email?.message || ""}
              classNames={{
                errorMessage: "text-left text-base",
                label: "text-base font-bold mb-2",
              }}
              label="Địa chỉ"
              {...register("address")}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 mt-4 text-left">
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
        <p className="text-left text-small">
          Bạn đã có tài khoản?{" "}
          <Link size="sm" onPress={() => handleClickLogin("login")}>
            Đăng nhập
          </Link>
        </p>
      </div>
      <div className="w-full flex mt-2 py-4">
        <Button
          color={"primary"}
          className="flex-1"
          isLoading={loading}
          isDisabled={loading}
          type="submit"
        >
          Đăng ký
        </Button>
      </div>
    </form>
  );
}
