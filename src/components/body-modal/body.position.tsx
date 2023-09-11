import * as React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "../form";
import { Button, Space } from "antd";
import { Position } from "@/models";
export const schemaPosition = yup.object().shape({
  name: yup.string().required("Bạn chưa điền tên vị trí, danh hiệu."),
});
export interface BodyModalPositionProps {
  handleSubmitForm: ({
    name,
    id,
  }: {
    name: string;
    id?: string;
  }) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obPositionEdit: Partial<Position> | null;
}

export function BodyModalPosition({
  handleSubmitForm,
  clickCancel,
  loading = false,
  obPositionEdit,
}: BodyModalPositionProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(schemaPosition),
  });
  React.useEffect(() => {
    reset({ name: obPositionEdit?.name || "" });
  }, [obPositionEdit?.name, reset]);

  async function handleSubmitLocal({ name }: { name: string }) {
    const isOk = await handleSubmitForm({ name, id: obPositionEdit?.id });
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
        label="Tên vị trí, danh hiệu"
        name="name"
        placeholder="Nhập tên vị trí, danh hiệu"
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
            {obPositionEdit?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
