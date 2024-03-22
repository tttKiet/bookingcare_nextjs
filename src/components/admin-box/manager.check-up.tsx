"use client";

import { staffApi } from "@/api-services";
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
import { ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { DatePicker, Modal, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import type { ColumnsType } from "antd/es/table";
import { RadioChangeEvent } from "antd/lib";
import dayjs, { Dayjs } from "dayjs";
import { AiOutlineEye, AiOutlineFieldTime } from "react-icons/ai";
import { BsDot, BsPatchCheckFill } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneOutline, IoCloseSharp } from "react-icons/io5";
import useSWR from "swr";
import { PatientProfileItem } from "../common";
import ChangeStatusHealthRecord from "../common/ChangeStatusHealthRecord";
import { TableSortFilter } from "../table";
import { useEffect, useMemo, useState } from "react";
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
  const [valueCheckBoxChangeStatus, setValueCheckBoxChangeStatus] =
    useState("S1");
  const [editHealthRecordId, setEditHealthRecordId] = useState("");
  const onChangeStt = (e: RadioChangeEvent) => {
    console.log(e.target.value);
    setValueCheckBoxChangeStatus(e.target.value);
  };
  const [isShowModalDetailPatient, setIsShowModalDetailPatient] =
    useState(false);
  const [isShowModalChangeStatus, setIsShowModalChangeStatus] = useState(false);
  const [doctorInfor, setDoctorInfor] = useState<WorkRoom | null>(null);
  const [loadingSelectValue, setLoadingSelectValue] = useState<string | null>(
    null
  );
  const [dataPatientProfileChoose, setDataPatientProfileChoose] =
    useState<PatientProfile | null>(null);
  const [date, setDate] = useState<Dayjs>(dayjs(new Date()));
  const [selectTime, setSelectTime] = useState<string | null>(null);
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

  const [optionCodes, setOptionCodes] = useState<
    DefaultOptionType[] | undefined
  >(undefined);

  useEffect(() => {
    const data = statusCodes?.rows.map((r: Code) => ({
      label: r.value,
      value: r.key,
    }));
    setOptionCodes(data);
  }, [statusCodes]);
  function toggleShowModalDetailProfileChoose() {
    setIsShowModalDetailPatient((s) => !s);
  }

  function toggleShowModalChangeStatus() {
    setIsShowModalChangeStatus((s) => !s);
  }

  const {
    data: healthRecords,
    mutate: mutateHealthRecord,
    isLoading,
  } = useSWR<HealthRecord[]>(`${API_HEALTH_RECORD}?timeCodeId=${selectTime}`, {
    dedupingInterval: 2000,
  });

  // Select date
  function handleChangeSelectDate(date: Dayjs | null) {
    date && setDate(date);
  }

  // Select time
  const optionSelectTime = doctorData?.schedules?.rows.map((r) => ({
    label: r?.TimeCode?.value,
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

    if (isOk) {
      mutateHealthRecord();
    }
  }
  function handleClickAction(
    text: string,
    content: string,
    statusKey: string,
    healthRecordId: string
  ): void {
    confirm({
      title: text,
      icon: <ExclamationCircleFilled />,
      content: content,
      async onOk() {
        await onChangeStatus(statusKey, healthRecordId);
        return true;
      },
      onCancel() {},
    });
  }

  // Table
  const data = useMemo<HealthRecord[]>(() => {
    return (
      healthRecords?.map((healthRecord: HealthRecord) => ({
        ...healthRecord,
        key: healthRecord.id,
      })) || []
    );
  }, [healthRecords]);

  const columns: ColumnsType<HealthRecord> = useMemo(() => {
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
        // dataIndex: ["Booking", "PatientProfile", "fullName"],
        key: "Booking.PatientProfile.fullName",

        render: (text) => {
          return (
            <p className="flex items-center gap-2">
              <a className="">{text.Booking.PatientProfile.fullName}</a>
              <button
                className="flex items-center gap-2 border 
                 outline-none border-dashed px-2 py-1 rounded-md border-gray-700"
                onClick={() => {
                  setDataPatientProfileChoose(text.Booking.PatientProfile);
                  toggleShowModalDetailProfileChoose();
                }}
              >
                <AiOutlineEye />
              </button>
            </p>
          );
        },
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
        title: "Trạng thái",
        dataIndex: ["status"],
        key: "status",
        render: (text) => {
          let Style: any = "Loi";
          if (text.key === "S1") {
            Style = (
              <span
                className={`bg-gray-500 text-white px-2  rounded-md inline-flex items-center gap-1`}
              >
                <span className="mr-1"> ...</span>
                {text?.value?.toLowerCase()}
              </span>
            );
          } else if (text.key === "S2") {
            Style = (
              <span
                className={`bg-yellow-400 text-white px-2  rounded-md  inline-flex items-center gap-1`}
              >
                <AiOutlineFieldTime />
                {text.value?.toLowerCase()}
              </span>
            );
          } else if (text.key === "S3") {
            Style = (
              <span
                className={`border border-dashed font-bold border-green-500 text-green-500 px-2 rounded-md  inline-flex items-center gap-1`}
              >
                <BsPatchCheckFill />
                {text.value?.toLowerCase()}
              </span>
            );
          } else {
            Style = (
              <span
                className={`border border-dashed border-red-400  text-red-400 px-2 rounded-md  inline-flex items-center gap-1`}
              >
                <FcCancel />
                {text.value?.toLowerCase()}
              </span>
            );
          }

          return Style;
        },
      },
      {
        title: "Hành động",
        key: "actions",
        render: (text) => {
          let Style: any = "Loi";
          if (text.status.key === "S1") {
            Style = (
              <>
                <button
                  onClick={() =>
                    handleClickAction(
                      "Xác nhận bệnh nhân đã thanh toán?",
                      "Bạn sẽ xác nhận bệnh nhân này đã đến quầy thanh toán, thanh toán và chờ khám bệnh.",
                      "S2",
                      text.id
                    )
                  }
                  className=" px-2 rounded-md flex items-center gap-1 bg-blue-400 text-white transition-all hover:opacity-90 hover:scale-105"
                >
                  <IoCheckmarkDoneOutline />
                  thanh toán
                </button>
              </>
            );
          } else if (text.status.key === "S2") {
            Style = (
              <button
                onClick={() =>
                  handleClickAction(
                    "Xác nhận bệnh nhân đã khánm?",
                    "Bạn sẽ xác nhận bệnh nhân này đã được khám bệnh.",
                    "S3",
                    text.id
                  )
                }
                className=" px-2 rounded-md flex items-center gap-1 bg-blue-400 text-white transition-all hover:opacity-90 hover:scale-105"
              >
                <IoCheckmarkDoneOutline />
                khám bệnh
              </button>
            );
          } else if (text.status.key === "S3" || text.status.key === "S4") {
            Style = (
              <button
                onClick={() => {
                  setEditHealthRecordId(text.id);
                  setValueCheckBoxChangeStatus(text.status.key);
                  toggleShowModalChangeStatus();
                }}
                className=" px-2 rounded-md flex items-center gap-1 bg-blue-400 text-white transition-all hover:opacity-90 hover:scale-105"
              >
                <BsDot />
                thay đổi trạng thái
              </button>
            );
          } else {
            Style = (
              <span
                className={`bg-red-400 text-white px-2 rounded-md  inline-flex items-center gap-1`}
              >
                <FcCancel />
                {text.status?.value.toLowerCase()}
              </span>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 ">
                {Style}
                {text.status.key < "S3" && (
                  <button
                    onClick={() =>
                      handleClickAction(
                        "Xác nhận hủy phiếu khám bệnh này?",
                        "Bạn sẽ xác nhận bệnh nhân này chưa thanh toán hoặc không đến khám, hủy.",
                        "S4",
                        text.id
                      )
                    }
                    className=" px-2 rounded-md flex items-center gap-1 bg-red-400 text-white transition-all hover:opacity-90 hover:scale-105"
                  >
                    <IoCloseSharp />
                    xóa
                  </button>
                )}
              </div>
            </div>
          );
        },
      },
    ];
  }, [optionCodes, loadingSelectValue, valueCheckBoxChangeStatus]);

  useEffect(() => {
    setSelectTime(doctorData?.schedules?.rows?.[0]?.id || null);
  }, [doctorData?.schedules]);

  useEffect(() => {
    if (doctorData?.workRoom) setDoctorInfor(doctorData.workRoom);
  }, [staffId, doctorData?.workRoom?.id]);

  return (
    <div>
      <Modal
        title="Hồ sơ bệnh nhân"
        open={isShowModalDetailPatient}
        onCancel={toggleShowModalDetailProfileChoose}
        width={620}
        onOk={toggleShowModalDetailProfileChoose}
      >
        {dataPatientProfileChoose && (
          <PatientProfileItem data={dataPatientProfileChoose} />
        )}
      </Modal>
      <Modal
        title="Thay đổi trạng thái của phiếu khám"
        open={isShowModalChangeStatus}
        onCancel={toggleShowModalChangeStatus}
        width={620}
        onOk={() => {
          onChangeStatus(valueCheckBoxChangeStatus, editHealthRecordId);
          toggleShowModalChangeStatus();
        }}
      >
        <ChangeStatusHealthRecord
          onChange={onChangeStt}
          value={valueCheckBoxChangeStatus}
        />
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
