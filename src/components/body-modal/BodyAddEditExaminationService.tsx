import { Cedicine, ExaminationService } from "@/models";
import {
  schemaCedicineBody,
  schemaExaminationServiceBody,
} from "@/schema-validate";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Space } from "antd";
import { useForm } from "react-hook-form";
import { VscSymbolNamespace } from "react-icons/vsc";
import { InputField, InputTextareaField } from "../form";

import { useEffect } from "react";
import { AiOutlinePhone } from "react-icons/ai";
import { CgRename } from "react-icons/cg";
import { CiBadgeDollar } from "react-icons/ci";

export interface BodyAddEditExaminationServiceProps {
  handleSubmitForm: (data: Partial<ExaminationService>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEdit: Partial<ExaminationService> | null;
}

export function BodyAddEditExaminationService({
  clickCancel,
  handleSubmitForm,
  loading,
  obEdit,
}: BodyAddEditExaminationServiceProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: yupResolver(schemaExaminationServiceBody),
  });

  useEffect(() => {
    reset({
      name: obEdit?.name || "",
      description: obEdit?.description || "",
    });
  }, [obEdit?.id, reset]);

  async function handleSubmitLocal({
    name,
    description,
  }: Partial<ExaminationService>) {
    const isOk = await handleSubmitForm({
      id: obEdit?.id || undefined,
      name,
      description,
    });
    if (isOk) {
      control._resetDefaultValues();
      clickCancel();
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <div className="grid md:grid-cols-1 gap-3 ">
        <InputField
          control={control}
          label="Tên thuốc"
          name="name"
          placeholder="Nhập tên dịch vụ"
          icon={<CgRename />}
        />
        <InputTextareaField
          control={control}
          label="Mô tả"
          name="description"
          icon={<CiBadgeDollar />}
          placeholder="Nhập mô tả cho dịch vụ"
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
            {obEdit?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
