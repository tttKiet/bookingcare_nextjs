"use client";

// import { schemaValidateRegister } from "@/schema-validate";
import {
  API_ACCOUNT_STAFF_DOCTOR,
  API_ACCOUNT_STAFF_DOCTOR_WORKING,
  API_ACEDEMIC_DEGREE,
  API_CODE,
  API_DOCTOR_SCHEDULE_HEALTH_EXAM,
  API_HEALTH_FACILITIES,
  API_ROLE,
  API_SPECIALIST,
} from "@/api-services/constant-api";
import {
  AcademicDegree,
  Code,
  HealthExaminationSchedule,
  HealthFacility,
  Role,
  Specialist,
  Staff,
  Working,
} from "@/models";
import {
  schemaCodeScheduleHealth,
  schemaStaffBody,
  schemaWorkingBody,
} from "@/schema-validate";
import { ResDataPaginations } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Checkbox,
  Col,
  DatePicker,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { GoRepoForked } from "react-icons/go";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockSquareRounded } from "react-icons/tb";
import useSWR from "swr";
import {
  InputField,
  InputTextareaField,
  RadioGroupField,
  SelectSearchField,
} from "../form";
import { SelectDateCalendarField } from "../form/select-date-field";
import dayjs, { Dayjs } from "dayjs";
import debounce from "lodash.debounce";

import axios from "../../axios";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import Link from "next/link";
import moment from "moment";
import { Button, CheckboxGroup, Chip, Input, User } from "@nextui-org/react";
import CheckBoxSchedule from "../common/CheckBoxSchedule";
import { CheckIcon } from "../icons/CheckIcon";
import { AiOutlineClose } from "react-icons/ai";
import { NotificationIcon } from "../icons/NotificationIcon";
export interface ReqSchedule extends HealthExaminationSchedule {
  timeCodeArray: Array<string>;
}
export interface BodyModalScheduleProps {
  handleSubmitForm: (data: Partial<ReqSchedule>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEdit?: ReqSchedule | null;
  workingId?: string | boolean;
  obEditScheduleDoctor: {
    staffId: string;
    workingId: string;
    date: any;
  } | null;
  auth?: "doctor";
}

export function BodyModalSchedule({
  clickCancel,
  handleSubmitForm,
  loading,
  obEdit,
  workingId,
  obEditScheduleDoctor,
  auth,
}: BodyModalScheduleProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitted, isSubmitting },
    setValue,
    reset,
    getValues,
    register,
  } = useForm({
    defaultValues: {
      workingId: workingId && workingId !== true ? workingId : "",
      maxNumber: 3,
      timeCodeArray: [],
    },
    resolver: yupResolver(schemaCodeScheduleHealth),
  });

  const {
    field: { value: timeCodeArrayValue, onChange: onChangeTimeCodeArray },
    fieldState: { error: errorTimeCodeArray },
  } = useController({
    name: "timeCodeArray",
    control,
  });

  const {
    field: { value: maxNumber, onChange: onChangeMaxNumber },
    fieldState: { error: errorMaxNumber },
  } = useController({
    name: "maxNumber",
    control,
  });

  const {
    field: { value: workingIdValue, onChange: onChangeWorkingId },
    fieldState: { error: errorWorkingId },
  } = useController({
    name: "workingId",
    control,
  });
  const [emailSearch, setEmailSearch] = useState<string>("");

  const { data: doctors } = useSWR<ResDataPaginations<Working>>(
    `${API_ACCOUNT_STAFF_DOCTOR_WORKING}?doctorEmail=${emailSearch}&workingId=${
      obEditScheduleDoctor?.workingId || ""
    }`,
    {
      revalidateOnMount: true,
    }
  );

  const [dateSelect, setDateSelect] = React.useState<string>(
    new Date().toString()
  );
  const onChangeDate = async (date: string) => {
    setDateSelect(date);
    if (date) {
      setValue("date", date);
    }
  };

  const [workingIdSelect, setWorkingIdSelect] = useState<string | null>(
    obEditScheduleDoctor?.workingId || null
  );

  const [workingSelect, setWorkingSelect] = useState<Working | null>(null);

  const { data: scheduleDoctors, mutate: mutateSchedules } = useSWR<
    ResDataPaginations<HealthExaminationSchedule>
  >(
    `${API_DOCTOR_SCHEDULE_HEALTH_EXAM}/doctor?workingId=${
      obEditScheduleDoctor?.workingId || workingId || workingIdSelect
    }&date=${dateSelect}`,
    {
      revalidateOnMount: false,
    }
  );

  const { data: allTimeCodes } = useSWR<ResDataPaginations<Code>>(
    `${API_CODE}/time`,
    {
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (obEditScheduleDoctor) {
      const doctorFilter: Working = doctors?.rows.find(
        (d: Working) => d.id == obEditScheduleDoctor.workingId
      );

      const email = doctorFilter?.Staff?.email || "";
      onChangeSelectDoctor(email);
    }
  }, [obEditScheduleDoctor, doctors]);

  useEffect(() => {
    if (scheduleDoctors) {
      const timeCodes =
        scheduleDoctors?.rows.map((row: any) => row.timeCode) || [];

      setValue("timeCodeArray", timeCodes);
    }
  }, [scheduleDoctors]);

  useEffect(() => {
    if (scheduleDoctors) {
      const maxNumber = scheduleDoctors?.rows?.[0]?.maxNumber || 1;
      setValue("maxNumber", maxNumber);
    }
  }, [scheduleDoctors]);

  useEffect(() => {
    if (obEditScheduleDoctor?.workingId) {
      setWorkingIdSelect(obEditScheduleDoctor.staffId);
      onChangeWorkingId(obEditScheduleDoctor.workingId);
      if (obEditScheduleDoctor.date) {
        const datePassProps = dayjs(new Date(obEditScheduleDoctor.date));
        // onChangeDate(datePassProps);
      }
    }
  }, [obEditScheduleDoctor?.workingId, obEditScheduleDoctor?.date]);

  function onSearchSelectDoctors(value: string): void {
    setEmailSearch(value);
  }

  const [optionDoctors, setOptionDoctors] = useState<
    Array<{
      value: string;
      label: React.ReactNode;
    }>
  >([]);

  useEffect(() => {
    if (workingId && workingId !== true) {
      setValue("workingId", workingId);
    }
  }, [workingId]);

  async function handleSubmitLocal(data: Partial<ReqSchedule>) {
    const isOk = await handleSubmitForm({
      ...data,
    });
    if (isOk) {
      clickCancel();
    }
  }

  async function onChangeSelectDoctor(email: string) {
    // email
    const doctorFilter: Working = doctors?.rows.find(
      (d: Working) => d.Staff.email == email
    );

    setWorkingSelect(doctorFilter);
    const doctorWorkingId = doctorFilter?.id || "";
    setWorkingIdSelect(doctorWorkingId);
    onChangeWorkingId(doctorWorkingId);
  }

  const onChangeCheckTimeCode = (checkedValues: any) => {
    onChangeTimeCodeArray(checkedValues);
  };

  useEffect(() => {
    if (obEdit?.Working) {
      setWorkingSelect(obEdit?.Working || null);
      setOptionDoctors(() => {
        return [
          {
            value: obEdit.id,
            label: (
              <div className="flex items-center justify-between gap-2">
                <User
                  avatarProps={{ radius: "lg" }}
                  description={`doctor|${obEdit?.Working?.Staff?.AcademicDegree.name}`}
                  name={`${obEdit?.Working?.Staff.fullName}`}
                >
                  {obEdit?.Working?.Staff.fullName}
                </User>

                <span>{obEdit?.Working?.Staff.email}</span>
              </div>
            ),
          },
        ];
      });
    }
  }, [obEdit, reset]);

  useEffect(() => {
    setOptionDoctors(() => {
      return doctors?.rows?.map((t: Working) => ({
        value: t.Staff.email,
        label: (
          <div className="flex items-center justify-between gap-2">
            <User
              avatarProps={{ radius: "lg" }}
              description={`doctor|${t?.Staff?.AcademicDegree.name}`}
              name={`${t?.Staff.fullName}`}
            >
              {t.Staff.fullName}
            </User>

            <span>{t.Staff.email}</span>
          </div>
        ),
      }));
    });
  }, [doctors]);

  return (
    <div>
      {auth === "doctor" && !workingId && !loading ? (
        <div className=" pt-4">
          <Chip
            startContent={<NotificationIcon size={18} />}
            variant="flat"
            color="warning"
          >
            Bạn chưa được thêm vào danh sách công tác!
          </Chip>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(handleSubmitLocal)}
          className="flex flex-col gap-2 "
        >
          <div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <div className="flex flex-col">
                  {!workingId && auth != "doctor" && (
                    <div className="min-h-[160px]">
                      <>
                        <label
                          className="top-1 text-base font-medium mb-2 block"
                          htmlFor=""
                        >
                          Lịch của bác sỉ
                        </label>
                        <div>
                          <SelectSearchField
                            placeholder="Email bác sỉ..."
                            data={optionDoctors}
                            handleSearchSelect={debounce(
                              onSearchSelectDoctors,
                              300
                            )}
                            value={emailSearch}
                            debounceSeconds={300}
                            handleChangeSelect={(e: string) => {
                              onChangeSelectDoctor(e);
                            }}
                          />
                        </div>
                        {workingSelect && (
                          <div className="flex items-center justify-between gap-2 my-6">
                            <User
                              avatarProps={{ radius: "lg" }}
                              description={`doctor|${workingSelect?.Staff?.AcademicDegree.name}`}
                              name={`${workingSelect?.Staff.fullName}`}
                            >
                              <span className="font-bold">
                                {workingSelect?.Staff.fullName}
                              </span>
                            </User>

                            <span>{workingSelect?.Staff.email}</span>
                          </div>
                        )}
                      </>
                    </div>
                  )}
                </div>

                {errorWorkingId && (
                  <p className="text-sm text-red-500 font-medium">
                    {errorWorkingId?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col mb-2">
                <label className="top-1 text-base font-medium mb-2" htmlFor="">
                  Ngày khám
                </label>
                <div>
                  <InputField
                    control={control}
                    name="date"
                    type="date"
                    label="date"
                  ></InputField>
                  {/* <Input
                    type="date"
                    value={dateSelect}
                    onChange={(e) => onChangeDate(e.target.value)}
                  /> */}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="top-1 text-base font-medium mb-2" htmlFor="">
                  Số lượng bệnh nhân trong một khung giờ
                </label>
                <InputNumber
                  bordered
                  placeholder="Vd: 3"
                  className="px w-[50px] outline-none text-base"
                  spellCheck={false}
                  min={0}
                  max={5}
                  name="maxNumber"
                  onChange={onChangeMaxNumber}
                  value={maxNumber}
                />
                {errorMaxNumber && (
                  <p className="text-sm text-red-500 font-medium">
                    {errorMaxNumber?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="top-1 text-base font-medium mb-2" htmlFor="">
                  Khung giờ
                </label>

                <CheckboxGroup
                  value={timeCodeArrayValue}
                  onChange={onChangeCheckTimeCode}
                  classNames={{
                    base: "w-full",
                  }}
                  className="gap-1"
                  orientation="horizontal"
                >
                  {allTimeCodes?.rows.map((code: Code) => {
                    return (
                      <CheckBoxSchedule key={code.key} value={code.key}>
                        {code.value}
                      </CheckBoxSchedule>
                    );
                  })}
                </CheckboxGroup>
                {errorTimeCodeArray && (
                  <p className="text-sm text-red-500 font-medium">
                    {errorTimeCodeArray?.message}
                  </p>
                )}
              </div>
            </div>

            {!workingId ? (
              <>
                <div className="mt-3">
                  <h3 className="text-base text-gray-900">Lưu ý:</h3>
                  <ul className="mt-">
                    <li className="text-gray-400">
                      Chỉ hiển thị các bác sỉ đang công tác. Xem công tác ở
                      <Link
                        href="/admin/work"
                        className="pl-1 text-blue-500 underline"
                      >
                        đây
                      </Link>
                      .
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between mt-2 pt-[20px]">
            <div className="flex gap-4 items-center">
              <Button
                color="primary"
                variant="flat"
                size="sm"
                startContent={<CheckIcon />}
                onClick={() => {
                  const timeCodes = allTimeCodes?.rows.map(
                    (row: any) => row.key
                  );
                  onChangeCheckTimeCode(timeCodes);
                  setValue("timeCodeArray", timeCodes);
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
                {obEdit?.id ? "Lưu" : "Thêm"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
