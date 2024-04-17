import { Cedicine } from "@/models";
import { schemaCedicineBody } from "@/schema-validate";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputField } from "../form";

import { Button } from "@nextui-org/button";
import { useEffect } from "react";
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
    formState: { isSubmitting, isValid },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      desc: "",
    },
    resolver: yupResolver(schemaCedicineBody),
  });

  useEffect(() => {
    reset({
      name: obEditCedicine?.name || "",
      desc: obEditCedicine?.desc || "",
    });
  }, [obEditCedicine?.id, reset]);

  async function handleSubmitLocal({ name, desc }: Partial<Cedicine>) {
    const isOk = await handleSubmitForm({
      id: obEditCedicine?.id || undefined,
      name,
      desc,
    });
    if (isOk) {
      reset({
        desc: "",
        name: "",
      });
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
        <InputField
          control={control}
          label="Mô tả"
          name="desc"
          icon={<CiBadgeDollar />}
          placeholder="Nhập mô tả..."
        />
      </div>
      <div className="flex items-center gap-2 justify-end mt-2 pt-[20px]">
        {/* <Button type="default" size="middle" onClick={clickCancel}>
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
        </Space> */}

        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button
          color={isValid ? "primary" : "default"}
          disabled={!isValid}
          isLoading={isSubmitting}
          type="submit"
        >
          {obEditCedicine?.id ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
