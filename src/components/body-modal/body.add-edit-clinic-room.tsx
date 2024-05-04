"use client";

// import { schemaValidateRegister } from "@/schema-validate";
import { ClinicRoom } from "@/models";
import { schemaClinicRoomBody } from "@/schema-validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputField } from "../form";
import React from "react";
import { Button } from "@nextui-org/button";

export interface BodyModalClinicRoomProps {
  handleSubmitForm: (data: Partial<ClinicRoom>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEditClinicRoom?: ClinicRoom | null;
}
export function BodyModalClinicRoom({
  clickCancel,
  handleSubmitForm,
  loading,
  obEditClinicRoom,
}: BodyModalClinicRoomProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, isSubmitting, isValid },
    setValue,
    reset,
  } = useForm({
    // defaultValues: {
    //   roomNumber: 0,
    //   capacity: 1,
    // },
    resolver: yupResolver(schemaClinicRoomBody),
  });

  async function handleSubmitLocal({ roomNumber, capacity }: any) {
    const isOk = await handleSubmitForm({
      roomNumber,
      capacity,
    });
    if (isOk) {
      reset({});
      clickCancel();
    }
  }

  React.useEffect(() => {
    reset({
      roomNumber: obEditClinicRoom?.roomNumber,
      capacity: obEditClinicRoom?.capacity,
    });
  }, [obEditClinicRoom]);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitLocal)}
      className="flex flex-col gap-2 "
    >
      <div>
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <InputField
            control={control}
            placeholder="Vd: 101"
            label="Nhập số phòng"
            name="roomNumber"
            type="number"
          />
          <InputField
            control={control}
            placeholder="Vd: 3"
            label="Sức chứa"
            type="number"
            name="capacity"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end mt-2 pb-4 pt-[20px]">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button
          color={isValid ? "primary" : "default"}
          disabled={!isValid}
          isLoading={isSubmitting}
          type="submit"
        >
          {obEditClinicRoom?.roomNumber ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
