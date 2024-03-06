import { Cedicine } from "@/models";
import { schemaCedicineBody } from "@/schema-validate";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Space } from "antd";
import { useForm } from "react-hook-form";
import { VscSymbolNamespace } from "react-icons/vsc";
import { InputField } from "../form";

import { useEffect } from "react";
import { AiOutlinePhone } from "react-icons/ai";
import { CgRename } from "react-icons/cg";
import { CiBadgeDollar } from "react-icons/ci";

export interface BodyAddEditCedicineProps {
  handleSubmitForm: (data: Partial<Cedicine>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEditCedicine: Partial<Cedicine> | null;
}

export function BodyAddEditCedicine({
  clickCancel,
  handleSubmitForm,
  loading,
  obEditCedicine,
}: BodyAddEditCedicineProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      price: 1000,
    },
    resolver: yupResolver(schemaCedicineBody),
  });

  useEffect(() => {
    console.log("obEditCedicine", obEditCedicine);

    reset({
      name: obEditCedicine?.name || "",
      price: obEditCedicine?.price || 0,
    });
  }, [obEditCedicine?.id, reset]);

  async function handleSubmitLocal({ name, price }: Partial<Cedicine>) {
    const isOk = await handleSubmitForm({
      id: obEditCedicine?.id || undefined,
      name,
      price,
    });
    if (isOk) {
      control._resetDefaultValues();
      clickCancel();
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
        <InputField
          control={control}
          label="Tên thuốc"
          name="name"
          placeholder="Nhập tên thuốc"
          icon={<CgRename />}
        />
        <div className="">
          <InputField
            type="number"
            width={"200px"}
            control={control}
            label="Đơn giá"
            name="price"
            icon={<CiBadgeDollar />}
            placeholder="Nhập đơn giá của thuốc"
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
            {obEditCedicine?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
