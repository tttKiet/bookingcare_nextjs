"use client";

import { motion } from "framer-motion";
import { parseDate, parseAbsoluteToLocal } from "@internationalized/date";
// import { schemaValidateRegister } from "@/schema-validate";
import { API_CODE } from "@/api-services/constant-api";
import {
  Code,
  HealthExaminationSchedule,
  HealthExaminationScheduleResAll,
} from "@/models";
import { schemaCodeScheduleHealth } from "@/schema-validate";
import { ResDataPaginations } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import useSWR from "swr";
import { InputField } from "../form";

import { sortTimeSlotsCode } from "@/untils/common";
import { Chip, Divider } from "@nextui-org/react";
import { AiOutlineClose } from "react-icons/ai";
import { InputNextDateField } from "../form/InputNextDateField";
import { CheckIcon } from "../icons/CheckIcon";
import { Button } from "@nextui-org/button";
import moment from "moment";
export interface ReqSchedule extends HealthExaminationSchedule {
  timeCodeArray: Array<string>;
}
export interface BodyModalScheduleProps {
  handleSubmitForm: (data: Partial<ReqSchedule>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEdit?: HealthExaminationScheduleResAll | null;
}

export function BodyModalSchedule({
  clickCancel,
  handleSubmitForm,
  loading,
  obEdit,
}: BodyModalScheduleProps) {
  const [timeCodeArrays, setTimeCodeArrays] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitted, isSubmitting, errors },
    setValue,
    reset,
    getValues,
    register,
  } = useForm({
    defaultValues: {
      maxNumber: 3,
      timeCodeArray: [],
    },
    resolver: yupResolver(schemaCodeScheduleHealth),
  });

  const { data: allTimeCodes } = useSWR<ResDataPaginations<Code>>(
    `${API_CODE}/time`,
    {
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (obEdit) {
      const timeCodes = obEdit?.schedule.map((row: any) => row.timeCode) || [];
      reset({
        date: parseDate(moment(obEdit.date).format("YYYY[-]MM[-]DD")),
        maxNumber: obEdit?.schedule?.[0]?.maxNumber || 1,
        timeCodeArray: timeCodes,
      });
      setTimeCodeArrays(timeCodes);
    }
  }, [obEdit]);

  async function handleSubmitLocal(data: Partial<ReqSchedule>) {
    const isOk = await handleSubmitForm({
      ...data,
      workingId: obEdit?.working?.id,
      date: new Date(data?.date as string),
    });
    if (isOk) {
      clickCancel();
    }
  }

  const onChangeCheckTimeCode = (checkedValues: any) => {
    setValue("timeCodeArray", checkedValues);
  };

  const headingClass = "text-black font-bold";
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
  return (
    <div>
      <form
        onSubmit={handleSubmit(handleSubmitLocal)}
        className="flex flex-col gap-2 "
      >
        <div className="grid md:grid-cols-12 gap-6 sm:grid-cols-1">
          <div className="col-span-12 grid grid-cols-1 gap-3">
            <h3 className={`mb-4 ${headingClass}`}>Bác sĩ tạo lịch</h3>

            <div className="grid md:grid-cols-12   gap-6">
              <div className=" col-span-6">
                <InputNextDateField
                  labelPlacement="outside"
                  variant="bordered"
                  control={control}
                  label={"Ngày khám"}
                  name="date"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className={`mb-4 ${headingClass}`}>Bệnh nhân</h3>

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

            <div className="flex flex-col">
              <h3 className={`mb-4 ${headingClass} flex items-center `}>
                Giờ khám{" "}
                <Chip radius="sm" variant="light" color="secondary">
                  ({timeCodeArrays.length} khung giờ)
                </Chip>
              </h3>

              <div className="">
                <div className="">
                  <div className=" mt-4">
                    <div className="flex items-start gap-2 ">
                      <div className="flex-shrink-0 whitespace-nowrap text-right ml-[1px]">
                        <h2
                          className="
                        gap-2  font-medium text-base text-left w-[80px]"
                        >
                          Buổi sáng
                        </h2>
                      </div>
                      <Divider className="h-14 mx-5" orientation="vertical" />
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
                      <Divider className="h-14 mx-5" orientation="vertical" />
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
              {errors.timeCodeArray?.message && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.timeCodeArray?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-between mt-2 pt-[20px] mb-4">
          <div className="flex gap-4 items-center">
            <Button
              color="primary"
              variant="flat"
              size="sm"
              startContent={<CheckIcon />}
              onClick={() => {
                const timeCodes = allTimeCodes?.rows.map((row: any) => row.key);
                onChangeCheckTimeCode(timeCodes);
                setValue("timeCodeArray", timeCodes);
                setTimeCodeArrays(timeCodes);
              }}
            >
              Chọn tất cả
            </Button>
            <Button
              color="danger"
              variant="flat"
              startContent={<AiOutlineClose />}
              size="sm"
              onClick={() => {
                onChangeCheckTimeCode([]);
                setTimeCodeArrays([]);
                setValue("timeCodeArray", []);
              }}
            >
              Xóa tất cả lịch
            </Button>
          </div>
          <div className="flex items-center gap-2 justify-end ">
            <Button color="danger" variant="light" onClick={clickCancel}>
              Hủy
            </Button>

            <Button color="primary" isLoading={isSubmitting} type="submit">
              {obEdit ? "Lưu" : "Thêm"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
