import { ExaminationService, HospitalService } from "@/models";
import { schemaHospitalServiceBody } from "@/schema-validate";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputField, SelectSearchField } from "../form";

import { API_ADMIN_EXAMINATION_SERVICE } from "@/api-services/constant-api";
import { ResDataPaginations } from "@/types";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CgRename } from "react-icons/cg";
import { CiBadgeDollar } from "react-icons/ci";
import useSWR from "swr";
import { SelectControl } from "../form/SelectControl";

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
  } = useForm({
    defaultValues: {
      examinationServiceId: "",
      price: undefined,
    },
    resolver: yupResolver(schemaHospitalServiceBody),
  });

  const [isAcctiveToggle, setIsAcctiveToggle] = useState<boolean>(() =>
    obEdit === null ? true : !!obEdit.isAcctive
  );

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
      reset({ examinationServiceId: undefined, price: undefined });
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
    `${API_ADMIN_EXAMINATION_SERVICE}?name=${nameServiceSearch}&offset=0&limit=30`,
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
      label: t.name,
    })) || [];

  function handleChangeToggle(isSelected: boolean) {
    setIsAcctiveToggle(isSelected);
  }

  useEffect(() => {
    reset({
      examinationServiceId: obEdit?.examinationServiceId || "",
      price: obEdit?.price || undefined,
    });
  }, [obEdit, obEdit?.healthFacilityId, reset]);

  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <div className="grid md:grid-cols-1 gap-3 sm:grid-cols-1">
        <SelectControl
          control={control}
          data={optionDoctorsWorking}
          label="Dịch vụ"
          name="examinationServiceId"
          placeholder="Chọn dịch vụ"
          debounceSeconds={500}
          handleSearchSelect={onSearchSelectService}
        />
        <InputField
          type="number"
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
