import { Specialist } from "@/models";
import { schemaSpecialistBody } from "@/schema-validate";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Space } from "antd";
import { useForm } from "react-hook-form";
import { VscSymbolNamespace } from "react-icons/vsc";
import { InputField, InputTextareaField } from "../form";

import { AiOutlinePhone } from "react-icons/ai";
import { useEffect } from "react";

export interface BodyModalSpecialistProps {
  handleSubmitForm: (data: Partial<Specialist>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEditSpecialist: Partial<Specialist> | null;
}

export function BodyModalSpecialist({
  clickCancel,
  handleSubmitForm,
  loading,
  obEditSpecialist,
}: BodyModalSpecialistProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, defaultValues },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      descriptionDisease: "",
      descriptionDoctor: "",
    },
    resolver: yupResolver(schemaSpecialistBody),
  });

  useEffect(() => {
    reset({
      name: obEditSpecialist?.name || "",
      descriptionDisease: obEditSpecialist?.descriptionDisease || "",
      descriptionDoctor: obEditSpecialist?.descriptionDoctor || "",
    });
  }, [obEditSpecialist, reset]);

  async function handleSubmitLocal({
    name,
    descriptionDisease,
    descriptionDoctor,
  }: Partial<Specialist>) {
    const isOk = await handleSubmitForm({
      id: obEditSpecialist?.id || undefined,
      name,
      descriptionDisease,
      descriptionDoctor,
    });
    if (isOk) {
      control._reset({
        name: "",
        descriptionDisease: "",
        descriptionDoctor: "",
      });
      clickCancel();
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
        <InputField
          control={control}
          label="Tên chuyên khoa"
          name="name"
          placeholder="Nhập tên chuyên khoa"
          icon={<VscSymbolNamespace />}
        />
        <div className="col-span-2">
          <InputTextareaField
            control={control}
            label="Mô tả căn bệnh"
            name="descriptionDisease"
            icon={<AiOutlinePhone />}
            placeholder="Nhập mô tả"
          />
        </div>
        <div className="col-span-2">
          <InputTextareaField
            control={control}
            label="Mô tả bác sỉ chửa bệnh"
            name="descriptionDoctor"
            icon={<AiOutlinePhone />}
            placeholder="Nhập mô tả..."
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
            {obEditSpecialist?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
