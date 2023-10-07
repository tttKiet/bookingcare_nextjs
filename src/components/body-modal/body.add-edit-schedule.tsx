"use client";

// import { schemaValidateRegister } from "@/schema-validate";
import {
  API_ACCOUNT_STAFF_DOCTOR,
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
import { Button, Checkbox, Col, DatePicker, Row, Select, Space } from "antd";
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
      staffId: "",
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
    field: { value: staffIdValue, onChange: onChangeStaffId },
    fieldState: { error: errorStaffId },
  } = useController({
    name: "staffId",
    control,
  });

  const [emailSearch, setEmailSearch] = useState<string>("");
  const { data: doctors } = useSWR(
    `${API_ACCOUNT_STAFF_DOCTOR}?email=${emailSearch}`,
    {
      revalidateOnMount: false,
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

  const [doctorIdSelect, setDoctorIdSelect] = useState<Event>();

  const { data: scheduleDoctors } = useSWR<
    ResDataPaginations<HealthExaminationSchedule>
  >(
    `${API_DOCTOR_SCHEDULE_HEALTH_EXAM}?staffId=${doctorIdSelect}&date=${dateSelect}`,
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
        doctors?.rows?.map((t: Staff) => ({
          value: t.id,
          label: (
            <div>
              <h3 className="text-sm text-gray-600 font-medium">
                {t.fullName}
              </h3>
              <span className="text-xs text-black font-normal flex items-center justify-between">
                <span>{t.email}</span>
                <span>{t.AcademicDegree.name}</span>
              </span>
            </div>
          ),
        })) || []
      );
    });
  }, [doctors]);

  async function handleSubmitLocal(data: Partial<ReqSchedule>) {
    const isOk = await handleSubmitForm({
      ...data,
    });
    if (isOk) {
      reset({});
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
    if (obEdit?.staffId) {
      setOptionDoctors(() => {
        return [
          {
            value: obEdit.Staff.id,
            label: (
              <div>
                <h3 className="text-sm text-gray-600 font-medium">
                  {obEdit.Staff.fullName}
                </h3>
                <span className="text-xs text-black font-normal flex items-center justify-between gap-2">
                  <span>{obEdit.Staff.email}</span>
                  <span>{obEdit.Staff.fullName}</span>
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
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
          <div className=" flex flex-col">
            <Select
              onSearch={debounce(onSearchSelectDoctors, 300)}
              placement="bottomLeft"
              // style={{ width: '100%' }}
              size="large"
              placeholder="Nhập email bác sỉ..."
              virtual={false}
              showSearch
              optionFilterProp="children"
              notFoundContent={<div>Khônng tìm thây...</div>}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              options={optionDoctors}
              filterOption={filterOption}
              onChange={(e: any) => {
                onChangeStaffId(e);
                onChangeSelectDoctor(e);
              }}
              value={staffIdValue || null}
            />

            {errorStaffId && (
              <p className="text-red-500 font-medium text-xs pt-1">
                {errorStaffId?.message}
              </p>
            )}
          </div>
          <div>
            <DatePicker
              allowClear={false}
              bordered={true}
              value={dateSelect}
              onChange={onChangeDate}
              placement="bottomLeft"
            />
          </div>

          <div>
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
