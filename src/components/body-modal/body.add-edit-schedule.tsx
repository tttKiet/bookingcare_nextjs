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
  Button,
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
  SelectField,
} from "../form";
import { SelectDateCalendarField } from "../form/select-date-field";
import dayjs, { Dayjs } from "dayjs";
import debounce from "lodash.debounce";

import axios from "../../axios";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import Link from "next/link";
export interface ReqSchedule extends HealthExaminationSchedule {
  timeCodeArray: Array<string>;
}
export interface BodyModalScheduleProps {
  handleSubmitForm: (data: Partial<ReqSchedule>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEdit?: ReqSchedule | null;
}

export function BodyModalSchedule({
  clickCancel,
  handleSubmitForm,
  loading,
  obEdit,
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
      workingId: "",
      date: dayjs(new Date()),
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
  const { data: doctors } = useSWR(
    `${API_ACCOUNT_STAFF_DOCTOR_WORKING}?doctorEmail=${emailSearch}`,
    {
      revalidateOnMount: true,
    }
  );

  const [dateSelect, setDateSelect] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );
  const onChangeDate = async (date: Dayjs | null) => {
    setDateSelect(date);
    if (date) {
      setValue("date", date);
    }
  };

  const [workingIdSelect, setDoctorIdSelect] = useState<Event>();

  const { data: scheduleDoctors } = useSWR<
    ResDataPaginations<HealthExaminationSchedule>
  >(
    `${API_DOCTOR_SCHEDULE_HEALTH_EXAM}?workingId=${workingIdSelect}&date=${dateSelect}`,
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
    if (scheduleDoctors) {
      const timeCodes =
        scheduleDoctors?.rows.map((row: any) => row.timeCode) || [];
      setValue("timeCodeArray", timeCodes);
    }
  }, [scheduleDoctors]);
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
    setOptionDoctors(() => {
      return (
        doctors?.rows?.map((t: Working) => ({
          value: t.id,
          label: (
            <div>
              <h3 className="text-sm text-gray-600 font-medium">
                {t?.Staff?.fullName}
              </h3>
              <span className="text-xs text-black font-normal flex items-center justify-between">
                <span>{t?.Staff?.email}</span>
                <span>{t?.Staff?.AcademicDegree?.name}</span>
              </span>
            </div>
          ),
        })) || []
      );
    });
  }, [doctors]);

  async function handleSubmitLocal(data: Partial<ReqSchedule>) {
    console.log(data);
    const isOk = await handleSubmitForm({
      ...data,
    });
    if (isOk) {
      reset({
        date: dayjs(new Date()),
      });
      setDateSelect(dayjs(new Date()));
      clickCancel();
    }
  }

  async function onChangeSelectDoctor(e: Event) {
    setDoctorIdSelect(e);
  }
  const filterOption: any = (
    input: string,
    option: { label: string; value: string }
  ) => {
    return !!onSearchSelectDoctors
      ? true
      : (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  };

  const onChangeCheckTimeCode = (checkedValues: CheckboxValueType[]) => {
    onChangeTimeCodeArray(checkedValues);
  };

  React.useEffect(() => {
    if (obEdit?.Working) {
      setOptionDoctors(() => {
        return [
          {
            value: obEdit.id,
            label: (
              <div>
                <h3 className="text-sm text-gray-600 font-medium">
                  {obEdit.Working.Staff.fullName}
                </h3>
                <span className="text-xs text-black font-normal flex items-center justify-between gap-2">
                  <span>{obEdit.Working.Staff.email}</span>
                  <span>{obEdit.Working.Staff.fullName}</span>
                </span>
              </div>
            ),
          },
        ];
      });
    }
  }, [obEdit, reset]);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitLocal)}
      className="flex flex-col gap-2 pt-4"
    >
      <div>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col">
            <label className="top-1 text-sm font-medium mb-2" htmlFor="">
              Lịch của bác sỉ
            </label>
            <div>
              <Select
                onSearch={debounce(onSearchSelectDoctors, 300)}
                placement="bottomLeft"
                className="sm:w-[40%] w-full"
                size="large"
                placeholder="Nhập email bác sỉ..."
                virtual={false}
                showSearch
                optionFilterProp="children"
                notFoundContent={<div>Không tìm thây...</div>}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                options={optionDoctors}
                filterOption={filterOption}
                onChange={(e: any) => {
                  onChangeWorkingId(e);
                  onChangeSelectDoctor(e);
                }}
                value={workingIdValue || null}
              />
            </div>

            {errorWorkingId && (
              <p className="text-red-500 font-medium text-xs pt-1">
                {errorWorkingId?.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="top-1 text-sm font-medium mb-2" htmlFor="">
              Ngày khám
            </label>
            <div>
              <DatePicker
                allowClear={false}
                bordered={true}
                value={dateSelect}
                onChange={onChangeDate}
                placement="bottomLeft"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="top-1 text-sm font-medium mb-2" htmlFor="">
              Số lượng tối đa khám trên một đơn vị
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
              <p className="text-red-500 font-medium text-xs pt-1">
                {errorMaxNumber?.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="top-1 text-sm font-medium mb-2" htmlFor="">
              Khung giờ
            </label>
            <Checkbox.Group
              style={{ width: "100%" }}
              onChange={onChangeCheckTimeCode}
              value={timeCodeArrayValue}
            >
              <Row>
                {allTimeCodes?.rows.map((code: Code) => {
                  return (
                    <Col span={8} key={code.key}>
                      <Checkbox value={code.key}>{code.value}</Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
            {errorTimeCodeArray && (
              <p className="text-red-500 font-medium text-xs pt-1">
                {errorTimeCodeArray?.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-base text-gray-900">Lưu ý:</h3>
          <ul className="mt-">
            <li className="text-gray-400">
              Chỉ hiển thị các bác sỉ đang công tác. Xem công tác ở
              <Link href="/admin/work" className="pl-1 text-blue-500 underline">
                đây
              </Link>
              .
            </li>
          </ul>
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
            {obEdit?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
