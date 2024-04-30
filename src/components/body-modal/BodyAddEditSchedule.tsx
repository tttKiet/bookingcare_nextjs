"use client";
import { Code, Patient, Working } from "@/models";
import { AnimatePresence, motion } from "framer-motion";

import {
  API_ACCOUNT_STAFF_DOCTOR_WORKING,
  API_CODE,
} from "@/api-services/constant-api";
import { ResDataPaginations } from "@/types";
import { CalendarDate, parseDate } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import debounce from "lodash.debounce";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { SelectControl } from "../form/SelectControl";
import { DatePicker, DateRangePicker } from "@nextui-org/date-picker";
import { Calendar } from "@nextui-org/calendar";
import { InputNextDateField } from "../form/InputNextDateField";
import { InputField } from "../form";
import { Chip, Divider } from "@nextui-org/react";
import { sortTimeSlots, sortTimeSlotsCode } from "@/untils/common";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaScheduleBody } from "@/schema-validate";

export interface AddressCodeOption {
  label: string;
  value: string;
}

export interface BodyAddEditScheduleProps {
  handleSubmitForm: (data: Partial<Patient>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEdit?: Partial<Patient> | undefined;
}

export function BodyAddEditSchedule({
  clickCancel,
  handleSubmitForm,
  loading,
  obEdit,
}: BodyAddEditScheduleProps) {
  // state
  const [optionTimeCode, setOptionTimeCode] = useState<"all" | "custom">("all");
  const [optionUnit, setOptionUnit] = useState<"date" | "week" | "month">(
    "date"
  );
  const [timeCodeArrays, setTimeCodeArrays] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      workingId: "",
      unit: "date",
      optionTimeCode: "all",
      maxNumber: 1,
      quantity: 1,
    },
    resolver: yupResolver(schemaScheduleBody),
  });

  const [searchDoctorName, setSearchDoctorName] = useState<string>("");

  // doctor
  const { data: doctors } = useSWR<ResDataPaginations<Working>>(
    `${API_ACCOUNT_STAFF_DOCTOR_WORKING}?doctorName=${searchDoctorName}`,
    {
      revalidateOnMount: true,
    }
  );

  // time code
  const { data: allTimeCodes } = useSWR<ResDataPaginations<Code>>(
    `${API_CODE}/time`,
    {
      revalidateOnMount: true,
    }
  );

  //memo
  const optionDoctors = useMemo(() => {
    return doctors?.rows?.map((d: Working) => ({
      label: d?.Staff?.fullName,
      value: d?.id,
      description: d?.Staff?.email,
    }));
  }, [doctors]);

  const optionUnits = useMemo(() => {
    return [
      {
        label: "Ngày",
        value: "date",
        desciption: "Tạo lịch theo ngày",
      },
      {
        label: "Tuần",
        value: "week",
        desciption: "Tạo lịch theo tuần",
      },
      {
        label: "Tháng",
        value: "month",
        desciption: "Tạo lịch theo tháng",
      },
    ];
  }, []);

  async function handleSubmitLocal(data: any) {
    const isOk = await handleSubmitForm({
      id: obEdit?.id || undefined,
      ...data,
    });
    if (isOk) {
      control._resetDefaultValues();
      clickCancel();
    }
  }

  const headingClass = "text-black font-bold";
  //function

  function onSearchNameDoctor(value: string) {
    setSearchDoctorName(value);
  }

  function onChangeTimeCode(t: string) {
    setTimeCodeArrays((arr) => {
      const index = arr.indexOf(t);
      let rel = [];
      if (index !== -1) {
        const newArr = [...arr];
        newArr.splice(index, 1);
        rel = newArr;
      } else {
        rel = [...arr, t];
      }
      setValue("timeCodeArray", rel);
      return rel;
    });
  }
  function err(data: any) {
    console.log("data", data);
  }
  return (
    <form onSubmit={handleSubmit(handleSubmitLocal, err)} className="">
      <div className="overflow-y-auto max-h-[500px] px-2 pr-4 mr-[-16px]">
        <div className="grid md:grid-cols-12 gap-6 sm:grid-cols-1">
          <div className="col-span-12">
            <h3 className={`mb-4 ${headingClass}`}>Bác sĩ tạo lịch</h3>
            <div className="grid md:grid-cols-12  gap-6">
              <div className="col-span-12">
                <SelectControl
                  variant="bordered"
                  data={optionDoctors || []}
                  handleSearchSelect={debounce(onSearchNameDoctor)}
                  labelPlacement="outside"
                  control={control}
                  name="workingId"
                  placeholder="Tìm kiếm tên bác sĩ..."
                  label="Chọn bác sĩ"
                  isRequired
                  allowClear={false}
                />
              </div>
            </div>
          </div>

          <Divider className="my-4 col-span-12" />
          <div className="col-span-12 ">
            <h3 className={`mb-4 ${headingClass}`}>Khoảng các ngày tạo</h3>

            <div className="grid md:grid-cols-12 grid-cols-1  gap-6">
              <div className="col-span-12">
                <SelectControl
                  onChangeParent={(e) => setOptionUnit(e as any)}
                  labelPlacement="outside"
                  variant="bordered"
                  data={optionUnits || []}
                  control={control}
                  name="unit"
                  placeholder="Chọn đơn vị"
                  label="Tạo lịch theo"
                  isRequired
                  allowClear={false}
                />
              </div>

              {optionUnit == "date" && (
                <>
                  <div className="col-span-6">
                    <input type="text" className="w-0 h-0 absolute z-[-1]" />
                    <InputNextDateField
                      labelPlacement="outside"
                      variant="bordered"
                      control={control}
                      label={"Ngày bắt đầu lịch"}
                      name="startDate"
                    />
                  </div>
                  <div className="col-span-6">
                    <InputNextDateField
                      labelPlacement="outside"
                      variant="bordered"
                      label={"Ngày kết thúc lịch"}
                      control={control}
                      name="endDate"
                    />
                  </div>
                </>
              )}
              {optionUnit !== "date" && (
                <>
                  <div className="col-span-6">
                    <input type="text" className="w-0 h-0 absolute z-[-1]" />
                    <InputNextDateField
                      labelPlacement="outside"
                      variant="bordered"
                      control={control}
                      label={"Ngày bắt đầu lịch"}
                      name="startDate"
                    />
                  </div>
                  <div className="col-span-6">
                    <InputField
                      type="number"
                      labelPlacement="outside"
                      variant="bordered"
                      label={
                        <span className="text-sm">
                          {optionUnit == "week" ? "Số tuần" : "Số tháng"}
                        </span>
                      }
                      control={control}
                      name="quantity"
                      placeholder="vd: 2"
                      isRequired
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <Divider className="my-4 col-span-12" />

          <div className="col-span-12 ">
            <h3 className={`mb-4 ${headingClass}`}>Khung giờ và số lượng </h3>

            <div className="grid md:grid-cols-12 grid-cols-1  gap-6">
              <div className="col-span-12">
                <SelectControl
                  onChangeParent={(e) =>
                    setOptionTimeCode(e as "all" | "custom")
                  }
                  endContent={
                    <Chip
                      color="secondary"
                      size="md"
                      variant="light"
                      radius="sm"
                    >
                      {optionTimeCode == "all"
                        ? allTimeCodes?.rows.length
                        : timeCodeArrays.length}{" "}
                      khung giờ
                    </Chip>
                  }
                  variant="bordered"
                  labelPlacement="outside"
                  data={[
                    {
                      label: "Tất cả khung giờ",
                      value: "all",
                    },
                    {
                      label: "Chọn cụ thể",
                      value: "custom",
                    },
                  ]}
                  control={control}
                  name="optionTimeCode"
                  placeholder="Khung giờ"
                  label={<div> Khung giờ khám</div>}
                  isRequired={true}
                  allowClear={false}
                />

                {optionTimeCode == "custom" && (
                  <div className="my-6">
                    <div className="">
                      <div className=" mt-8">
                        <div className="flex items-start gap-2 ">
                          <div className="flex-shrink-0 whitespace-nowrap text-right ml-[1px]">
                            <h2
                              className="
                        gap-2  font-medium text-base text-left w-[80px]"
                            >
                              Buổi sáng
                            </h2>
                          </div>
                          <Divider
                            className="h-14 mx-5"
                            orientation="vertical"
                          />
                          <ul className="flex items-center flex-wrap gap-2 ">
                            {sortTimeSlotsCode(allTimeCodes?.rows).Morning.map(
                              (sch, index) => (
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  key={sch.value}
                                  transition={{
                                    delay: 0.2,
                                  }}
                                  exit={{ opacity: 0, x: 20 }}
                                >
                                  <Chip
                                    size="md"
                                    color="primary"
                                    radius="sm"
                                    variant={
                                      timeCodeArrays.includes(sch.key)
                                        ? "solid"
                                        : "flat"
                                    }
                                    onClick={() => {
                                      onChangeTimeCode(sch.key);
                                    }}
                                    className={`cursor-pointer hover:opacity-90 
                              hover:bg-primary-400 transition-all 
                                    ${timeCodeArrays.includes(sch.key) && ""}
                                `}
                                  >
                                    {sch.value}
                                  </Chip>
                                </motion.div>
                              )
                            )}
                          </ul>
                        </div>
                        <div className="flex items-start gap-2 mt-8">
                          <div className="flex-shrink-0 whitespace-nowrap text-right ml-[1px]">
                            <h2
                              className="
                        gap-2  font-medium text-base  w-[80px] text-left"
                            >
                              Buổi Chiều
                            </h2>
                          </div>
                          <Divider
                            className="h-14 mx-5"
                            orientation="vertical"
                          />
                          <ul className="flex items-center flex-wrap gap-2 ">
                            {sortTimeSlotsCode(
                              allTimeCodes?.rows || []
                            ).Afternoon.map((sch, index) => (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                key={sch.value}
                                transition={{
                                  delay: 0.3,
                                }}
                                exit={{ opacity: 0, x: 20 }}
                              >
                                <Chip
                                  size="md"
                                  color="primary"
                                  radius="sm"
                                  variant={
                                    timeCodeArrays.includes(sch.key)
                                      ? "solid"
                                      : "flat"
                                  }
                                  onClick={() => {
                                    onChangeTimeCode(sch.key);
                                  }}
                                  className={`cursor-pointer hover:opacity-90 
                                  hover:bg-primary-200 transition-all 
                                        ${
                                          timeCodeArrays.includes(sch.key) && ""
                                        }
                                    `}
                                >
                                  {sch.value}
                                </Chip>
                              </motion.div>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-danger-500 text-sm">
                  {errors?.timeCodeArray?.message}
                </p>
              </div>

              <div className="col-span-12 flex">
                <InputField
                  type="number"
                  labelPlacement="outside-left"
                  variant="bordered"
                  control={control}
                  name="maxNumber"
                  placeholder="vd: 2"
                  label="Số lượng bệnh nhân / khung giờ"
                  isRequired
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end mt-2 py-4">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button
          color="primary"
          // isDisabled={}
          isLoading={isSubmitting}
          type="submit"
        >
          {obEdit?.id ? "Tạo" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
