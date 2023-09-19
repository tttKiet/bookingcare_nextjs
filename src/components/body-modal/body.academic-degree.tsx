import * as React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "../form";
import { Button, Space } from "antd";
import { AcademicDegree } from "@/models";
export const schemaAcademicDegree = yup.object().shape({
  name: yup.string().required("Bạn chưa điền tên học vị."),
});
export interface BodyModalAcademicDegreeProps {
  handleSubmitForm: ({
    name,
    id,
  }: {
    name: string;
    id?: string;
  }) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obAcademicDegreeEdit: Partial<AcademicDegree> | null;
}

export function BodyModalAcademicDegree({
  handleSubmitForm,
  clickCancel,
  loading = false,
  obAcademicDegreeEdit,
}: BodyModalAcademicDegreeProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(schemaAcademicDegree),
  });
  React.useEffect(() => {
    reset({ name: obAcademicDegreeEdit?.name || "" });
  }, [obAcademicDegreeEdit?.name, reset]);

  async function handleSubmitLocal({ name }: { name: string }) {
    const isOk = await handleSubmitForm({ name, id: obAcademicDegreeEdit?.id });
    if (isOk) {
      control._reset({
        name: "",
      });
      clickCancel();
    }
  }
  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <InputField
        control={control}
        label="Tên học vị"
        name="name"
        placeholder="Nhập tên học vị"
      />
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
            {obAcademicDegreeEdit?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
