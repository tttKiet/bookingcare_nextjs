"use client";

import {
  API_CHECK_UP_HEALTH_RECORD,
  API_CODE,
  API_HEALTH_RECORD,
} from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import {
  ClinicRoom,
  Code,
  HealthExaminationSchedule,
  HealthRecord,
  PatientProfile,
  WorkRoom,
} from "@/models";
import { Button, DatePicker, Modal, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import * as React from "react";
import { AiOutlineEye } from "react-icons/ai";
import useSWR from "swr";
import { PatientProfileItem } from "../common";
import { TableSortFilter } from "../table";
import { ResDataPaginations } from "@/types";
import { DefaultOptionType } from "antd/es/select";
import { staffApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { Option } from "antd/es/mentions";
const { confirm } = Modal;

type DataIndex = keyof ClinicRoom;
export interface DoctorCheckupInfo {
  workRoom: WorkRoom;
  schedules: {
    count: number;
    limit: number;
    offset: number;
    rows: HealthExaminationSchedule[];
  };
}
export function ManagerCheckUp() {
  const { profile } = useAuth();
  const isDoctor = profile?.Role?.keyType === "doctor";

  const [isShowModalDetailPatient, setIsShowModalDetailPatient] =
    React.useState(false);
  const [doctorInfor, setDoctorInfor] = React.useState<WorkRoom | null>(null);
  const [loadingSelectValue, setLoadingSelectValue] = React.useState<
    string | null
  >(null);
  const [dataPatientProfileChoose, setDataPatientProfileChoose] =
    React.useState<PatientProfile | null>(null);
  const [date, setDate] = React.useState<Dayjs>(dayjs(new Date()));
  const [selectTime, setSelectTime] = React.useState<string | null>(null);
  const staffId = (isDoctor && profile?.id) || null;
  const { data: doctorData } = useSWR<DoctorCheckupInfo>(
    `${API_CHECK_UP_HEALTH_RECORD}?staffId=${staffId}&date=${date}`,
    {
      dedupingInterval: 12000,
    }
  );

  // Get Code Status
  const { data: statusCodes } = useSWR<ResDataPaginations<Code>>(
    `${API_CODE}?name=Status`,
    {
      dedupingInterval: 12000,
    }
  );

  const [optionCodes, setOptionCodes] = React.useState<
    DefaultOptionType[] | undefined
  >(undefined);

  React.useEffect(() => {
    const data = statusCodes?.rows.map((r: Code) => ({
      label: r.value,
      value: r.key,
    }));
    setOptionCodes(data);
  }, [statusCodes]);
  console.log("optionCodes", optionCodes);
  function toggleShowModalDetailProfileChoose() {
    setIsShowModalDetailPatient((s) => !s);
  }

  const {
    data: healthRecords,
    mutate: mutateHealthRecord,
    isLoading,
  } = useSWR<HealthRecord[]>(`${API_HEALTH_RECORD}?timeCodeId=${selectTime}`, {
    dedupingInterval: 2000,
  });
  console.log("healthRecords", healthRecords);

  // Select date
  function handleChangeSelectDate(date: Dayjs | null) {
    date && setDate(date);
  }

  // Select time
  const optionSelectTime = doctorData?.schedules?.rows.map((r) => ({
    label: r.TimeCode.value,
    value: r.id,
  }));
  function handleChangeSelectTime(value: string) {
    setSelectTime(value);
  }

  async function onChangeStatus(statusId: string, healthRecordId: string) {
    if (loadingSelectValue) {
      return;
    }
    const api = staffApi.editStatusHealthRecord({
      statusCode: statusId,
      id: healthRecordId,
    });
    setLoadingSelectValue(healthRecordId);

    const isOk = await toastMsgFromPromise(api);
    setLoadingSelectValue(null);

    // const newPosns = new Promise((resolve, reject) => {
    //   setTimeout(resolve, 2000);
    // });
    // setLoadingSelectValue(healthRecordId);
    // newPosns.then(() => {
    //   setLoadingSelectValue(null);
    // });
    if (isOk) {
      mutateHealthRecord();
    }
  }

  // Table
  const data = React.useMemo<HealthRecord[]>(() => {
    return (
      healthRecords?.map((healthRecord: HealthRecord) => ({
        ...healthRecord,
        key: healthRecord.id,
      })) || []
    );
  }, [healthRecords]);

  const columns: ColumnsType<HealthRecord> = React.useMemo(() => {
    return [
      {
        title: "Số thứ tự",
        dataIndex: "orderNumber",
        key: "orderNumber",
        render: (text) => <span className="font-semibold">{text}</span>,
        defaultFilteredValue: ["orderNumber"],
        sorter: (a, b) => (a.orderNumber > b.orderNumber ? 1 : -1),
        width: "18%",
      },
      {
        title: "Bệnh nhân",
        dataIndex: ["Booking", "PatientProfile", "fullName"],
        key: "Booking.PatientProfile.fullName",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.Booking.PatientProfile.fullName.localeCompare(
            b.Booking.PatientProfile.fullName
          ),
      },
      {
        title: "Email bệnh nhân",
        dataIndex: ["Booking", "PatientProfile", "email"],
        key: "Booking.PatientProfile.email",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.Booking.PatientProfile.email.localeCompare(
            b.Booking.PatientProfile.email
          ),
      },
      {
        title: "Hành động",
        key: "actions",
        render: (text) => {
          console.log(text);

          return (
            <div className="flex items-center gap-2">
              <Button
                type="dashed"
                className="flex items-center gap-2"
                onClick={() => {
                  setDataPatientProfileChoose(text.Booking.PatientProfile);
                  toggleShowModalDetailProfileChoose();
                }}
              >
                Thông tin <AiOutlineEye />
              </Button>
              <Select
                style={{ width: 160 }}
                // value={text.statusCode}
                defaultValue={text.statusCode}
                disabled={!!loadingSelectValue}
                onChange={(value) => onChangeStatus(value, text.id)}
                loading={loadingSelectValue == text.id}
                virtual={false}
              >
                {optionCodes?.map((op) => {
                  let style = "";

                  if (op.value === "S1") {
                    style = "bg-pink-400";
                  } else if (op.value === "S2") {
                    style = "bg-blue-400";
                  } else if (op.value === "S3") {
                    style = "bg-red-400";
                  }
                  return (
                    <Select.Option value={op.value} key={op.value}>
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${style}`}
                        ></span>
                        {op.label}
                      </span>
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
          );
        },
      },
    ];
  }, [optionCodes, loadingSelectValue]);

  React.useEffect(() => {
    setSelectTime(doctorData?.schedules?.rows?.[0]?.id || null);
  }, [doctorData?.schedules]);

  React.useEffect(() => {
    if (doctorData?.workRoom) setDoctorInfor(doctorData.workRoom);
  }, [staffId, doctorData?.workRoom?.id]);

  return (
    <div>
      <Modal
        title="Hồ sơ bệnh nhân"
        open={isShowModalDetailPatient}
        onCancel={toggleShowModalDetailProfileChoose}
        width={620}
      >
        {dataPatientProfileChoose && (
          <PatientProfileItem data={dataPatientProfileChoose} />
        )}
      </Modal>
      <div>
        <h4 className="text-black">{doctorInfor?.Working.Staff.fullName}</h4>
        <div className="mt-1">
          <span>
            Phòng khám:
            <span className="px-2 mx-2 py-1 bg-pink-500 text-white rounded-md">
              {doctorInfor?.ClinicRoom.roomNumber}
            </span>
            <span className="text-pink-500 font-semibold">
              {doctorInfor?.ClinicRoom.HealthFacility.name}
            </span>
          </span>
        </div>
      </div>
      <div className="mt-3">
        <div className="gr-title-admin flex items-center justify-between  mb-3">
          <h3>Danh sách bệnh nhân khám bệnh</h3>
          <div className="gap-2 flex items-center">
            {optionSelectTime && optionSelectTime?.length > 0 ? (
              <Select
                className="min-w-[120px]"
                defaultValue={optionSelectTime?.[0]?.value}
                value={selectTime}
                onChange={handleChangeSelectTime}
                options={optionSelectTime}
              />
            ) : (
              <span className="text-red-400">Chưa có lịch</span>
            )}
            <DatePicker
              allowClear={false}
              value={date}
              onChange={handleChangeSelectDate}
              defaultValue={date}
            />
          </div>
        </div>
        <TableSortFilter
          options={{
            loading: isLoading,
            showSorterTooltip: false,
          }}
          columns={columns}
          data={data}
        />
      </div>
    </div>
  );
}
