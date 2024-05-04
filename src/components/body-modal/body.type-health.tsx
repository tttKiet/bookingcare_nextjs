import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "../form";
import { TypeHealthFacility } from "@/models";
import { useEffect } from "react";
import { Button } from "@nextui-org/button";
const schemaTypeHealth = yup.object().shape({
  name: yup.string().required("Bạn chưa điền tên loại bệnh viện."),
});
export interface BodyTypeHealthProps {
  handleSubmitForm: ({
    name,
    id,
  }: {
    name: string;
    id?: string;
  }) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  typeHealthEdit: TypeHealthFacility;
}

export function BodyTypeHealth({
  handleSubmitForm,
  clickCancel,
  loading = false,
  typeHealthEdit,
}: BodyTypeHealthProps) {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: (typeHealthEdit?.id && typeHealthEdit.name) || "",
    },
    resolver: yupResolver(schemaTypeHealth),
  });
  useEffect(() => {
    reset({ name: typeHealthEdit?.name || "" });
  }, [typeHealthEdit?.name, reset]);

  async function handleSubmitLocal({ name }: { name: string }) {
    const isOk = await handleSubmitForm({ name, id: typeHealthEdit?.id || "" });
    if (isOk) {
      control._reset();
    }
  }
  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <InputField
        control={control}
        label="Tên loại"
        name="name"
        placeholder="Nhập tên loại bệnh viện"
      />
      <div className="flex items-center gap-2 justify-end mt-2 pt-[20px] mb-4">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button
          color={isValid ? "primary" : "default"}
          disabled={!isValid}
          isLoading={isSubmitting}
          type="submit"
        >
          {typeHealthEdit?.id ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
