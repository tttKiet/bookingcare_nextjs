import { Code, Specialist } from "@/models";
import { schemaCodeBody, schemaSpecialistBody } from "@/schema-validate";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { VscSymbolNamespace } from "react-icons/vsc";
import { InputField, InputTextareaField, SelectFieldAddOption } from "../form";

import { AiOutlinePhone } from "react-icons/ai";
import { RxValue } from "react-icons/rx";
import { Button } from "@nextui-org/button";

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
    formState: { isSubmitting, defaultValues, isValid },
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
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button
          color={isValid ? "primary" : "default"}
          disabled={!isValid}
          isLoading={isSubmitting}
          type="submit"
        >
          Thêm mới mã
        </Button>
      </div>
    </form>
  );
}
