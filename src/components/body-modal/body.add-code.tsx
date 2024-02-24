import { Code, Specialist } from "@/models";
import { schemaCodeBody, schemaSpecialistBody } from "@/schema-validate";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Space } from "antd";
import { useForm } from "react-hook-form";
import { VscSymbolNamespace } from "react-icons/vsc";
import { InputField, InputTextareaField, SelectFieldAddOption } from "../form";

import { AiOutlinePhone } from "react-icons/ai";
import { RxValue } from "react-icons/rx";

export interface BodyModalCodeProps {
  handleSubmitForm: (data: Code) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
}

export function BodyModalCode({
  clickCancel,
  handleSubmitForm,
  loading,
}: BodyModalCodeProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, defaultValues },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      key: "",
      value: "",
    },
    resolver: yupResolver(schemaCodeBody),
  });

  async function handleSubmitLocal({ name, key, value }: Code) {
    const isOk = await handleSubmitForm({
      name,
      key,
      value,
    });
    if (isOk) {
      control._reset({
        name: "",
        key: "",
        value: "",
      });
      clickCancel();
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
        <InputField
          control={control}
          label="Key"
          name="key"
          placeholder="Nhập key..."
          icon={<VscSymbolNamespace />}
        />
        <SelectFieldAddOption
          width={"100%"}
          control={control}
          label="Chọn tên"
          name="name"
          options={["Time", "Status"]} // Need to update call api
        />
        <div className="col-span-2">
          <InputField
            control={control}
            label="Giá trị"
            name="value"
            icon={<RxValue />}
            placeholder="Nhập giá trị cho key..."
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
            Thêm mới mã
          </Button>
        </Space>
      </div>
    </form>
  );
}
