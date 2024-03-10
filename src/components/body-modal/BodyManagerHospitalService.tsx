import { ExaminationService, HospitalService } from "@/models";
import { schemaHospitalServiceBody } from "@/schema-validate";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputField, SelectField } from "../form";

import { API_ADMIN_EXAMINATION_SERVICE } from "@/api-services/constant-api";
import { ResDataPaginations } from "@/types";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CgRename } from "react-icons/cg";
import { CiBadgeDollar } from "react-icons/ci";
import useSWR from "swr";

export interface BodyManagerHospitalServiceProps {
  handleSubmitForm: (data: Partial<HospitalService>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEdit: Partial<HospitalService> | null;
}

export function BodyManagerHospitalService({
  clickCancel,
  handleSubmitForm,
  loading,
  obEdit,
}: BodyManagerHospitalServiceProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      examinationServiceId: "",
      price: 0,
    },
    resolver: yupResolver(schemaHospitalServiceBody),
  });

  const [isAcctiveToggle, setIsAcctiveToggle] = useState<boolean>(() =>
    obEdit === null ? true : !!obEdit.isAcctive
  );

  useEffect(() => {
    reset({
      examinationServiceId: obEdit?.examinationServiceId || "",
      price: obEdit?.price || 0,
    });
  }, [obEdit?.healthFacilityId, reset]);

  async function handleSubmitLocal({
    examinationServiceId,
    price,
  }: Partial<HospitalService>) {
    const isOk = await handleSubmitForm({
      isAcctive: isAcctiveToggle,
      examinationServiceId,
      price,
    });
    if (isOk) {
      control._resetDefaultValues();
      clickCancel();
    }
  }

  const [nameServiceSearch, setNameServiceSearch] = useState("");

  const {
    data: responseService,
    mutate: mutate,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<ExaminationService>>(
    `${API_ADMIN_EXAMINATION_SERVICE}?name=${nameServiceSearch}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  function onSearchSelectService(value: string) {
    setNameServiceSearch(value);
    mutate();
  }

  const optionDoctorsWorking =
    responseService?.rows?.map((t: ExaminationService) => ({
      value: t.id,
      label: (
        <div>
          <h3 className="text-sm text-gray-600 font-medium">{t.name}</h3>
          <span className="text-xs text-black font-normal flex items-center justify-between">
            <span>{t.description}</span>
          </span>
        </div>
      ),
    })) || [];

  function handleChangeToggle(isSelected: boolean) {
    setIsAcctiveToggle(isSelected);
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <div className="grid md:grid-cols-1 gap-3 sm:grid-cols-1">
        <SelectField
          width={"100%"}
          control={control}
          options={optionDoctorsWorking}
          label="Dịch vụ"
          name="examinationServiceId"
          placeholder="Chọn dịch vụ"
          icon={<CgRename />}
          debounceSeconds={500}
          onSearchSelect={onSearchSelectService}
        />
        <InputField
          type="number"
          width={"200px"}
          control={control}
          label="Đơn giá"
          name="price"
          icon={<CiBadgeDollar />}
          placeholder="Nhập đơn giá của dịch vụ"
        />
        <Switch
          className="mt-2"
          defaultSelected={isAcctiveToggle}
          onValueChange={handleChangeToggle}
        >
          Hoạt động
        </Switch>
      </div>
      <div className="flex items-center gap-2 justify-end mt-2 py-4">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button color="primary" isLoading={isSubmitting} type="submit">
          {obEdit?.healthFacilityId ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
